import DemographicCard from "@/components/Center/ecommerce/DemographicCard";
import { EcommerceMetrics } from "@/components/Center/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/Center/ecommerce/MonthlySalesChart";
import MonthlyTarget from "@/components/Center/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/Center/ecommerce/RecentOrders";
import StatisticsChart from "@/components/Center/ecommerce/StatisticsChart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function ExamBankPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
