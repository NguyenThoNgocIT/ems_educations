interface Comment {
  id: number;
  author: string;
  role: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  image: string;
  likes: number;
  comments: number;
  commentsList: Comment[]; // Thêm danh sách bình luận chi tiết ở đây
}

const newsData: News[] = [
  {
    id: 1,
    title: "Giải pháp quản lý sau Đại học thành công tại Khoa Y",
    excerpt:
      "MONA.Software đã triển khai thành công hệ thống quản lý đào tạo chuyên sâu, giúp tối ưu hóa quy trình xét duyệt hồ sơ cho học viên...",
    category: "Vận hành",
    author: "Admin",
    authorRole: "Admin",
    date: "1 năm trước",
    image: "/images/news/post1.jpg",
    likes: 1200,
    comments: 2,
    commentsList: [
      {
        id: 101,
        author: "Võ Thế Công",
        role: "Học viên",
        avatar: "/api/placeholder/40/40",
        content:
          "Hệ thống chạy rất mượt, giúp em tiết kiệm rất nhiều thời gian làm thủ tục ạ!",
        time: "2 giờ trước",
        likes: 5,
      },
      {
        id: 102,
        author: "Trần Thị Học Vụ",
        role: "Học vụ",
        avatar: "/api/placeholder/40/40",
        content: "Giải pháp này rất thiết thực cho khối ngành Y dược.",
        time: "1 giờ trước",
        likes: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Thông báo: Cập nhật lịch thi học kỳ phụ tháng 2/2026",
    excerpt:
      "Phòng Học vụ thông báo lịch thi chính thức cho các lớp bổ trợ kiến thức...",
    category: "Học vụ",
    author: "Trần Thị Học Vụ",
    authorRole: "Học vụ",
    date: "2 ngày trước",
    image: "/images/news/exam-schedule.jpg",
    likes: 45,
    comments: 1,
    commentsList: [
      {
        id: 201,
        author: "Nguyễn Văn Học",
        role: "Học viên",
        avatar: "/api/placeholder/40/40",
        content: "Đã xem lịch thi, cảm ơn cô ạ!",
        time: "1 ngày trước",
        likes: 0,
      },
    ],
  },
  {
    id: 4,
    title: "Hướng dẫn sử dụng phòng Zoom và tài liệu tham khảo mới",
    excerpt:
      "Để đảm bảo chất lượng dạy và học trực tuyến, giáo viên đã cập nhật lại kho tài liệu PDF...",
    category: "Giảng dạy",
    author: "Thầy Giáo Bá",
    authorRole: "Giáo Viên",
    date: "1 tuần trước",
    image: "/images/news/zoom-guide.jpg",
    likes: 18,
    comments: 2,
    commentsList: [
      {
        id: 401,
        author: "Trần Phi Khanh",
        role: "Học viên",
        avatar: "/api/placeholder/40/40",
        content: "Dỡn trời kkk, tài liệu hay quá thầy ơi!",
        time: "2 ngày trước",
        likes: 16,
      },
      {
        id: 402,
        author: "Phụ Huynh Bé Bi",
        role: "Phu huynh",
        avatar: "/api/placeholder/40/40",
        content: "Cảm ơn thầy đã hỗ trợ các con tận tình.",
        time: "1 ngày trước",
        likes: 1,
      },
    ],
  },
  {
    id: 7,
    title: "Học viên mới ra trường chia sẻ kinh nghiệm tìm việc",
    excerpt:
      "Sau khi hoàn thành khóa học tại đây, mình đã tìm được công việc ưng ý đúng chuyên ngành...",
    category: "Góc học viên",
    author: "Võ Thế Công",
    authorRole: "Học viên",
    date: "Vừa xong",
    image: "",
    likes: 3,
    comments: 1,
    commentsList: [
      {
        id: 701,
        author: "Admin",
        role: "Admin",
        avatar: "/api/placeholder/40/40",
        content:
          "Chúc mừng bạn Công nhé, thành công của bạn là niềm tự hào của trung tâm!",
        time: "Vừa xong",
        likes: 1,
      },
    ],
  },
];

export default newsData;
