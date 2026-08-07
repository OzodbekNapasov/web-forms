import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Survey, SurveyResponse } from "@/types/survey";
import { formatDate } from "@/lib/utils";
import { ExportHistoryService } from "./exportHistoryService";

export class EnterprisePdfExportService {
  public static async generateExecutivePdfReport(
    survey: Survey,
    responses: SurveyResponse[],
    watermarkText = "OFFICIAL ACADEMIC REPORT"
  ): Promise<void> {
    const startTime = performance.now();
    const pdfDoc = await PDFDocument.create();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Page 1: Official Executive Cover Page
    const coverPage = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = coverPage.getSize();

    // Cover Page Decorative Header Bar
    coverPage.drawRectangle({
      x: 0,
      y: height - 120,
      width,
      height: 120,
      color: rgb(0.14, 0.38, 0.92),
    });

    coverPage.drawText("EduSurvey Academic Platform", {
      x: 50,
      y: height - 60,
      size: 22,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    coverPage.drawText("Official Executive Institutional Audit & Response Report", {
      x: 50,
      y: height - 90,
      size: 11,
      font: fontRegular,
      color: rgb(0.9, 0.95, 1),
    });

    let y = height - 180;
    coverPage.drawText(`Survey Title: ${survey.title}`, { x: 50, y, size: 14, font: fontBold });
    y -= 25;
    coverPage.drawText(`Publication Status: ${survey.status.toUpperCase()}`, { x: 50, y, size: 11, font: fontRegular });
    y -= 20;
    coverPage.drawText(`Total Recorded Submissions: ${responses.length}`, { x: 50, y, size: 11, font: fontRegular });
    y -= 20;
    coverPage.drawText(`Report Generated Date: ${formatDate(new Date().toISOString())}`, { x: 50, y, size: 11, font: fontRegular });

    y -= 40;
    coverPage.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 30;

    // Optional Watermark
    if (watermarkText) {
      coverPage.drawText(watermarkText, {
        x: 100,
        y: 400,
        size: 28,
        font: fontBold,
        color: rgb(0.9, 0.9, 0.9),
        rotate: { angle: 45, type: "degrees" as any },
      });
    }

    // Page 2: Detailed Question Breakdown Table
    let detailPage = pdfDoc.addPage([595.28, 841.89]);
    let dy = height - 50;

    detailPage.drawText("Section 2: Detailed Question Analytics Summary", {
      x: 50,
      y: dy,
      size: 13,
      font: fontBold,
      color: rgb(0.14, 0.38, 0.92),
    });
    dy -= 30;

    survey.questions?.forEach((q, idx) => {
      if (dy < 100) {
        detailPage = pdfDoc.addPage([595.28, 841.89]);
        dy = height - 50;
      }

      detailPage.drawText(`${idx + 1}. ${q.label}`, { x: 50, y: dy, size: 10, font: fontBold });
      dy -= 16;
      const count = responses.filter((r) => r.answers.some((a) => a.question_id === q.id)).length;
      detailPage.drawText(`   Answer Count: ${count} / ${responses.length} (${responses.length > 0 ? Math.round((count / responses.length) * 100) : 0}%)`, {
        x: 50,
        y: dy,
        size: 9,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
      });
      dy -= 20;
    });

    // Add Footer and Page Numbers ("Page X of Y")
    const pageCount = pdfDoc.getPageCount();
    pdfDoc.getPages().forEach((p, idx) => {
      p.drawText(`EduSurvey Institutional Report | Page ${idx + 1} of ${pageCount}`, {
        x: 50,
        y: 30,
        size: 9,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
      });
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

    const durationMs = Math.round(performance.now() - startTime);
    ExportHistoryService.logExport(survey.id, survey.title, "pdf", responses.length, durationMs);
  }
}
