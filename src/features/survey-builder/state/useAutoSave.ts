import { useState, useEffect, useRef } from "react";
import { Survey } from "@/types/survey";
import { SurveyService } from "@/lib/services/surveyService";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(survey: Survey | null, debounceMs = 1500) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!survey) return;

    setSaveStatus("saving");

    const timer = setTimeout(() => {
      try {
        SurveyService.saveSurvey(survey);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [survey, debounceMs]);

  return saveStatus;
}
