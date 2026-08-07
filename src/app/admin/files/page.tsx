"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export default function FilesManagerPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      const newFile: FileItem = {
        id: `f-${Date.now()}`,
        name: uploaded.name,
        size: `${(uploaded.size / (1024 * 1024)).toFixed(1)} MB`,
        type: uploaded.type,
        uploadedAt: new Date().toISOString().substring(0, 10),
      };
      setFiles([newFile, ...files]);
      toast.success("Fayl muvaffaqiyatli yuklandi.");
    }
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    toast.success("Fayl oʻchirildi.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Fayllar va Ombor Boshqaruvi
            <FolderOpen className="h-6 w-6 text-purple-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">Yuklangan fayllar, talaba biriktirmalari va PDF fayllar ombori.</p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer">
          <Upload className="h-4 w-4" /> Fayl yuklash
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <Card className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Supabase Ombor Hajmi: edusurvey-assets</span>
          <span>0 MB / 5.0 GB</span>
        </div>
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-purple-600 h-full w-[0%]" />
        </div>
      </Card>

      {files.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-xl">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha yuklangan fayllar mavjud emas</h3>
            <p className="text-xs text-slate-400">Yangi logo, fayl yoki hujjat yuklash uchun yuqoridagi tugmani bosing.</p>
          </div>
        </Card>
      ) : (
        <Card className="glass-card p-0 rounded-2xl overflow-hidden border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 font-bold border-b border-slate-800 text-slate-300">
                <th className="p-3.5">Fayl nomi</th>
                <th className="p-3.5">Hajmi</th>
                <th className="p-3.5">Turi</th>
                <th className="p-3.5">Yuklangan sana</th>
                <th className="p-3.5 text-right">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {files.map((f) => (
                <tr key={f.id} className="hover:bg-slate-900/50">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    {f.name}
                  </td>
                  <td className="p-3.5 text-slate-400">{f.size}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">{f.type}</td>
                  <td className="p-3.5 text-slate-400">{f.uploadedAt}</td>
                  <td className="p-3.5 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(f.id)} className="h-7 text-xs text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
