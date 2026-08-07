"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey, Question, QuestionType, ThemeConfig } from "@/types/survey";
import { useUndoRedoStore } from "@/features/survey-builder/state/useUndoRedoStore";
import { useAutoSave } from "@/features/survey-builder/state/useAutoSave";
import TopToolbar from "@/features/survey-builder/components/TopToolbar";
import LeftPaletteSidebar from "@/features/survey-builder/components/LeftPaletteSidebar";
import QuestionEditorCard from "@/components/builder/QuestionEditorCard";
import SurveySettingsDrawer from "@/components/builder/SurveySettingsDrawer";
import LivePreviewModal from "@/components/builder/LivePreviewModal";
import TemplatesModal from "@/features/survey-builder/components/TemplatesModal";
import QuestionLibraryModal from "@/features/survey-builder/components/QuestionLibraryModal";
import ThemeSelectorModal from "@/features/survey-builder/components/ThemeSelectorModal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

  const selectedQuestion = survey.questions?.find((q) => q.id === selectedQuestionId);

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
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className="lg:col-span-2">
          <LeftPaletteSidebar onAddQuestion={handleAddQuestion} />
        </div>

        <div className="lg:col-span-10 space-y-4">
          <Card className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
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
          </Card>

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

      <LivePreviewModal survey={survey} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
      <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} onSelectTemplate={(tmpl) => updateSurvey({ ...survey, ...tmpl })} />
      <QuestionLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} onInsertQuestion={(q) => updateSurvey({ ...survey, questions: [...(survey.questions || []), q] })} />
      <ThemeSelectorModal isOpen={isThemesOpen} onClose={() => setIsThemesOpen(false)} currentTheme={survey.theme_config || { primaryColor: "#2563EB", backgroundColor: "#F8FAFC", cardStyle: "glass", fontFamily: "Inter" }} onSelectTheme={(theme) => updateSurvey({ ...survey, theme_config: theme })} />
    </div>
  );
}
