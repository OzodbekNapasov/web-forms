import { NextResponse } from "next/server";

interface SyncPayload {
  webhookUrl: string;
  spreadsheetId: string;
  sheetName: string;
  data: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const payload: SyncPayload = await request.json();

    if (!payload.webhookUrl || !payload.spreadsheetId) {
      return NextResponse.json({ success: false, error: "Missing webhook configuration." }, { status: 400 });
    }

    // Execute server-side post to Google Apps Script Webhook with retry logic
    let attempts = 0;
    let success = false;
    let lastError = "";

    while (attempts < 3 && !success) {
      attempts++;
      try {
        const response = await fetch(payload.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "APPEND_ROW",
            spreadsheetId: payload.spreadsheetId,
            sheetName: payload.sheetName,
            data: payload.data,
          }),
        });

        if (response.ok || response.type === "opaque") {
          success = true;
        } else {
          lastError = `HTTP ${response.status}`;
        }
      } catch (err: any) {
        lastError = err.message || "Network timeout";
        await new Promise((res) => setTimeout(res, 500 * attempts)); // Backoff delay
      }
    }

    if (success) {
      return NextResponse.json({ success: true, message: "Response synced to Google Sheets successfully." });
    } else {
      return NextResponse.json({ success: false, error: `Failed after 3 retries: ${lastError}` }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
