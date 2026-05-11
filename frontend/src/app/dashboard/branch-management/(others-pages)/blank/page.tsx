import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-2xl border border-slate-200 bg-white px-5 py-7 xl:px-10 xl:py-12 dark:border-slate-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="text-theme-xl mb-4 font-semibold text-slate-800 sm:text-2xl dark:text-white/90 leading-snug leading-snug">
            Card Title Here
          </h3>
          <p className="text-sm text-slate-500 sm:text-base dark:text-slate-4 leading-relaxed00 leading-relaxed leading-relaxed">
            Start putting content on grids or panels, you can also use different
            combinations of grids.Please check out the dashboard and other pages
          </p>
        </div>
      </div>
    </div>
  );
}


