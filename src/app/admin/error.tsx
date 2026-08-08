"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Portal Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xl">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h2 className="text-xl font-bold text-white">Vaqtinchalik Tizim Yuklanishida Ogohlantirish</h2>
        <p className="text-xs text-slate-400">
          Sahifa maʻlumotlarini yuklashda kutilmagan toʻsiq yuz berdi. Sahifani qayta yangilang.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 px-6 h-10 shadow-lg shadow-blue-600/30 rounded-xl"
      >
        <RefreshCw className="h-4 w-4" /> Sahifani Qayta Yuklash
      </Button>
    </div>
  );
}
