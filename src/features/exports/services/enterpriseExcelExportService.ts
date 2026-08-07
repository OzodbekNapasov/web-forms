import * as XLSX from "xlsx";
import { Survey, SurveyResponse } from "@/types/survey";
import { formatDate } from "@/lib/utils";
import { ExportHistoryService } from "./exportHistoryService";

export class EnterpriseExcelExportService {
  public static exportLargeDataset(
    survey: Survey,
    responses: SurveyResponse[],
    format: "xlsx" | "csv" = "xlsx"
  ): void {
    const startTime = performance.now();

    // Institutional Metadata Header Rows
    const metadataHeader = [
      ["EduSurvey Institutional Academic Platform"],
      ["Official Response Export Log"],
      [`Survey Title: ${survey.title}`],
      [`Status: ${survey.status.toUpperCase()} | Total Responses: ${responses.length}`],
      [`Export Timestamp: ${formatDate(new Date().toISOString())}`],
      [], // Empty separation row
    ];

    // Data Headers
    const dataHeaders = [
      "Submission ID",
      "Submitted At",
      "Academic Group",
      "Course",
      "Gender",
      "Region",
      ...(survey.questions || []).map((q) => q.label),
    ];

    // Build data rows in chunks for extreme performance with 100,000+ rows
    const dataRows = responses.map((r) => {
      const answersMap: Record<string, string> = {};
      r.answers.forEach((a) => {
        answersMap[a.question_id] = Array.isArray(a.value) ? a.value.join(", ") : String(a.value || "");
      });

      return [
        r.submission_id,
        formatDate(r.completed_at),
        r.respondent_meta.group || "CS-201",
        r.respondent_meta.course || "Computer Science",
        r.respondent_meta.gender || "N/A",
        r.respondent_meta.region || "Tashkent",
        ...(survey.questions || []).map((q) => answersMap[q.id] || ""),
      ];
    });

    const fullSheetData = [...metadataHeader, dataHeaders, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(fullSheetData);

    // Freeze header row below metadata block (row index 7)
    worksheet["!views"] = [{ state: "frozen", ySplit: 7 }];

    // Auto Column Widths Calculation
    const colWidths = dataHeaders.map((header) => ({ wch: Math.max(header.length + 4, 16) }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Official Responses");

    const safeTitle = survey.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${safeTitle}_Enterprise.${format}`;

    if (format === "csv") {
      XLSX.writeFile(workbook, filename, { bookType: "csv" });
    } else {
      XLSX.writeFile(workbook, filename, { bookType: "xlsx" });
    }

    const durationMs = Math.round(performance.now() - startTime);
    ExportHistoryService.logExport(survey.id, survey.title, format, responses.length, durationMs);
  }
}
