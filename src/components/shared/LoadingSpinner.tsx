import React from "react";

export default function LoadingSpinner({ label = "Loading data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
