"use client";
import React, { useRef, useState, useEffect } from "react";
import { X, Plus, Send, Image as ImageIcon, Camera } from "lucide-react";

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

// Định nghĩa kiểu dữ liệu cho ảnh có kèm link preview
interface ImagePreview {
  file: File;
  url: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);

  // 1. Logic xử lý khi chọn ảnh từ máy tính/điện thoại
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Tạo đường dẫn preview cho từng ảnh
      const newImages = filesArray.map((file) => ({
        file: file,
        url: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // 2. Xóa ảnh và giải phóng bộ nhớ
  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].url); // Giải phóng bộ nhớ trình duyệt
    setImages(images.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 duration-200">
      <div className="animate-in zoom-in flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header: */}
        <div className="flex items-center justify-between border-b bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border bg-blue-100 dark:border-slate-600">
              <img
                src={currentUser.avatar || "/api/placeholder/48/48"}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white leading-tight leading-snug">
                {currentUser.name}
              </h3>
              <div className="flex w-fit items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <span className="text-[10px]">👥</span> {currentUser.role}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: Nhập văn bản và HIỂN THỊ ẢNH TRỰC TIẾP */}
        <div className="custom-scrollbar max-h-[60vh] min-h-[250px] flex-1 space-y-4 overflow-y-auto p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`${currentUser.name} ơi, bạn đang nghĩ gì?`}
            className="h-24 w-full resize-none bg-transparent text-lg outline-none placeholder:text-slate-400 dark:text-white leading-normal"
          />

          {/* Lưới hiển thị ảnh Preview (Không phải dạng file chữ) */}
          {images.length > 0 && (
            <div
              className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border dark:border-slate-700"
                >
                  <img
                    src={img.url}
                    alt="preview"
                    className="h-48 w-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MỤC THÊM ẢNH Ở DƯỚI (Action Bar) --- */}
        <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-3 leading-relaxed00">
            Thêm vào bài viết của bạn
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full p-2 text-green-500 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ImageIcon size={24} />
            </button>
            <button className="rounded-full p-2 text-indigo-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
              <Camera size={24} />
            </button>
          </div>
        </div>

        {/* Nút đăng bài */}
        <div className="border-t p-4 dark:border-slate-700">
          <button
            disabled={!content.trim() && images.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            <Send size={18} /> Đăng bài
          </button>
        </div>

        {/* Input file ẩn kết nối dữ liệu máy tính/điện thoại */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept="image/*,video/*"
        />
      </div>
    </div>
  );
};

export default CreatePostModal;



