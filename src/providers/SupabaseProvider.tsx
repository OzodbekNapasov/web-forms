"use client";

import React, { createContext, useContext, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

interface SupabaseContextType {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return context;
};

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://edusurvey-demo.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo"
    )
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}
