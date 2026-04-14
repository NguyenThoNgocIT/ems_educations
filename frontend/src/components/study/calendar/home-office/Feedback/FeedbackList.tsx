import React from "react";

const feedbacks = [
  { id: 1, user: "Nguyễn Văn A", comment: "Buổi học rất bổ ích!", rating: 5 },
  { id: 2, user: "Trần Thị B", comment: "Giảng viên nhiệt tình.", rating: 4 },
];

export default function FeedbackList() {
  return (
    <div className="space-y-4">
      {feedbacks.map((f) => (
        <div
          key={f.id}
          className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="font-bold text-cyan-600">{f.user}</span>
            <span className="text-yellow-400">{"★".repeat(f.rating)}</span>
          </div>
          <p className="text-slate-900 italic dark:text-slate-300 leading-relaxed">
            {f.comment}
          </p>
        </div>
      ))}
    </div>
  );
}

