"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey } from "@/types/survey";

export default function NewSurveyPage() {
  const router = useRouter();

  useEffect(() => {
    const surveyId = `srv-${Date.now()}`;
    const newSurvey: Survey = {
      id: surveyId,
      title: "Nomsiz Taʻlimiy Soʻrovnoma",
      description: "Soʻrovnoma tavsifi va umumiy maʻlumotlarini bu yerda kiriting.",
      status: "draft",
      is_multistep: false,
      theme_config: {
        primaryColor: "#2563EB",
        backgroundColor: "#020617",
        cardStyle: "glass",
        fontFamily: "Inter",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      responses_count: 0,
      pages: [
        {
          id: `p-${Date.now()}`,
          survey_id: surveyId,
          title: "1-sahifa",
          order_index: 0,
        },
      ],
      questions: [
        {
          id: `q-${Date.now()}`,
          survey_id: surveyId,
          type: "short_text",
          label: "F.I.SH (Toʻliq ismingiz)",
          placeholder: "Ism va familiyangizni kiriting",
          required: true,
          order_index: 0,
          config: {},
        },
      ],
    };

    SurveyService.saveSurvey(newSurvey);
    router.replace(`/admin/surveys/builder/${newSurvey.id}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-white">
      <div className="text-center space-y-3">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs font-semibold text-slate-300">Soʻrovnoma Konstruktori Yaratilmoqda...</p>
      </div>
    </div>
  );
}
