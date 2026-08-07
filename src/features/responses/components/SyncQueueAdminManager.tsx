"use client";

import React, { useState, useEffect } from "react";
import { SyncQueueWorkerService, QueueItem } from "../services/syncQueueWorkerService";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function SyncQueueAdminManager() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    setQueue(SyncQueueWorkerService.getQueue());
  }, []);

  const handleRetry = async (id: string) => {
    toast.info("Retrying Google Sheets queue sync...");
    await SyncQueueWorkerService.processItem(id);
    setQueue(SyncQueueWorkerService.getQueue());
    toast.success("Queue processing updated.");
  };

  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-emerald-600" /> Google Sheets Sync Queue Monitor
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => setQueue(SyncQueueWorkerService.getQueue())} className="h-7 text-xs">
          Refresh Queue Status
        </Button>
      </div>

      {queue.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">Sync queue is clear. All responses updated.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {queue.map((item) => (
            <div key={item.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600">{item.submissionId}</span>
                  <Badge variant={item.status === "completed" ? "published" : item.status === "failed" ? "destructive" : "draft"}>
                    {item.status} ({item.retryCount}/{item.maxRetries})
                  </Badge>
                </div>
                {item.lastError && <p className="text-[11px] text-red-500">{item.lastError}</p>}
              </div>

              {(item.status === "failed" || item.status === "retrying") && (
                <Button size="sm" variant="ghost" onClick={() => handleRetry(item.id)} className="h-7 text-xs gap-1 text-blue-600">
                  <RefreshCw className="h-3 w-3" /> Retry Sync
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
