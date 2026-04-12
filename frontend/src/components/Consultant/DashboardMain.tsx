"use client";
import React, { useState } from "react";
import ConsultantOverview from "./job-overview/ConsultantOverview";
import ConsultantLeadList from "./job-overview/ConsultantLeadList";
import ConsultantSales from "./business/ConsultantSales";
import ConsultantAdmission from "./admissions/ConsultantAdmission";
import ConsultantStudent from "./student/ConsultantStudent";
import ConsultantFeedback from "./feedback/ConsultantFeedback";

const DashboardMain = () => {
  const [activeTab, setActiveTab] = useState("Tổng quan công việc");
  const [isListView, setIsListView] = useState(false);

  const tabs = [
    "Tổng quan công việc",
    "Kinh doanh",
    "Tuyển sinh",
    "Học viên",
    "Phản hồi",
  ];

  // Hàm render nội dung động theo Tab
  const renderContent = () => {
    switch (activeTab) {
      case "Tổng quan công việc":
        return isListView ? (
          <ConsultantLeadList onBack={() => setIsListView(false)} />
        ) : (
          <ConsultantOverview onViewList={() => setIsListView(true)} />
        );
      case "Kinh doanh":
        return <ConsultantSales />;
      case "Tuyển sinh":
        return <ConsultantAdmission />;
      case "Học viên":
        return <ConsultantStudent />;
      case "Phản hồi":
        return <ConsultantFeedback />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      {/* Tab Header - Giữ nguyên logic UI của bạn */}
      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsListView(false); // Luôn về trang đầu của mỗi tab khi chuyển
            }}
            className={`relative px-5 py-2.5 text-xs font-bold transition-all duration-200 ${
              activeTab === tab
                ? "z-10 -mb-px rounded-t-lg border-t border-r border-l bg-white text-indigo-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nội dung thay đổi linh hoạt với hiệu ứng Animation */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardMain;
