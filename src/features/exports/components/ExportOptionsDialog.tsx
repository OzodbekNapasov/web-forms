"use client";

import React, { useState } from "react";
import { Survey } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";

interface ExportOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  survey: Survey;
  onExport: (options: { format: "xlsx" | "csv" | "pdf" | "print"; watermark: string }) => void;
}

export default function ExportOptionsDialog({ isOpen, onClose, survey, onExport }: ExportOptionsDialogProps) {
  const [format, setFormat] = useState<"xlsx" | "csv" | "pdf" | "print">("xlsx");
  const [watermark, setWatermark] = useState("OFFICIAL ACADEMIC REPORT");

  const handleRun = () => {
    onExport({ format, watermark });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Download className="h-6 w-6" /> Configure Enterprise Export
          </DialogTitle>
          <DialogDescription>
            Select export format and options for &apos;{survey.title}&apos;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Export Format</label>
            <Select value={format} onValueChange={(val: any) => setFormat(val)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">Excel Workbook (.xlsx) - 100k+ Rows Supported</SelectItem>
                <SelectItem value="csv">Comma Separated Values (.csv) - UTF-8</SelectItem>
                <SelectItem value="pdf">Executive PDF Report with Cover Page</SelectItem>
                <SelectItem value="print">Browser Optimized Print (A4/Letter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format === "pdf" && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">PDF Watermark Text</label>
              <Input value={watermark} onChange={(e) => setWatermark(e.target.value)} className="h-9 text-xs" />
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleRun} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
              <Download className="h-3.5 w-3.5" /> Generate Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
