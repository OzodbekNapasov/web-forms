import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Survey, SurveyResponse } from "@/types/survey";
import { formatDate } from "@/lib/utils";

export class ExportService {
  /**
   * Export Survey Responses to Excel (.xlsx) file with styled column headers
   */
  public static exportToExcel(survey: Survey, responses: SurveyResponse[]): void {
    const dataRows = responses.map((r) => {
      const row: Record<string, any> = {
        "Submission ID": r.submission_id,
        "Submitted At": formatDate(r.completed_at),
        "Status": r.status,
        "Group": r.respondent_meta.group || "N/A",
        "Course": r.respondent_meta.course || "N/A",
        "Gender": r.respondent_meta.gender || "N/A",
        "Region": r.respondent_meta.region || "N/A",
      };

      survey.questions?.forEach((q) => {
        const ans = r.answers.find((a) => a.question_id === q.id);
        if (ans) {
          row[q.label] = Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value ?? "");
        } else {
          row[q.label] = "";
        }
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    // Calculate auto column widths
    const maxWidths = Object.keys(dataRows[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 15),
    }));
    worksheet["!cols"] = maxWidths;

    const filename = `${survey.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Responses.xlsx`;
    XLSX.writeFile(workbook, filename);
  }

  /**
   * Export Survey Responses to CSV file
   */
  public static exportToCSV(survey: Survey, responses: SurveyResponse[]): void {
    const headers = [
      "Submission ID",
      "Submitted At",
      "Status",
      ...(survey.questions?.map((q) => `"${q.label.replace(/"/g, '""')}"`) || []),
    ];

    const rows = responses.map((r) => {
      const answersMap = survey.questions?.map((q) => {
        const ans = r.answers.find((a) => a.question_id === q.id);
        const val = ans ? (Array.isArray(ans.value) ? ans.value.join("; ") : String(ans.value ?? "")) : "";
        return `"${val.replace(/"/g, '""')}"`;
      }) || [];

      return [
        `"${r.submission_id}"`,
        `"${formatDate(r.completed_at)}"`,
        `"${r.status}"`,
        ...answersMap,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${survey.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export Official Summary PDF Report using pdf-lib
   */
  public static async exportToPDF(survey: Survey, responses: SurveyResponse[]): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    let y = height - 50;

    // Header Title
    page.drawText("EduSurvey Official Analytics & Response Report", {
      x: 50,
      y,
      size: 18,
      font: fontBold,
      color: rgb(0.14, 0.38, 0.92), // #2563EB
    });

    y -= 25;
    page.drawText(`Survey Title: ${survey.title}`, { x: 50, y, size: 12, font: fontBold });
    y -= 18;
    page.drawText(`Total Submissions: ${responses.length} | Status: ${survey.status.toUpperCase()}`, {
      x: 50,
      y,
      size: 10,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
    page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
      x: 50,
      y,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });

    y -= 25;
    // Divider line
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 30;
    page.drawText("Question Breakdown & Response Count:", { x: 50, y, size: 12, font: fontBold });
    y -= 20;

    survey.questions?.forEach((q, idx) => {
      if (y < 80) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 50;
      }

      page.drawText(`${idx + 1}. ${q.label} [${q.type}]`, {
        x: 50,
        y,
        size: 10,
        font: fontBold,
      });
      y -= 15;

      const answeredCount = responses.filter((r) => r.answers.some((a) => a.question_id === q.id)).length;
      page.drawText(`   Total Answers Received: ${answeredCount} / ${responses.length}`, {
        x: 50,
        y,
        size: 9,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
      });
      y -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${survey.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
