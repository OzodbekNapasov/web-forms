"use client";

import React, { useState, useEffect, use } from "react";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey, Question, QuestionType } from "@/types/survey";
import { useUndoRedoStore } from "@/features/survey-builder/state/useUndoRedoStore";
import { useAutoSave } from "@/features/survey-builder/state/useAutoSave";
import TopToolbar from "@/features/survey-builder/components/TopToolbar";
import LeftPaletteSidebar from "@/features/survey-builder/components/LeftPaletteSidebar";
import QuestionEditorCard from "@/components/builder/QuestionEditorCard";
import LivePreviewModal from "@/components/builder/LivePreviewModal";
import TemplatesModal from "@/features/survey-builder/components/TemplatesModal";
import QuestionLibraryModal from "@/features/survey-builder/components/QuestionLibraryModal";
import ThemeSelectorModal from "@/features/survey-builder/components/ThemeSelectorModal";
import ShareSurveyDialog from "@/components/dashboard/ShareSurveyDialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Trash2, Upload, Sparkles, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

const PRESET_BANNERS = [
  { label: "Taʻlim va Universitet", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80" },
  { label: "Zamonaviy Texnologiyalar", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80" },
  { label: "Kutubxona va Ilm", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80" },
  { label: "Abstrakt Dark Rejim", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80" },
];

export default function SurveyBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [initialSurvey, setInitialSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    const loaded = SurveyService.getSurveyById(resolvedParams.id);
    if (loaded) setInitialSurvey(loaded);
  }, [resolvedParams.id]);

  if (!initialSurvey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <SurveyBuilderCanvas initialSurvey={initialSurvey} />;
}

function SurveyBuilderCanvas({ initialSurvey }: { initialSurvey: Survey }) {
  const { state: survey, pushState, undo, redo, canUndo, canRedo } = useUndoRedoStore(initialSurvey);
  const saveStatus = useAutoSave(survey, 1500);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    survey.questions && survey.questions.length > 0 ? survey.questions[0].id : null
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Cover image modal state
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState("");

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else {
          e.preventDefault();
          if (canUndo) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        SurveyService.saveSurvey(survey);
        toast.success("Klaviatura yorliqchasi orqali saqlandi!");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo, survey]);

  const updateSurvey = (updated: Survey) => {
    pushState(updated);
  };

  const handleSetCoverImage = (url: string | null) => {
    const updatedTheme = {
      ...(survey.theme_config || { primaryColor: "#2563EB", backgroundColor: "#020617", cardStyle: "glass" as const, fontFamily: "Inter" }),
      headerImageUrl: url || undefined,
    };
    const updated = {
      ...survey,
      cover_image: url,
      theme_config: updatedTheme,
    };
    updateSurvey(updated);
    SurveyService.saveSurvey(updated);
    if (url) toast.success("Muqova rasmi muvaffaqiyatli oʻrnatildi va Supabase'ga saqlandi!");
    else toast.info("Muqova rasmi olib tashlandi.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5MB dan oshmasligi kerak!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleSetCoverImage(reader.result);
        setIsCoverModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuestion = (type: QuestionType) => {
    const currentQuestions = survey.questions || [];
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      survey_id: survey.id,
      type,
      label: "",
      required: false,
      order_index: currentQuestions.length,
      config: {
        options: ["radio", "checkbox", "dropdown", "multi_select"].includes(type)
          ? [
              { id: `opt-1`, label: "1-variant", value: "variant_1" },
              { id: `opt-2`, label: "2-variant", value: "variant_2" },
            ]
          : undefined,
      },
    };
    updateSurvey({ ...survey, questions: [...currentQuestions, newQuestion] });
    setSelectedQuestionId(newQuestion.id);
    toast.success("Savol qoʻshildi");
  };

  const handleUpdateQuestion = (updated: Question) => {
    const updatedQuestions = (survey.questions || []).map((q) => (q.id === updated.id ? updated : q));
    updateSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleDuplicateQuestion = (id: string) => {
    const target = survey.questions?.find((q) => q.id === id);
    if (!target) return;
    const duplicated: Question = {
      ...target,
      id: `q-${Date.now()}`,
      label: `${target.label} (Nusxa)`,
    };
    updateSurvey({ ...survey, questions: [...(survey.questions || []), duplicated] });
    setSelectedQuestionId(duplicated.id);
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = (survey.questions || []).filter((q) => q.id !== id);
    updateSurvey({ ...survey, questions: updatedQuestions });
    if (selectedQuestionId === id) {
      setSelectedQuestionId(updatedQuestions.length > 0 ? updatedQuestions[0].id : null);
    }
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const questions = [...(survey.questions || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    const temp = questions[index];
    questions[index] = questions[targetIndex];
    questions[targetIndex] = temp;
    updateSurvey({ ...survey, questions });
  };

  const currentCoverUrl = survey.cover_image || survey.theme_config?.headerImageUrl;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TopToolbar
        survey={survey}
        setSurvey={updateSurvey}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onSave={() => {
          SurveyService.saveSurvey(survey);
          toast.success("Soʻrovnoma saqlandi!");
        }}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenThemes={() => setIsThemesOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenShare={() => {
          if (survey.status === "draft") {
            const updated = { ...survey, status: "published" as const };
            updateSurvey(updated);
            SurveyService.saveSurvey(updated);
          }
          setIsShareOpen(true);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className="lg:col-span-2">
          <LeftPaletteSidebar onAddQuestion={handleAddQuestion} />
        </div>

        <div className="lg:col-span-10 space-y-4">
          {/* Header Card with Cover Image Banner */}
          <Card className="glass-card overflow-hidden rounded-2xl border-slate-800 space-y-0 relative">
            {/* Header Banner Preview */}
            {currentCoverUrl ? (
              <div className="relative h-44 w-full group overflow-hidden bg-slate-950">
                <img
                  src={currentCoverUrl}
                  alt="Survey Cover"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCoverModalOpen(true)}
                    className="h-8 text-xs gap-1.5 border-slate-700 bg-slate-900/80 text-white backdrop-blur-md hover:bg-slate-900"
                  >
                    <ImageIcon className="h-3.5 w-3.5" /> Rasmni oʻzgartirish
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleSetCoverImage(null)}
                    className="h-8 text-xs gap-1 bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <ImageIcon className="h-4 w-4 text-blue-400" /> Muqova rasmi oʻrnatilmagan
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCoverModalOpen(true)}
                  className="h-8 text-xs gap-1.5 border-blue-500/40 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 font-bold"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> 🖼️ Muqova Rasmini Qoʻshish (Banner)
                </Button>
              </div>
            )}

            {/* Title & Description Inputs */}
            <div className="p-6 space-y-3">
              <Input
                value={survey.title}
                onChange={(e) => updateSurvey({ ...survey, title: e.target.value })}
                placeholder="Soʻrovnoma sarlavhasi"
                className="text-2xl font-bold border-none bg-transparent focus:ring-0 px-0 h-auto text-white"
              />
              <Input
                value={survey.description || ""}
                onChange={(e) => updateSurvey({ ...survey, description: e.target.value })}
                placeholder="Ishtirokchilar uchun qisqacha koʻrsatmalar kiriting..."
                className="text-sm text-slate-400 border-none bg-transparent focus:ring-0 px-0 h-auto"
              />
            </div>
          </Card>

          {/* Question Editor Cards */}
          <div className="space-y-4">
            {(survey.questions || []).map((q, idx) => (
              <QuestionEditorCard
                key={q.id}
                question={q}
                index={idx}
                totalQuestions={survey.questions?.length || 0}
                isSelected={q.id === selectedQuestionId}
                onSelect={() => setSelectedQuestionId(q.id)}
                onUpdate={handleUpdateQuestion}
                onDuplicate={() => handleDuplicateQuestion(q.id)}
                onDelete={() => handleDeleteQuestion(q.id)}
                onMoveUp={() => handleMoveQuestion(idx, "up")}
                onMoveDown={() => handleMoveQuestion(idx, "down")}
              />
            ))}
          </div>
        </div>
      </div>

      {/* COVER IMAGE SELECTION MODAL */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-lg glass-card p-6 rounded-2xl border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-white text-base flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-400" /> Muqova Rasmini Tanlash (Header Banner)
              </div>
              <button onClick={() => setIsCoverModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Option 1: Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">1. Tayyor Shablon Rasmlar</label>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_BANNERS.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      handleSetCoverImage(item.url);
                      setIsCoverModalOpen(false);
                    }}
                    className="group relative h-24 rounded-xl overflow-hidden border border-slate-800 cursor-pointer hover:border-blue-500 transition-all"
                  >
                    <img src={item.url} alt={item.label} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white drop-shadow-md">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Option 2: Upload File */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">2. Oʻzingizning Rasm Faylingizni Yuklang</label>
              <label className="flex flex-col items-center justify-center h-20 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 hover:bg-slate-900 cursor-pointer transition-colors text-xs text-slate-400 gap-1.5">
                <Upload className="h-5 w-5 text-blue-400" />
                <span>Rasm faylini tanlash uchun bosing (PNG, JPG, WEBP)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Option 3: URL Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">3. Yoki Rasm Internet Havolasini (URL) Kiriting</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-800 text-xs text-white h-10"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (customCoverUrl) {
                      handleSetCoverImage(customCoverUrl);
                      setIsCoverModalOpen(false);
                    }
                  }}
                  className="h-10 text-xs bg-blue-600 hover:bg-blue-700 font-bold px-4 text-white"
                >
                  Oʻrnatish
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <LivePreviewModal survey={survey} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
      <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} onSelectTemplate={(tmpl) => updateSurvey({ ...survey, ...tmpl })} />
      <QuestionLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} onInsertQuestion={(q) => updateSurvey({ ...survey, questions: [...(survey.questions || []), q] })} />
      <ThemeSelectorModal isOpen={isThemesOpen} onClose={() => setIsThemesOpen(false)} currentTheme={survey.theme_config || { primaryColor: "#2563EB", backgroundColor: "#F8FAFC", cardStyle: "glass", fontFamily: "Inter" }} onSelectTheme={(theme) => updateSurvey({ ...survey, theme_config: theme })} />
      <ShareSurveyDialog survey={survey} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}
