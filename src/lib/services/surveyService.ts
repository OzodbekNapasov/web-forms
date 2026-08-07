import { Survey, SurveyResponse, GoogleSheetsConfig, AuditLog } from "@/types/survey";
import { generateSubmissionId } from "@/lib/utils";

// Clean Empty Production Data Layer
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
    if (index >= 0) {
      surveys[index] = { ...survey, updated_at: new Date().toISOString() };
    } else {
      surveys.unshift({
        ...survey,
        id: survey.id || `srv-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        responses_count: 0,
      });
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
    }
    return survey;
  }

  public static deleteSurvey(id: string): void {
    const surveys = this.getSurveys().filter((s) => s.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY_SURVEYS, JSON.stringify(surveys));
    }
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

  public static submitResponse(surveyId: string, answers: Record<string, any>, respondentMeta?: Record<string, any>): SurveyResponse {
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

    return newResponse;
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
