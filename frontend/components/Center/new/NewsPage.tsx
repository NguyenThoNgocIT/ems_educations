"use client";
import {
  FileText,
  ImageIcon,
  Search,
  ShareIcon,
  ThumbsUp,
  MessageCircle,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import axios from "axios";
import staticNewsData from "./content/data_new";
import CreatePostModal from "./content/CreatePostModal";
import GroupSidebar from "./group/GroupSidebar";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostDetailModal from "./comment/PostInteraction";
import CreateGroupModal from "./group/CreateGroupModal";

const currentUser = {
  name: "Võ Thế Công",
  role: "Học viên",
  avatar: "/images/user/owner.jpg", // Trỏ về ảnh avatar thực tế của bạn
};

const NewsContent = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsList, setNewsList] = useState(staticNewsData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // --- 2. LOGIC API: Tự động bóc tách data từ cổng 7001 ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        // Gọi qua Proxy /api đã cấu hình trong next.config.ts
        const apiUrl = groupId ? `/auth/news?groupId=${groupId}` : "/auth/news";

        const response = await axios.get(apiUrl);

        // Kiểm tra mã thành công 200 từ Backend
        if (response.status === 200 && response.data?.length > 0) {
          setNewsList(response.data);
        } else {
          filterStaticData(groupId);
        }
      } catch (error) {
        console.error(
          "Lỗi kết nối Backend 7001, dùng data tĩnh để test:",
          error,
        );
        filterStaticData(groupId);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [groupId]);

  const filterStaticData = (id: string | null) => {
    if (!id) {
      setNewsList(staticNewsData);
    } else {
      const filtered = staticNewsData.filter(
        (item) => item.id % 2 === Number(id) % 2,
      );
      setNewsList(filtered);
    }
  };

  const formatStats = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num;
  };

  const getRoleStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-rose-500 text-white";
      case "học viên":
        return "bg-indigo-500 text-white";
      case "giáo viên":
        return "bg-amber-500 text-black";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const handleOpenDetail = (post: any) => {
    setSelectedPost(post);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-6 p-4 lg:flex-row lg:p-6">
        {/* --- CỘT TRÁI: TIN TỨC --- */}
        <div className="w-full flex-1 space-y-6">
          {/* Tìm kiếm: Đồng bộ text đen/trắng */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-12 pl-4 text-sm text-slate-9 leading-relaxed00 shadow-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <Search
              className="absolute top-3.5 right-4 text-slate-400"
              size={20}
            />
          </div>

          {/* Form đăng bài nhanh: Chỉnh tone màu Slate sang trọng */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-full bg-slate-50 px-5 py-3 text-left text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-4 leading-relaxed00 dark:hover:bg-slate-700/50"
              >
                {groupId
                  ? `Đăng vào nhóm...`
                  : `${currentUser.name} ơi, bạn muốn chia sẻ gì không?`}
              </button>
            </div>
            <div className="mt-4 flex justify-around border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg p-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:text-slate-3 leading-relaxed00 dark:hover:bg-slate-800"
              >
                <span className="text-emerald-500">
                  <FileText size={20} />
                </span>{" "}
                Bài viết
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg p-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:text-slate-3 leading-relaxed00 dark:hover:bg-slate-800"
              >
                <span className="text-indigo-500">
                  <ImageIcon size={20} />
                </span>{" "}
                Ảnh/Video
              </button>
            </div>
          </div>

          {/* Danh sách tin tức: Đồng bộ Indigo & Slate */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-indigo-500">
                <Loader2 className="animate-spin" size={36} />
                <span className="text-sm font-bold">
                  Đang lấy tin mới từ server 7001...
                </span>
              </div>
            ) : (
              newsList.map((news) => (
                <div
                  key={news.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between p-4">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-bold text-white shadow-sm">
                        {news.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight leading-snug">
                            {news.author}
                          </h3>
                          <span
                            className={`${getRoleStyle(news.authorRole)} rounded px-2 py-0.5 text-[10px] font-bold`}
                          >
                            {news.authorRole || "Admin"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {news.date}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="px-4 pb-2">
                    <p className="mb-4 text-[15px] leading-relaxed text-slate-800 dark:text-slate-300 leading-relaxed">
                      <span className="mr-1 text-lg font-bold leading-normal">❓</span>
                      {news.excerpt}
                      <button
                        onClick={() => handleOpenDetail(news)}
                        className="ml-1 font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        Hiện thêm
                      </button>
                    </p>
                    {news.image && (
                      <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 shadow-sm dark:border-slate-800">
                        <img
                          src={news.image}
                          alt="content"
                          className="h-auto max-h-[450px] w-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Lượt tương tác */}
                  <div className="mx-2 flex items-center justify-between border-t border-slate-50 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-full border border-white bg-indigo-500 p-1 shadow-sm dark:border-slate-900">
                        <ThumbsUp
                          size={10}
                          fill="white"
                          className="text-white"
                        />
                      </div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        {news.likes > 0
                          ? `Bạn và ${formatStats(news.likes - 1)} người khác`
                          : "Trở thành người đầu tiên thích"}
                      </span>
                    </div>
                    <div className="flex gap-4 font-semibold text-slate-500 dark:text-slate-400">
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleOpenDetail(news)}
                      >
                        {formatStats(news.comments)} bình luận
                      </span>
                      <span>57 chia sẻ</span>
                    </div>
                  </div>

                  {/* Nút thao tác nhanh */}
                  <div className="flex items-center justify-between border-t border-slate-50 px-4 py-1.5 dark:border-slate-800">
                    <div className="flex flex-1 gap-2">
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        <ThumbsUp size={18} /> Thích
                      </button>
                      <button
                        onClick={() => handleOpenDetail(news)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-4 leading-relaxed00 dark:hover:bg-slate-800"
                      >
                        <MessageCircle size={18} /> Bình luận
                      </button>
                    </div>
                    <button className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                      <ShareIcon size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar nhóm: Truyền hàm mở modal tạo nhóm */}
        <GroupSidebar onAddGroup={() => setIsGroupModalOpen(true)} />
      </div>

      {/* --- CÁC MODALS --- */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
      />

      {selectedPost && (
        <PostDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          post={selectedPost}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center font-bold text-indigo-600">
          Đang khởi tạo MONA Web...
        </div>
      }
    >
      <NewsContent />
    </Suspense>
  );
}


