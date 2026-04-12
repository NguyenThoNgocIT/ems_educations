"use client";
import React from "react";
import {
  Star,
  CheckCircle2,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const feedbackData = [
  {
    id: 1,
    title: "Phản hồi chất lượng video",
    content: "Video mờ chất lượng thấp mong muốn cải thiện",
    rating: 2,
    sender: "Nguyễn Minh Trang",
    date: "25/09/2024 13:38",
    status: "Đang xử lý",
  },
  {
    id: 2,
    title: "123",
    content: "123",
    rating: 3,
    sender: "Nguyễn Minh Trang",
    date: "09/10/2025 22:37",
    status: "Đã xong",
  },
  {
    id: 3,
    title: "Test",
    content: "abcdcdcdcdcc",
    rating: 0,
    sender: "Nguyễn Minh Trang",
    date: "20/10/2025 11:30",
    status: "Mới gửi",
  },
  {
    id: 4,
    title: "he",
    content: "he",
    rating: 0,
    sender: "Ẩn danh",
    date: "09/10/2025 22:36",
    status: "Đang xử lý",
  },
  {
    id: 5,
    title: "Phản hồi về giáo viên Trần Minh Sơn",
    content:
      "Em cảm thấy giáo viên Trần Minh Sơn có phương pháp giảng dạy rất hiệu quả. Thầy/Cô đã giải thích các khái niệm một cách rõ ràng và dễ hiểu...",
    rating: 5,
    sender: "Nguyễn Minh Trang",
    date: "28/08/2024 16:18",
    status: "Đã xong",
  },
];

const FeedbackManagement = () => {
  // Hàm render sao đánh giá
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`}
          />
        ))}
      </div>
    );
  };

  // Hàm lấy màu sắc trạng thái
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Đang xử lý":
        return "bg-[#F59E0B]"; // Cam
      case "Đã xong":
        return "bg-[#22C55E]"; // Xanh lá
      case "Mới gửi":
        return "bg-[#3B82F6]"; // Xanh dương
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- BẢNG PHẢN HỒI --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Nội dung</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Người gửi</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {feedbackData.map((item) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-slate-50/20"
              >
                {/* Tiêu đề */}
                <td className="max-w-[200px] px-6 py-6 font-bold text-slate-900 dark:text-slate-300">
                  {item.title}
                </td>

                {/* Nội dung */}
                <td className="max-w-[350px] px-6 py-6 text-slate-600 dark:text-slate-400">
                  <p className="line-clamp-2 leading-relaxed">{item.content}</p>
                </td>

                {/* Đánh giá sao */}
                <td className="px-6 py-6">{renderStars(item.rating)}</td>

                {/* Người gửi */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-50">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="cursor-pointer font-bold text-indigo-600 hover:underline">
                        {item.sender}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Trạng thái (Badge) --- */}
                <td className="px-6 py-6">
                  <span
                    className={`rounded-lg px-4 py-1.5 text-[10px] font-bold text-white shadow-sm ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Tác vụ (Xem nhanh) --- */}
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center gap-4">
                    <CheckCircle2
                      size={18}
                      className="cursor-pointer text-green-500 transition-transform hover:scale-110"
                    />
                    <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 transition-all hover:bg-slate-50">
                      <Eye size={14} /> Xem
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: TỔNG CỘNG & PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-6 dark:border-slate-700">
        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: 9</span>
          <div className="flex items-center gap-1">
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronLeft size={18} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-indigo-700 shadow-sm">
              1
            </span>
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
