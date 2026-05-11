"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  ThumbsUp,
  MessageCircle,
  Share2,
  Smile,
  Camera,
  Gift,
  Sticker,
  Send,
} from "lucide-react";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  role?: string; // Thêm role để hiển thị đúng logic phân quyền
}

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any; // Nhận data từ NewsPage
  currentUser: any; // Thông tin người đang đăng nhập
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
  currentUser,
}) => {
  // Logic 1: Đồng bộ danh sách bình luận với bài viết được chọn
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Mỗi khi bài viết thay đổi, cập nhật danh sách bình luận tương ứng
  useEffect(() => {
    if (post && post.commentsList) {
      setComments(post.commentsList);
    } else {
      setComments([]);
    }
  }, [post]);

  // Logic 2: Hàm gửi bình luận mới
  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      id: Date.now(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      content: newComment,
      time: "Vừa xong",
      likes: 0,
      role: currentUser.role,
    };

    setComments([...comments, commentObj]);
    setNewComment("");
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-in zoom-in flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header: Tên bài viết & Nút đóng */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex-1 text-center text-lg font-bold dark:text-white leading-normal">
            Bài viết của {post.author}
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-50 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: Nội dung bài viết và thảo luận */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Nội dung bài viết gốc */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {post.author.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold dark:text-white leading-tight leading-snug">
                  {post.author}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{post.date}</p>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed dark:text-slate-200 leading-relaxed">
              {post.excerpt}
            </p>
            {post.image && (
              <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
                <img
                  src={post.image}
                  alt="post content"
                  className="max-h-[400px] w-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Thống kê lượt tương tác */}
          <div className="flex items-center justify-between border-b border-slate-50 py-2 text-sm text-slate-6 leading-relaxed00 dark:border-slate-700">
            <div className="flex items-center gap-1">
              <span className="rounded-full bg-blue-500 p-1 text-white">
                <ThumbsUp size={10} fill="white" />
              </span>
              <span>{post.likes} lượt thích</span>
            </div>
            <span>{comments.length} bình luận</span>
          </div>

          {/* Danh sách bình luận động */}
          <div className="space-y-5 pt-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar}
                  className="h-9 w-9 flex-shrink-0 rounded-full border dark:border-slate-600"
                  alt="avatar"
                />
                <div className="flex-1">
                  <div className="inline-block max-w-[95%] rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <div className="mb-0.5 flex items-center gap-2">
                      <h4 className="text-sm font-bold dark:text-white leading-tight leading-snug">
                        {comment.author}
                      </h4>
                      {comment.role && (
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                          {comment.role}
                        </span>
                      )}
                    </div>
                    <p className="text-sm dark:text-slate-3 leading-relaxed00 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <div className="mt-1 ml-2 flex items-center gap-4 text-xs font-bold text-slate-600">
                    <span>{comment.time}</span>
                    <button className="transition-colors hover:text-indigo-600 hover:underline">
                      Thích
                    </button>
                    <button className="transition-colors hover:text-indigo-600 hover:underline">
                      Trả lời
                    </button>
                    {comment.likes > 0 && (
                      <span className="flex items-center gap-1 font-normal">
                        <ThumbsUp
                          size={12}
                          className="text-indigo-600"
                          fill="currentColor"
                        />{" "}
                        {comment.likes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Ô nhập liệu */}
        <div className="border-t border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              className="h-9 w-9 rounded-full border dark:border-slate-600"
              alt="my avatar"
            />
            <div className="flex-1 rounded-2xl bg-slate-50 p-2 px-4 dark:bg-slate-800">
              <p className="mb-1 text-[11px] font-medium text-slate-400 leading-relaxed">
                Bình luận dưới tên {currentUser.name}
              </p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận . . ."
                className="max-h-32 w-full resize-none border-none bg-transparent text-sm outline-none dark:text-white"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />
              <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-600">
                <div className="flex gap-2 text-slate-400">
                  <button className="transition-colors hover:text-indigo-600">
                    <Smile size={18} />
                  </button>
                  <button className="transition-colors hover:text-indigo-600">
                    <Camera size={18} />
                  </button>
                  <button className="transition-colors hover:text-indigo-600">
                    <Gift size={18} />
                  </button>
                  <button className="transition-colors hover:text-indigo-600">
                    <Sticker size={18} />
                  </button>
                </div>
                <button
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  className={`p-1 transition-all ${newComment.trim() ? "scale-110 text-indigo-600" : "text-slate-300"}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;



