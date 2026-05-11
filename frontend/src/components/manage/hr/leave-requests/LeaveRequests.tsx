import React from "react";

const leaveRequests = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    from: "2026-02-10",
    to: "2026-02-12",
    reason: "Nghỉ ốm",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    name: "Trần Thị B",
    from: "2026-02-15",
    to: "2026-02-16",
    reason: "Việc gia đình",
    status: "Đã duyệt",
  },
];

const statusColor: Record<string, string> = {
  "Chờ duyệt": "bg-yellow-500",
  "Đã duyệt": "bg-green-500",
};

export default function LeaveRequests() {
  return (
    <div className="space-y-4">
      {leaveRequests.map((l) => (
        <div
          key={l.id}
          className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
        >
          <div>
            <h3 className="text-lg font-bold text-pink-600 leading-normal leading-tight leading-snug">{l.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Từ: {l.from} - Đến: {l.to}
            </p>
            <p className="text-xs text-slate-600 italic leading-relaxed">Lý do: {l.reason}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-white ${statusColor[l.status]}`}
          >
            {l.status}
          </span>
        </div>
      ))}
    </div>
  );
}


