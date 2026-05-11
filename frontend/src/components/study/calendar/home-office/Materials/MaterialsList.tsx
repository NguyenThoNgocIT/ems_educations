import React from "react";

const materials = [
  { id: 1, name: "Tài liệu Toán", type: "PDF", url: "#" },
  { id: 2, name: "Slide Lý thuyết", type: "PPT", url: "#" },
  { id: 3, name: "Bài đọc thêm", type: "DOCX", url: "#" },
];

const typeColor: Record<string, string> = {
  PDF: "bg-red-500",
  PPT: "bg-yellow-500",
  DOCX: "bg-blue-500",
};

export default function MaterialsList() {
  return (
    <div className="space-y-4">
      {materials.map((m) => (
        <a
          key={m.id}
          href={m.url}
          className="block flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
        >
          <div>
            <h3 className="text-lg font-bold text-green-600 leading-normal leading-tight leading-snug">{m.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Loại: {m.type}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-white ${typeColor[m.type]}`}
          >
            {m.type}
          </span>
        </a>
      ))}
    </div>
  );
}


