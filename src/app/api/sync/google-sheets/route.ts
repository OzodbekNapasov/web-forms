import { NextResponse } from "next/server";

interface SyncPayload {
  webhookUrl: string;
  spreadsheetId: string;
  sheetName?: string;
  data: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const payload: SyncPayload = await request.json();

    const webhookUrl =
      payload.webhookUrl || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
    const spreadsheetId =
      payload.spreadsheetId || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: "Google Sheets Webhook URL koʻrsatilmadi." },
        { status: 400 }
      );
    }

    // Google Apps Script expects JSON string inside body
    const googleScriptBody = JSON.stringify({
      action: "APPEND_ROW",
      spreadsheetId: spreadsheetId,
      sheetName: payload.sheetName || "Javoblar",
      data: payload.data || {},
    });

    let attempts = 0;
    let success = false;
    let lastError = "";

    while (attempts < 3 && !success) {
      attempts++;
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          redirect: "follow",
          body: googleScriptBody,
        });

        if (response.ok || response.type === "opaque" || response.status === 200 || response.status === 302) {
          success = true;
        } else {
          lastError = `HTTP Status ${response.status}`;
        }
      } catch (err: any) {
        lastError = err.message || "Ulanish xatosi";
        await new Promise((res) => setTimeout(res, 500 * attempts));
      }
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Javob Google Sheets jadvaliga muvaffaqiyatli uzatildi.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Google Sheets xatosi: ${lastError}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
