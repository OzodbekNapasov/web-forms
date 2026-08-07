"use client";

import React from "react";
import ThemeProvider from "./ThemeProvider";
import QueryProvider from "./QueryProvider";
import SupabaseProvider from "./SupabaseProvider";
import { Toaster } from "sonner";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SupabaseProvider>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </SupabaseProvider>
    </QueryProvider>
  );
}
