"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ÉP BUỘC LÀ LIGHT MODE, BỎ QUA MỌI CÀI ĐẶT
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Xóa class dark khỏi document
    document.documentElement.classList.remove("dark");
    // Lưu light mode vào localStorage
    localStorage.setItem("theme", "light");
  }, []);

  // Vô hiệu hóa toggle theme
  const toggleTheme = () => {
    // Không làm gì cả, giữ nguyên light mode
    console.log("Dark mode đã bị vô hiệu hóa");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};