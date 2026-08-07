export type QueueStatus = "pending" | "processing" | "completed" | "failed" | "retrying";

export interface QueueItem {
  id: string;
  surveyId: string;
  responseId: string;
  submissionId: string;
  spreadsheetId: string;
  sheetName: string;
  webhookUrl: string;
  status: QueueStatus;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  payload: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const QUEUE_STORAGE_KEY = "edusurvey_sync_queue_v1";

export class SyncQueueWorkerService {
  public static getQueue(): QueueItem[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  public static enqueueResponse(
    surveyId: string,
    responseId: string,
    submissionId: string,
    spreadsheetId: string,
    sheetName: string,
    webhookUrl: string,
    payload: Record<string, any>
  ): QueueItem {
    const queue = this.getQueue();
    const item: QueueItem = {
      id: `q-${Date.now()}`,
      surveyId,
      responseId,
      submissionId,
      spreadsheetId,
      sheetName,
      webhookUrl,
      status: "pending",
      retryCount: 0,
      maxRetries: 5,
      payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queue.unshift(item);
    if (typeof window !== "undefined") {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    }

    // Trigger immediate background process
    this.processItem(item.id);
    return item;
  }

  public static async processItem(queueId: string): Promise<boolean> {
    const queue = this.getQueue();
    const index = queue.findIndex((q) => q.id === queueId);
    if (index === -1) return false;

    const item = queue[index];
    item.status = "processing";
    item.updatedAt = new Date().toISOString();
    this.saveQueue(queue);

    try {
      const res = await fetch("/api/sync/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: item.webhookUrl,
          spreadsheetId: item.spreadsheetId,
          sheetName: item.sheetName,
          data: item.payload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        item.status = "completed";
        item.lastError = undefined;
        this.saveQueue(queue);
        return true;
      } else {
        throw new Error(data.error || "Sync failed");
      }
    } catch (err: any) {
      item.retryCount += 1;
      item.lastError = err.message || "Network Error";

      if (item.retryCount >= item.maxRetries) {
        item.status = "failed";
      } else {
        item.status = "retrying";
      }

      item.updatedAt = new Date().toISOString();
      this.saveQueue(queue);

      if (item.status === "retrying") {
        setTimeout(() => this.processItem(queueId), 2000 * item.retryCount);
      }
      return false;
    }
  }

  private static saveQueue(queue: QueueItem[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    }
  }
}
