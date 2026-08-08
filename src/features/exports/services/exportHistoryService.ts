export interface ExportRecord {
  id: string;
  surveyId: string;
  surveyTitle: string;
  format: "xlsx" | "csv" | "pdf" | "print";
  rowCount: number;
  durationMs: number;
  status: "success" | "failed";
  createdAt: string;
}

const EXPORT_HISTORY_KEY = "edusurvey_export_history_v1";

const DEFAULT_EXPORT_HISTORY: ExportRecord[] = [];

export class ExportHistoryService {
  public static getHistory(): ExportRecord[] {
    if (typeof window === "undefined") return DEFAULT_EXPORT_HISTORY;
    const stored = localStorage.getItem(EXPORT_HISTORY_KEY);
    if (!stored) {
      localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(DEFAULT_EXPORT_HISTORY));
      return DEFAULT_EXPORT_HISTORY;
    }
    try {
      const parsed: ExportRecord[] = JSON.parse(stored);
      // Clean out legacy dummy records if any
      const cleaned = parsed.filter(
        (r) => !r.id.startsWith("exp-10") && r.surveyId !== "srv-faculty-eval-2026"
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return DEFAULT_EXPORT_HISTORY;
    }
  }

  public static logExport(
    surveyId: string,
    surveyTitle: string,
    format: "xlsx" | "csv" | "pdf" | "print",
    rowCount: number,
    durationMs: number
  ): ExportRecord {
    const history = this.getHistory();
    const newRecord: ExportRecord = {
      id: `exp-${Date.now()}`,
      surveyId,
      surveyTitle,
      format,
      rowCount,
      durationMs,
      status: "success",
      createdAt: new Date().toISOString(),
    };

    history.unshift(newRecord);
    if (typeof window !== "undefined") {
      localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history));
    }
    return newRecord;
  }

  public static clearHistory(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify([]));
    }
  }
}
