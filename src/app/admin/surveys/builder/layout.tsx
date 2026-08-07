import React from "react";
import Navbar from "@/components/layout/Navbar";

// Builder page uses its own full-width layout — no sidebar, no max-width constraint
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <div className="flex-1 w-full px-4 sm:px-6 py-4">
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
