import { Survey, SurveyResponse, GoogleSheetsConfig } from "@/types/survey";
import { generateSubmissionId, formatAnswerDateToUzbek, formatDate } from "@/lib/utils";
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

  public static async fetchAllSurveysFromSupabase(): Promise<Survey[]> {
    try {
      const localSurveys = this.getSurveys();
      const supabase = createClient();
      const { data: surveysData, error: sErr } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (sErr || !surveysData) {
        return localSurveys;
      }

      const { data: questionsData } = await supabase
        .from("survey_questions")
        .select("*")
        .order("order_index", { ascending: true });

      const { data: responsesData } = await supabase
        .from("responses")
        .select("survey_id");

      const responseCounts: Record<string, number> = {};
      (responsesData || []).forEach((r: any) => {
        responseCounts[r.survey_id] = (responseCounts[r.survey_id] || 0) + 1;
      });

      const remoteSurveys: Survey[] = surveysData.map((s: any) => {
        const qList = (questionsData || [])
          .filter((q: any) => q.survey_id === s.id)
          .map((q: any) => ({
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

        return {
          id: s.id,
          title: s.title,
          description: s.description,
          cover_image: s.cover_image || s.theme_config?.headerImageUrl || null,
          status: s.status || "draft",
          custom_url: s.custom_url,
          questions: qList,
          responses_count: responseCounts[s.id] || s.responses_count || 0,
          is_multistep: s.is_multistep || false,
          theme_config: s.theme_config || { primaryColor: "#2563EB", backgroundColor: "#020617", cardStyle: "glass", fontFamily: "Inter" },
          created_at: s.created_at,
          updated_at: s.updated_at,
        };
      });

      // MERGE: Keep any local surveys that haven't synced to remote yet or are newer!
      const mergedMap = new Map<string, Survey>();
      remoteSurveys.forEach((s) => mergedMap.set(s.id, s));

      localSurveys.forEach((local) => {
        const remote = mergedMap.get(local.id);
        if (!remote) {
          // Local survey not yet on remote — KEEP IT and sync to remote!
          mergedMap.set(local.id, local);
          this.syncSurveyToSupabase(local).catch(() => {});
        } else {
          // Compare timestamps: if local is newer or has more questions, keep local!
          const localTime = new Date(local.updated_at || local.created_at || 0).getTime();
          const remoteTime = new Date(remote.updated_at || remote.created_at || 0).getTime();
          if (localTime > remoteTime || (local.questions && local.questions.length > (remote.questions?.length || 0))) {
            mergedMap.set(local.id, local);
            this.syncSurveyToSupabase(local).catch(() => {});
          }
        }
      });

      const mergedSurveys = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY_SURVEYS, JSON.stringify(mergedSurveys));
      }

      return mergedSurveys;
    } catch {
      return this.getSurveys();
    }
  }

  public static async fetchResponsesFromSupabase(surveyId?: string): Promise<SurveyResponse[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("responses").select("*").order("completed_at", { ascending: false });
      if (surveyId) {
        query = query.eq("survey_id", surveyId);
      }
      const { data: respData, error } = await query;
      if (error || !respData) return this.getResponses(surveyId);

      const respIds = respData.map((r: any) => r.id);
      let answersData: any[] = [];
      if (respIds.length > 0) {
        const { data: aData } = await supabase
          .from("response_answers")
          .select("*")
          .in("response_id", respIds);
        answersData = aData || [];
      }

      const fullResponses: SurveyResponse[] = respData.map((r: any) => {
        const rAnswers = answersData
          .filter((a: any) => a.response_id === r.id)
          .map((a: any) => {
            let parsedVal = a.value;
            try {
              if (typeof parsedVal === "string" && (parsedVal.startsWith("{") || parsedVal.startsWith("["))) {
                parsedVal = JSON.parse(parsedVal);
              }
            } catch {}
            return {
              id: a.id,
              response_id: a.response_id,
              question_id: a.question_id,
              value: parsedVal,
            };
          });

        return {
          id: r.id,
          survey_id: r.survey_id,
          submission_id: r.submission_id,
          respondent_meta: r.respondent_meta || {},
          status: r.status || "completed",
          started_at: r.started_at || r.created_at,
          completed_at: r.completed_at || r.created_at,
          answers: rAnswers,
        };
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY_RESPONSES, JSON.stringify(fullResponses));
      }

      return fullResponses;
    } catch {
      return this.getResponses(surveyId);
    }
  }

  public static async fetchSurveyFromSupabase(idOrSlug: string): Promise<Survey | null> {
    const local = this.getSurveyById(idOrSlug);
    try {
      const supabase = createClient();
      const { data: sData, error: sErr } = await supabase
        .from("surveys")
        .select("*")
        .or(`id.eq.${idOrSlug},custom_url.eq.${idOrSlug}`)
        .maybeSingle();

      if (sErr || !sData) return local;

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
        cover_image: sData.cover_image || sData.theme_config?.headerImageUrl || null,
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
          cover_image: survey.cover_image || survey.theme_config?.headerImageUrl || "",
          theme_config: survey.theme_config || {},
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
    const dateFormatted = resp.completed_at
      ? formatDate(resp.completed_at, true)
      : formatDate(new Date(), true);

    const rowData: Record<string, any> = {
      "Vaqti": dateFormatted,
      "Javob ID": resp.submission_id,
      "Soʻrovnoma": survey?.title || resp.survey_id,
      "Holati": "Topshirildi",
    };

    if (resp.respondent_meta) {
      if (resp.respondent_meta.group) {
        rowData["Guruh"] = this.makeFormulaSafe(resp.respondent_meta.group);
      }
      if (resp.respondent_meta.course) {
        rowData["Yoʻnalish"] = this.makeFormulaSafe(resp.respondent_meta.course);
      }
    }

    if (survey && survey.questions && survey.questions.length > 0) {
      survey.questions.forEach((q) => {
        const ans = resp.answers?.find((a) => a.question_id === q.id);
        let rawVal = "";
        if (ans && ans.value !== undefined && ans.value !== null) {
          if (Array.isArray(ans.value)) {
            rawVal = ans.value.map((v) => formatAnswerDateToUzbek(v)).join(", ");
          } else if (typeof ans.value === "object") {
            rawVal = JSON.stringify(ans.value);
          } else {
            rawVal = formatAnswerDateToUzbek(String(ans.value));
          }
        }

        const safeVal = this.makeFormulaSafe(rawVal);
        const colHeader = (q.label && q.label.trim()) || `Savol (${q.id})`;
        rowData[colHeader] = safeVal;
      });
    }

    return rowData;
  }

  public static getCleanSheetName(surveyTitle?: string): string {
    if (!surveyTitle || !surveyTitle.trim()) return "Javoblar";
    const cleaned = surveyTitle.trim().replace(/[/\\[\]?*:]/g, "");
    return cleaned.slice(0, 30) || "Javoblar";
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
      const sheetName = this.getCleanSheetName(survey?.title);

      await fetch("/api/sync/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          spreadsheetId,
          sheetName,
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
