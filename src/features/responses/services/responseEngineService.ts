import { Survey, SurveyResponse, RespondentMeta } from "@/types/survey";
import { generateSubmissionId } from "@/lib/utils";

export class ResponseEngineService {
  public static createSessionMeta(): RespondentMeta {
    if (typeof window === "undefined") {
      return { device: "desktop", group: "CS-201", course: "Computer Science" };
    }

    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);

    return {
      ip: "hash-" + Math.random().toString(36).substring(2, 10), // Hashed IP only
      userAgent: ua,
      device: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
      group: "CS-201",
      course: "Computer Science",
      gender: "Male",
      region: "Tashkent",
    };
  }

  public static calculateStatistics(responses: SurveyResponse[]) {
    const total = responses.length;
    const completed = responses.filter((r) => r.status === "completed").length;
    const partial = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalSeconds = responses.reduce((acc, curr) => {
      const start = new Date(curr.started_at).getTime();
      const end = new Date(curr.completed_at).getTime();
      return acc + Math.max(0, Math.floor((end - start) / 1000));
    }, 0);

    const avgTimeSeconds = completed > 0 ? Math.round(totalSeconds / completed) : 0;

    return {
      total,
      completed,
      partial,
      completionRate,
      avgTimeSeconds,
    };
  }
}
