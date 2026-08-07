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

const DEFAULT_EXPORT_HISTORY: ExportRecord[] = [
  {
    id: "exp-101",
    surveyId: "srv-faculty-eval-2026",
    surveyTitle: "University Faculty & Teaching Evaluation 2026",
    format: "xlsx",
    rowCount: 142,
    durationMs: 420,
    status: "success",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "exp-102",
    surveyId: "srv-campus-life-2026",
    surveyTitle: "Campus Facilities & Student Life Survey",
    format: "pdf",
    rowCount: 89,
    durationMs: 850,
    status: "success",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export class ExportHistoryService {
  public static getHistory(): ExportRecord[] {
    if (typeof window === "undefined") return DEFAULT_EXPORT_HISTORY;
    const stored = localStorage.getItem(EXPORT_HISTORY_KEY);
    if (!stored) {
      localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(DEFAULT_EXPORT_HISTORY));
      return DEFAULT_EXPORT_HISTORY;
    }
    try {
      return JSON.parse(stored);
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
}
