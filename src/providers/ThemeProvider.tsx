"use client";

import React, { createContext, useContext, useEffect } from "react";

interface ThemeContextType {
  theme: "dark";
  setTheme: (theme: "dark") => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("edusurvey-theme-mode", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
