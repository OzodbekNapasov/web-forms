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

  public static async fetchSurveyFromSupabase(idOrSlug: string): Promise<Survey | null> {
    try {
      const supabase = createClient();
      const { data: sData, error: sErr } = await supabase
        .from("surveys")
        .select("*")
        .or(`id.eq.${idOrSlug},custom_url.eq.${idOrSlug}`)
        .maybeSingle();

      if (sErr || !sData) return null;

      const { data: qData } = await supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_id", sData.id)
        .order("order_index", { ascending: true });

      const questions = (qData || []).map((q: any) => ({
        id: q.id,
        survey_id: q.survey_id,
        type: q.type,
        label: q.label,
        placeholder: q.placeholder,
        help_text: q.help_text,
        required: q.required,
        order_index: q.order_index,
        config: q.config || {},
      }));

      const surveyObj: Survey = {
        id: sData.id,
        title: sData.title,
        description: sData.description,
        status: sData.status,
        custom_url: sData.custom_url,
        questions,
        is_multistep: sData.is_multistep || false,
        theme_config: sData.theme_config || { primaryColor: "#2563EB", backgroundColor: "#020617", cardStyle: "glass", fontFamily: "Inter" },
        created_at: sData.created_at,
        updated_at: sData.updated_at,
      };

      // Cache into local storage
      const surveys = this.getSurveys();
      const existingIdx = surveys.findIndex((s) => s.id === surveyObj.id);
      if (existingIdx >= 0) {
        surveys[existingIdx] = surveyObj;
      } else {
        surveys.unshift(surveyObj);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
      }

      return surveyObj;
    } catch {
      return null;
    }
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

  private static makeFormulaSafe(val: any): any {
    if (typeof val === "string" && (val.startsWith("+") || val.startsWith("="))) {
      return "'" + val;
    }
    return val;
  }

  public static buildRowDataForGoogleSheets(
    survey: Survey | null,
    resp: SurveyResponse
  ): Record<string, any> {
    const rowData: Record<string, any> = {
      Vaqti: new Date(resp.completed_at || Date.now()).toLocaleString("uz-UZ", {
        timeZone: "Asia/Tashkent",
      }),
      Javob_ID: resp.submission_id,
      "Javob ID": resp.submission_id,
      So_rovnoma: survey?.title || resp.survey_id,
      "So'rovnoma": survey?.title || resp.survey_id,
      "Soʻrovnoma": survey?.title || resp.survey_id,
      Holati: "Topshirildi",
    };

    if (resp.respondent_meta) {
      if (resp.respondent_meta.group) {
        rowData["Guruhingiz"] = this.makeFormulaSafe(resp.respondent_meta.group);
        rowData["Guruh"] = this.makeFormulaSafe(resp.respondent_meta.group);
      }
      if (resp.respondent_meta.course) {
        rowData["Yo'nalish"] = this.makeFormulaSafe(resp.respondent_meta.course);
        rowData["Yoʻnalish"] = this.makeFormulaSafe(resp.respondent_meta.course);
      }
    }

    if (survey && survey.questions && survey.questions.length > 0) {
      survey.questions.forEach((q) => {
        const ans = resp.answers?.find((a) => a.question_id === q.id);
        const rawVal =
          ans && ans.value !== undefined
            ? typeof ans.value === "object"
              ? JSON.stringify(ans.value)
              : String(ans.value)
            : "";

        const safeVal = this.makeFormulaSafe(rawVal);

        if (q.label) {
          const rawLabel = q.label.trim();
          rowData[rawLabel] = safeVal;

          const asciiLabel = rawLabel.replace(/[ʻ’`]/g, "'");
          rowData[asciiLabel] = safeVal;

          const unicodeLabel = rawLabel.replace(/'/g, "ʻ");
          rowData[unicodeLabel] = safeVal;

          const underscoreLabel = asciiLabel.replace(/'/g, "_");
          rowData[underscoreLabel] = safeVal;
        }

        rowData[q.id] = safeVal;
      });
    }

    if (resp.answers) {
      resp.answers.forEach((a) => {
        if (a.question_id && rowData[a.question_id] === undefined) {
          const rawVal = typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value);
          rowData[a.question_id] = this.makeFormulaSafe(rawVal);
        }
      });
    }

    return rowData;
  }

  private static async syncResponseToGoogleSheets(surveyId: string, resp: SurveyResponse): Promise<void> {
    try {
      const survey = this.getSurveyById(surveyId);
      const webhookUrl =
        process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
        this.getSheetsConfig(surveyId)?.webhook_url ||
        "https://script.google.com/macros/s/AKfycbzGBKnwub-9PD_e30EdAmuK3GTAPxyd8jS5rcQNNO4rY5vAK2f_3ewwV-b_M40BSM6Deg/exec";

      const spreadsheetId =
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
        this.getSheetsConfig(surveyId)?.spreadsheet_id ||
        "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";

      const rowData = this.buildRowDataForGoogleSheets(survey, resp);

      await fetch("/api/sync/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          spreadsheetId,
          sheetName: "Javoblar",
          data: rowData,
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
