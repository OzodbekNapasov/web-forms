import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = FileText,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 p-8 glass-card rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-5 gap-2 shadow-md">
          {actionText}
        </Button>
      )}
    </div>
  );
}
