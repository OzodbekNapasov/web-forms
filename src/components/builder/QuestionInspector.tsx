"use client";

import React, { useState } from "react";
import { Question } from "@/types/survey";
import QuestionInspectorGeneral from "@/components/survey/QuestionInspectorGeneral";
import QuestionInspectorOptions from "@/components/survey/QuestionInspectorOptions";
import QuestionInspectorValidation from "@/components/survey/QuestionInspectorValidation";
import QuestionInspectorLogic from "@/components/survey/QuestionInspectorLogic";

interface QuestionInspectorProps {
  question: Question;
  allQuestions: Question[];
  onChange: (updated: Question) => void;
}

export default function QuestionInspector({ question, allQuestions, onChange }: QuestionInspectorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "options" | "validation" | "logic">("general");
  const hasOptions = ["radio", "checkbox", "dropdown", "multi_select"].includes(question.type);

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "general" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Umumiy
        </button>
        {hasOptions && (
          <button
            onClick={() => setActiveTab("options")}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "options" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Variantlar ({question.config.options?.length || 0})
          </button>
        )}
        <button
          onClick={() => setActiveTab("validation")}
          className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "validation" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Tekshiruv
        </button>
        <button
          onClick={() => setActiveTab("logic")}
          className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "logic" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Mantiq
        </button>
      </div>

      {activeTab === "general" && <QuestionInspectorGeneral question={question} onChange={onChange} />}
      {activeTab === "options" && <QuestionInspectorOptions question={question} onChange={onChange} />}
      {activeTab === "validation" && <QuestionInspectorValidation question={question} onChange={onChange} />}
      {activeTab === "logic" && <QuestionInspectorLogic question={question} allQuestions={allQuestions} onChange={onChange} />}
    </div>
  );
}
