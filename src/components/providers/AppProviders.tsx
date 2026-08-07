"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

interface ThemeContextType {
  theme: "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("edusurvey-theme", "dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
        {children}
        <Toaster position="top-right" richColors closeButton theme="dark" />
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}
