"use client";

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2 } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  isRead: boolean;
  time: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", title: "New Response Recorded", message: "Submission EDU-892104 received for Admission Survey", type: "success", isRead: false, time: "2m ago" },
  { id: "2", title: "Google Sheets Synced", message: "Automated row appended to official spreadsheet", type: "info", isRead: false, time: "15m ago" },
  { id: "3", title: "Storage Alert", message: "Storage usage at 124 MB of 500 MB quota", type: "warning", isRead: true, time: "1h ago" },
];

export default function NotificationCenterPopover() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClear = () => {
    setNotifications([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications ({notifications.length})</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={handleMarkAllRead} className="h-6 text-[10px]">
              Mark all read
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClear} className="h-6 text-[10px] text-red-500">
              Clear
            </Button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                  n.isRead ? "border-slate-100 dark:border-slate-900 bg-transparent opacity-70" : "border-blue-100 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/40"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-500">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
