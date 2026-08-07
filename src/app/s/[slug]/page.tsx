"use client";

import React, { useState, useEffect, use } from "react";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey, SurveyResponse } from "@/types/survey";
import QuestionFieldRenderer from "@/components/portal/QuestionFieldRenderer";
import SubmissionSuccessCard from "@/components/portal/SubmissionSuccessCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, ArrowRight, ArrowLeft, Send, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function StudentSurveyPortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submittedResponse, setSubmittedResponse] = useState<SurveyResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loaded = SurveyService.getSurveyById(resolvedParams.slug);
    if (loaded) {
      setSurvey(loaded);
      setIsLoading(false);
      const draft = localStorage.getItem(`draft_${loaded.id}`);
      if (draft) {
        try {
          setAnswers(JSON.parse(draft));
          toast.info("Saqlangan qoralama tiklandi");
        } catch {}
      }
    } else {
      // Fetch remote survey from Supabase database
      SurveyService.fetchSurveyFromSupabase(resolvedParams.slug)
        .then((remote) => {
          if (remote) {
            setSurvey(remote);
          } else {
            setNotFound(true);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Soʻrovnoma yuklanmoqda...</p>
        </motion.div>
      </div>
    );
  }

  if (notFound || !survey) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full p-8 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Soʻrovnoma Topilmadi</h2>
            <p className="text-xs text-slate-400">
              Siz kirgan havola mavjud emas yoki muddati tugagan boʻlishi mumkin. Havolani qayta tekshirib koʻring.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 h-10">
                Bosh Sahifaga Qaytish
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (submittedResponse) {
    return <SubmissionSuccessCard survey={survey} response={submittedResponse} />;
  }

  const pages = survey.pages && survey.pages.length > 0 ? survey.pages : [{ id: "p1", survey_id: survey.id, title: "Soʻrovnoma savollari", order_index: 0 }];
  const currentPage = pages[currentPageIndex];
  const currentPageQuestions = (survey.questions || []).filter((q) => !q.page_id || q.page_id === currentPage.id);

  const progressPercent = Math.round(((currentPageIndex + 1) / pages.length) * 100);

  const handleAnswerChange = (questionId: string, val: any) => {
    const updated = { ...answers, [questionId]: val };
    setAnswers(updated);
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
    if (survey) {
      localStorage.setItem(`draft_${survey.id}`, JSON.stringify(updated));
    }
  };

  const validateCurrentPage = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentPageQuestions.forEach((q) => {
      if (q.required && (!answers[q.id] || String(answers[q.id]).trim() === "")) {
        newErrors[q.id] = "Ushbu maydon toʻldirilishi majburiy!";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateCurrentPage()) {
      toast.error("Iltimos, majburiy savollarni toʻldiring!");
      return;
    }
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentPage()) {
      toast.error("Iltimos, majburiy savollarni toʻldiring!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const res = SurveyService.submitResponse(survey.id, answers);
      localStorage.removeItem(`draft_${survey.id}`);
      setIsSubmitting(false);
      setSubmittedResponse(res);
      toast.success("Soʻrovnoma muvaffaqiyatli topshirildi!");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="glass-card p-6 rounded-2xl space-y-4 border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <GraduationCap className="h-4 w-4" /> TAʻLIMIY SOʻROVNOMA PORTALI
              </div>
              <span className="text-xs font-bold text-slate-300">
                {currentPageIndex + 1}-sahifa (jami {pages.length} ta)
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white leading-tight">{survey.title}</h1>
              {survey.description && <p className="text-xs font-medium text-slate-300 leading-relaxed">{survey.description}</p>}
            </div>

            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </Card>
        </motion.div>

        {/* Animated Questions Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentPageQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
              >
                <QuestionFieldRenderer
                  question={q}
                  index={idx}
                  value={answers[q.id]}
                  errorMsg={errors[q.id]}
                  onChange={handleAnswerChange}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="flex items-center justify-between pt-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              className="h-10 text-xs font-bold border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Orqaga
            </Button>
          </motion.div>

          {currentPageIndex < pages.length - 1 ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={handleNext} className="h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 px-6 shadow-lg shadow-blue-600/30">
                Keyingi sahifa <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 px-6 shadow-lg shadow-emerald-600/30"
              >
                {isSubmitting ? "Yuborilmoqda..." : "Soʻrovnomani topshirish"} <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
