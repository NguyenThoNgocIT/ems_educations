import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-slate-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-slate-900">
          {children}
          <div className="relative hidden h-full w-full items-center justify-center overflow-hidden lg:flex lg:w-1/2 bg-slate-50 dark:bg-slate-950">
            <div className="absolute inset-0 z-0 opacity-20">
              <GridShape />
            </div>
            <div className="relative z-10 w-full h-full p-12 flex items-center justify-center">
              <div className="relative w-full h-full max-w-lg aspect-square">
                <Image
                  src="/images/education-auth.png"
                  alt="Education Illustration"
                  fill
                  className="object-contain animate-float"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

