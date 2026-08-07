# EduSurvey - REST API Contract Specification

---

## 1. Endpoints Summary

### Health Check Endpoint
- **`GET /api/health`**:
  - Response: `{ status: "healthy", timestamp: string, version: "1.0.0", services: { ... } }`

### Server Queue Google Sheets Endpoint
- **`POST /api/sync/google-sheets`**:
  - Request Body: `{ webhookUrl: string, spreadsheetId: string, sheetName: string, data: Record<string, any> }`
  - Response: `{ success: boolean, message?: string, error?: string }`
