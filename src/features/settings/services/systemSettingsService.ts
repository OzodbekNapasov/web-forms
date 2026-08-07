export interface SystemBranding {
  institutionName: string;
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

const SETTINGS_STORAGE_KEY = "edusurvey_system_branding_v1";

const DEFAULT_BRANDING: SystemBranding = {
  institutionName: "Tashkent State Technical University",
  primaryColor: "#2563EB",
  secondaryColor: "#22C55E",
  accentColor: "#8B5CF6",
  footerText: "© 2026 EduSurvey Academic Platform. All Rights Reserved.",
  contactEmail: "admin@edusurvey.edu.uz",
  contactPhone: "+998 71 200 45 67",
  address: "University Street 2, Tashkent, Uzbekistan",
};

export class SystemSettingsService {
  public static getBranding(): SystemBranding {
    if (typeof window === "undefined") return DEFAULT_BRANDING;
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_BRANDING));
      return DEFAULT_BRANDING;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BRANDING;
    }
  }

  public static saveBranding(branding: SystemBranding): SystemBranding {
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(branding));
    }
    return branding;
  }

  public static async testGoogleSheetsConnection(webhookUrl: string): Promise<boolean> {
    if (!webhookUrl) return false;
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "PING" }),
        mode: "no-cors",
      });
      return true;
    } catch {
      return false;
    }
  }

  public static exportFullSystemBackup(): void {
    const backupData = {
      timestamp: new Date().toISOString(),
      branding: this.getBranding(),
      surveys: typeof window !== "undefined" ? localStorage.getItem("edusurvey_surveys_v1") : null,
      responses: typeof window !== "undefined" ? localStorage.getItem("edusurvey_responses_v1") : null,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EduSurvey_Full_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
