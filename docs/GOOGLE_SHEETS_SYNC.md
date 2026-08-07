# EduSurvey - Google Sheets Live Webhook Sync Setup

This guide details setting up the Google Apps Script Webhook receiver to stream incoming student responses live into Google Sheets.

---

## 1. Google Apps Script Webhook Code

Create a Google Spreadsheet, navigate to **Extensions > Apps Script**, and paste:

```javascript
function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.openById(requestData.spreadsheetId);
    var sheet = spreadsheet.getSheetByName(requestData.sheetName) || spreadsheet.insertSheet(requestData.sheetName);

    var row = [];
    if (sheet.getLastRow() === 0) {
      // Create Header Row
      var headers = Object.keys(requestData.data);
      sheet.appendRow(headers);
    }

    var keys = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    keys.forEach(function(key) {
      row.push(requestData.data[key] || "");
    });

    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 2. Deploy Webhook

1. Click **Deploy > New Deployment**.
2. Select **Web app**.
3. Set **Execute as**: `Me`.
4. Set **Who has access**: `Anyone`.
5. Copy the generated Webhook URL and enter it into the EduSurvey Admin Settings at `/admin/sheets`.
