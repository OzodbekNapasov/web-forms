import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Survey, SurveyResponse } from "@/types/survey";
import { formatDate } from "@/lib/utils";

export class AdvancedExportService {
  /**
   * Professional Excel Export with auto-widths and frozen top row
   */
  public static exportExcelProfessional(survey: Survey, responses: SurveyResponse[]): void {
    const rows = responses.map((r) => {
      const rowData: Record<string, any> = {
        "Submission ID": r.submission_id,
        "Submitted At": formatDate(r.completed_at),
        "Status": r.status,
        "Academic Group": r.respondent_meta.group || "CS-201",
        "Course": r.respondent_meta.course || "Computer Science",
        "Gender": r.respondent_meta.gender || "N/A",
      };

      survey.questions?.forEach((q) => {
        const ans = r.answers.find((a) => a.question_id === q.id);
        rowData[q.label] = ans ? (Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value)) : "";
      });

      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Freeze top row
    worksheet["!views"] = [{ state: "frozen", ySplit: 1 }];

    // Calculate dynamic column widths
    const keys = Object.keys(rows[0] || {});
    worksheet["!cols"] = keys.map((key) => ({ wch: Math.max(key.length + 5, 18) }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Submissions");

    const filename = `${survey.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Official_Responses.xlsx`;
    XLSX.writeFile(workbook, filename);
  }

  /**
   * PDF Executive Report Generation via pdf-lib
   */
  public static async exportPdfExecutiveReport(survey: Survey, responses: SurveyResponse[]): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    let y = height - 50;

    page.drawText("EduSurvey Academic Official Response Summary", {
      x: 50,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.14, 0.38, 0.92),
    });

    y -= 25;
    page.drawText(`Survey: ${survey.title}`, { x: 50, y, size: 12, font: fontBold });
    y -= 18;
    page.drawText(`Total Submissions Recorded: ${responses.length} | Status: ${survey.status.toUpperCase()}`, {
      x: 50,
      y,
      size: 10,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    y -= 25;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 25;

    page.drawText("Question Response Counts:", { x: 50, y, size: 11, font: fontBold });
    y -= 20;

    survey.questions?.forEach((q, idx) => {
      if (y < 80) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 50;
      }
      page.drawText(`${idx + 1}. ${q.label}`, { x: 50, y, size: 10, font: fontBold });
      y -= 15;
      const count = responses.filter((r) => r.answers.some((a) => a.question_id === q.id)).length;
      page.drawText(`   Answered: ${count} / ${responses.length} respondents`, { x: 50, y, size: 9, font: fontRegular });
      y -= 18;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${survey.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Executive_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
