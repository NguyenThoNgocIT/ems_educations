"use client";

import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { Badge } from "lucide-react";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 dark:border-slate-700 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:border dark:border-slate-700 dark:bg-white/[0.03]">
          <GroupIcon className="size-6 text-slate-900 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-4 leading-relaxed00">
              Customers
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-slate-900 dark:text-white/90 leading-tight leading-snug">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 dark:border-slate-700 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:border dark:border-slate-700 dark:bg-white/[0.03]">
          <BoxIconLine className="text-slate-900 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-4 leading-relaxed00">
              Orders
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-slate-900 dark:text-white/90 leading-tight leading-snug">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};


