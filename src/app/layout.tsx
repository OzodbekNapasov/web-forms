import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "EduSurvey - Professional Taʻlimiy Soʻrovnomalar Tizimi",
  description: "Universitetlar va taʻlim muassasalari uchun soʻrovnomalar yaratish, Google Sheets sinxronlash va akademik analitika platformasi.",
  keywords: ["EduSurvey", "Taʻlimiy Soʻrovnoma", "Universitet Soʻrovnomasi", "Talabalar Baholash Tizimi"],
  authors: [{ name: "EduSurvey Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-blue-500 selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
