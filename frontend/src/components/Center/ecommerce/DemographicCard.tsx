"use client";
import Image from "next/image";

import CountryMap from "./CountryMap";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-700 dark:bg-white/[0.03]">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white/90 leading-normal leading-snug">
            Customers Demographic
          </h3>
          <p className="text-theme-sm mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
            Number of customer based on country
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="border-gary-200 my-6 overflow-hidden rounded-2xl border bg-slate-50 px-4 py-6 sm:px-6 dark:border-slate-700 dark:bg-slate-900">
        <div
          id="mapOne"
          className="mapOne map-btn 2xsm:w-[307px] xsm:w-[358px] -mx-4 -my-6 h-[212px] w-[252px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-8 items-center rounded-full">
              <Image
                width={48}
                height={48}
                src="/images/country/country-01.svg"
                alt="usa"
                className="w-full"
              />
            </div>
            <div>
              <p className="text-theme-sm font-semibold text-slate-900 dark:text-white/90 leading-relaxed">
                USA
              </p>
              <span className="text-theme-xs block text-slate-600 dark:text-slate-400">
                2,379 Customers
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-slate-200 dark:bg-slate-800">
              <div className="absolute top-0 left-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-indigo-600 text-xs font-medium text-white"></div>
            </div>
            <p className="text-theme-sm font-medium text-slate-900 dark:text-white/90 leading-relaxed">
              79%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-8 items-center rounded-full">
              <Image
                width={48}
                height={48}
                className="w-full"
                src="/images/country/country-02.svg"
                alt="france"
              />
            </div>
            <div>
              <p className="text-theme-sm font-semibold text-slate-900 dark:text-white/90 leading-relaxed">
                France
              </p>
              <span className="text-theme-xs block text-slate-600 dark:text-slate-400">
                589 Customers
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-slate-200 dark:bg-slate-800">
              <div className="absolute top-0 left-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-indigo-600 text-xs font-medium text-white"></div>
            </div>
            <p className="text-theme-sm font-medium text-slate-900 dark:text-white/90 leading-relaxed">
              23%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


