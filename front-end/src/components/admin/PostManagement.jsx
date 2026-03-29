import React, { useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/PostManagement.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 4;

const mockPosts = [
  { id: 1, author: "Nguyễn Văn A",   avatar: "N", avatarColor: "#c8102e", content: "Mọi người cho mình hỏi lịch đăng ký tín chỉ học kỳ 2 xem ở đâu vậy ạ? Mình tìm trên web trường không thấy 🥺", likes: 15, comments: 3, postedAt: "2 giờ trước",   status: "Bình thường", reported: false },
  { id: 2, author: "Trần Thị Bình",  avatar: "T", avatarColor: "#10b981", content: "Ai biết phòng học môn Giải tích 2 tuần này chuyển sang phòng nào không ạ? Trong QLDT không thấy cập nhật.", likes: 8,  comments: 5, postedAt: "5 giờ trước",   status: "Bình thường", reported: false },
  { id: 3, author: "Lê Văn C",       avatar: "L", avatarColor: "#f59e0b", content: "Trang tín chỉ ptit dạo này hay sập lắm, mọi người có cách nào đăng ký không bị lỗi không ạ? =))", likes: 22, comments: 10, postedAt: "1 ngày trước",  status: "Bình thường", reported: false },
  { id: 4, author: "Phạm Thị D",     avatar: "P", avatarColor: "#3b82f6", content: "Cho mình hỏi thủ tục làm thẻ sinh viên lần đầu cần những giấy tờ gì ạ? Cảm ơn mọi người!", likes: 5,  comments: 2, postedAt: "2 ngày trước",  status: "Bình thường", reported: false },
  { id: 5, author: "Vũ Quốc Nam",    avatar: "V", avatarColor: "#8b5cf6", content: "Mình muốn hỏi về việc chuyển ngành/chuyên ngành ở trường thì làm thế nào ạ? Cần điều kiện gì không?", likes: 11, comments: 4, postedAt: "3 ngày trước",  status: "Bình thường", reported: false },
  { id: 6, author: "Hoàng Đức Long", avatar: "H", avatarColor: "#06b6d4", content: "Bạn nào biết ký túc xá còn phòng không? Mình chuẩn bị nhập học và cần thuê chỗ ở gấp.", likes: 7,  comments: 6, postedAt: "4 ngày trước",  status: "Bình thường", reported: false },
  { id: 7, author: "Đỗ Thanh Mai",   avatar: "Đ", avatarColor: "#f97316", content: "Học bổng khuyến khích học tập học kỳ này có nộp hồ sơ không hay tự động xét ạ?", likes: 19, comments: 8, postedAt: "5 ngày trước",  status: "Bình thường", reported: false },
  { id: 8, author: "Ẩn danh",        avatar: "?", avatarColor: "#94a3b8", content: "Bài viết có nội dung không phù hợp (đã bị báo cáo)...",                                                        likes: 1,  comments: 0, postedAt: "6 ngày trước",  status: "Bị báo cáo",  reported: true  },
  { id: 9, author: "Bùi Thị Oanh",   avatar: "B", avatarColor: "#ec4899", content: "Các bạn ơi lịch thi lại học phần Vật lý đã ra chưa ạ? Mình tìm mãi không thấy trên cổng thông tin.", likes: 9,  comments: 3, postedAt: "7 ngày trước",  status: "Bình thường", reported: false },
];

const STATUS_FILTERS = ["Tất cả", "Bình thường", "Bị báo cáo"];

export default function PostManagement() {
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("Tất cả");
  const [posts, setPosts]             = useState(mockPosts);
  const [expandedId, setExpandedId]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = posts.filter((p) => {
    const matchSearch = p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tất cả" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilter = (f) => { setFilter(f); setCurrentPage(1); };
  const handleSearch = (v) => { setSearch(v); setCurrentPage(1); };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá bài viết này không?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleResolveReport = (id) => {
    setPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: "Bình thường", reported: false } : p)
    );
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Bài viết Hỏi Đáp</h2>
          <p className="page-subtitle">Kiểm duyệt và quản lý các câu hỏi từ sinh viên</p>
        </div>
        <div className="post-quick-stats">
          <div className="quick-stat">
            <span className="qs-value">{posts.length}</span>
            <span className="qs-label">Tổng bài</span>
          </div>
          <div className="quick-stat reported">
            <span className="qs-value">{posts.filter((p) => p.reported).length}</span>
            <span className="qs-label">Báo cáo</span>
          </div>
        </div>
      </div>

      <div className="post-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm theo nội dung hoặc tác giả..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => handleFilter(f)}
            >
              {f}
              {f === "Bị báo cáo" && posts.filter((p) => p.reported).length > 0 && (
                <span className="report-badge">{posts.filter((p) => p.reported).length}</span>
              )}
            </button>
          ))}
        </div>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      <div className="post-list">
        {paginated.length === 0 && (
          <div className="empty-state">Không có bài viết nào phù hợp.</div>
        )}
        {paginated.map((post) => (
          <div key={post.id} className={`post-card ${post.reported ? "post-reported" : ""}`}>
            <div className="post-card-header">
              <div className="post-author-info">
                <div className="post-avatar" style={{ background: post.avatarColor }}>
                  {post.avatar}
                </div>
                <div>
                  <span className="post-author-name">{post.author}</span>
                  <span className="post-time">{post.postedAt}</span>
                </div>
              </div>
              <span className={`badge ${post.reported ? "badge-red" : "badge-green"}`}>
                {post.reported ? "⚠️ Bị báo cáo" : "✓ Bình thường"}
              </span>
            </div>

            <div className="post-content">
              {expandedId === post.id
                ? post.content
                : post.content.length > 120
                ? post.content.slice(0, 120) + "..."
                : post.content}
              {post.content.length > 120 && (
                <button className="expand-btn" onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}>
                  {expandedId === post.id ? " Thu gọn" : " Xem thêm"}
                </button>
              )}
            </div>

            <div className="post-stats">
              <span className="stat-item">🔥 {post.likes} thích</span>
              <span className="stat-item">💬 {post.comments} bình luận</span>
            </div>

            <div className="post-actions">
              {post.reported && (
                <button className="btn-resolve" onClick={() => handleResolveReport(post.id)}>
                  ✓ Duyệt bỏ báo cáo
                </button>
              )}
              <button className="btn-delete" onClick={() => handleDelete(post.id)}>
                🗑 Xoá bài
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
