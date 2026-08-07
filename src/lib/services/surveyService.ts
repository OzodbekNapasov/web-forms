import { Survey, SurveyResponse, GoogleSheetsConfig } from "@/types/survey";
import { generateSubmissionId } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_SURVEYS: Survey[] = [];
const DEFAULT_RESPONSES: SurveyResponse[] = [];

export class SurveyService {
  private static STORAGE_KEY_SURVEYS = "edusurvey_surveys_v1";
  private static STORAGE_KEY_RESPONSES = "edusurvey_responses_v1";
  private static STORAGE_KEY_CONFIGS = "edusurvey_sheets_config_v1";

  public static getSurveys(): Survey[] {
    if (typeof window === "undefined") return DEFAULT_SURVEYS;
    const stored = localStorage.getItem(this.STORAGE_KEY_SURVEYS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public static getSurveyById(idOrSlug: string): Survey | null {
    const surveys = this.getSurveys();
    return surveys.find((s) => s.id === idOrSlug || s.custom_url === idOrSlug) || null;
  }

  public static saveSurvey(survey: Survey): Survey {
    const surveys = this.getSurveys();
    const index = surveys.findIndex((s) => s.id === survey.id);
    const updatedSurvey = {
      ...survey,
      id: survey.id || `srv-${Date.now()}`,
      created_at: survey.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      responses_count: survey.responses_count || 0,
    };

    if (index >= 0) {
      surveys[index] = updatedSurvey;
    } else {
      surveys.unshift(updatedSurvey);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
    }

    // Asynchronously sync to Supabase Database in background
    this.syncSurveyToSupabase(updatedSurvey).catch(() => {});

    return updatedSurvey;
  }

  private static async syncSurveyToSupabase(survey: Survey): Promise<void> {
    try {
      const supabase = createClient();
      // Upsert survey row
      await supabase.from("surveys").upsert(
        {
          id: survey.id,
          title: survey.title,
          description: survey.description || "",
          status: survey.status || "draft",
          custom_url: survey.custom_url || survey.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      // Upsert questions
      if (survey.questions && survey.questions.length > 0) {
        const questionRows = survey.questions.map((q, idx) => ({
          id: q.id,
          survey_id: survey.id,
          type: q.type,
          label: q.label || "Nomsiz savol",
          placeholder: q.placeholder || "",
          help_text: q.help_text || "",
          required: q.required || false,
          order_index: idx,
          updated_at: new Date().toISOString(),
        }));

        await supabase.from("survey_questions").upsert(questionRows, { onConflict: "id" });
      }
    } catch {
      // Graceful fallback to LocalStorage if Supabase offline or RLS restricted
    }
  }

  public static deleteSurvey(id: string): void {
    const surveys = this.getSurveys().filter((s) => s.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
    }

    // Sync deletion to Supabase
    try {
      const supabase = createClient();
      supabase.from("surveys").delete().eq("id", id).then();
    } catch {}
  }

  public static getResponses(surveyId?: string): SurveyResponse[] {
    if (typeof window === "undefined") return DEFAULT_RESPONSES;
    const stored = localStorage.getItem(this.STORAGE_KEY_RESPONSES);
    let allResponses: SurveyResponse[] = [];
    if (stored) {
      try {
        allResponses = JSON.parse(stored);
      } catch {
        allResponses = [];
      }
    }

    if (surveyId) {
      return allResponses.filter((r) => r.survey_id === surveyId);
    }
    return allResponses;
  }

  public static submitResponse(
    surveyId: string,
    answers: Record<string, any>,
    respondentMeta?: Record<string, any>
  ): SurveyResponse {
    const allResponses = this.getResponses();
    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      question_id: questionId,
      value: value,
    }));

    const newResponse: SurveyResponse = {
      id: `rsp-${Date.now()}`,
      survey_id: surveyId,
      submission_id: generateSubmissionId(),
      respondent_meta: respondentMeta || { ip: "127.0.0.1", device: "desktop" },
      status: "completed",
      started_at: new Date(Date.now() - 120000).toISOString(),
      completed_at: new Date().toISOString(),
      answers: formattedAnswers,
    };

    allResponses.unshift(newResponse);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY_RESPONSES, JSON.stringify(allResponses));
    }

    // Update survey responses_count
    const survey = this.getSurveyById(surveyId);
    if (survey) {
      survey.responses_count = (survey.responses_count || 0) + 1;
      this.saveSurvey(survey);
    }

    // Asynchronously sync response to Supabase & Google Sheets
    this.syncResponseToSupabase(newResponse).catch(() => {});
    this.syncResponseToGoogleSheets(surveyId, newResponse).catch(() => {});

    return newResponse;
  }

  private static async syncResponseToSupabase(resp: SurveyResponse): Promise<void> {
    try {
      const supabase = createClient();
      await supabase.from("responses").upsert(
        {
          id: resp.id,
          survey_id: resp.survey_id,
          submission_id: resp.submission_id,
          respondent_meta: resp.respondent_meta || {},
          status: resp.status || "completed",
          started_at: resp.started_at,
          completed_at: resp.completed_at,
        },
        { onConflict: "id" }
      );

      if (resp.answers && resp.answers.length > 0) {
        const answerRows = resp.answers.map((a) => ({
          response_id: resp.id,
          question_id: a.question_id,
          value: typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value),
        }));
        await supabase.from("response_answers").upsert(answerRows);
      }
    } catch {}
  }

  private static async syncResponseToGoogleSheets(surveyId: string, resp: SurveyResponse): Promise<void> {
    const webhookUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
      this.getSheetsConfig(surveyId)?.webhook_url;

    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          survey_id: surveyId,
          submission_id: resp.submission_id,
          submitted_at: resp.completed_at,
          answers: resp.answers,
        }),
      });
    } catch {}
  }

  public static getSheetsConfig(surveyId: string): GoogleSheetsConfig | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(this.STORAGE_KEY_CONFIGS);
    if (!stored) return null;
    try {
      const configs: Record<string, GoogleSheetsConfig> = JSON.parse(stored);
      return configs[surveyId] || null;
    } catch {
      return null;
    }
  }

  public static saveSheetsConfig(config: GoogleSheetsConfig): void {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(this.STORAGE_KEY_CONFIGS);
    let configs: Record<string, GoogleSheetsConfig> = {};
    if (stored) {
      try {
        configs = JSON.parse(stored);
      } catch {}
    }
    configs[config.survey_id] = config;
    localStorage.setItem(this.STORAGE_KEY_CONFIGS, JSON.stringify(configs));
  }
}
