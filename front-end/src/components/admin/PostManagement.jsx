import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/PostManagement.css";
import Pagination from "./Pagination";
import { approvePost, deletePost, getAllPosts, getPendingPosts, rejectPost } from "../../service/posts";

const PAGE_SIZE = 4;

const mockPosts = [];

const STATUS_FILTERS = ["Tất cả", "PENDING", "APPROVED", "REJECTED"];

function hashColor(input) {
  const str = String(input || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 45%)`;
}

function mapPostToUi(p) {
  const author = p?.userName || "Unknown";
  const reactionCounts = p?.reactionCounts || {};
  const totalReactions =
    Object.values(reactionCounts).reduce((acc, v) => acc + (Number(v) || 0), 0) || Number(p?.likeCount || 0);
  return {
    id: p?.id,
    author,
    avatar: author?.[0]?.toUpperCase?.() || "?",
    avatarColor: hashColor(author),
    title: p?.title || "",
    content: p?.content || "",
    likes: totalReactions,
    reactionCounts,
    comments: p?.commentCount ?? 0,
    postedAt: p?.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : "",
    status: p?.status || "UNKNOWN",
  };
}

function reactionSummary(reactionCounts) {
  const entries = Object.entries(reactionCounts || {}).filter(([, v]) => Number(v) > 0);
  if (entries.length === 0) return "";
  entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  return entries
    .slice(0, 3)
    .map(([type, count]) => `${type} ${count}`)
    .join(" · ");
}

export default function PostManagement() {
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("Tất cả");
  const [posts, setPosts]             = useState(mockPosts);
  const [expandedId, setExpandedId]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = filter === "PENDING" ? await getPendingPosts() : await getAllPosts();
        if (cancelled) return;
        setPosts((res || []).map(mapPostToUi));
      } catch (e) {
        alert(e?.message || "Không tải được danh sách bài viết.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    return (posts || []).filter((p) => {
      const matchSearch =
        (p.title || "").toLowerCase().includes(q) ||
        (p.content || "").toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q);
      const matchFilter = filter === "Tất cả" || p.status === filter;
      return matchSearch && matchFilter;
    });
  }, [posts, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilter = (f) => { setFilter(f); setCurrentPage(1); };
  const handleSearch = (v) => { setSearch(v); setCurrentPage(1); };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này không?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => (prev || []).filter((p) => p.id !== id));
    } catch (e) {
      alert(e?.message || "Xóa bài viết thất bại.");
    }
  };

  const handleApprove = async (id) => {
    try {
      const updated = await approvePost(id);
      setPosts((prev) => (prev || []).map((p) => (p.id === id ? mapPostToUi(updated) : p)));
    } catch (e) {
      alert(e?.message || "Duyệt bài thất bại.");
    }
  };

  const handleReject = async (id) => {
    try {
      const updated = await rejectPost(id);
      setPosts((prev) => (prev || []).map((p) => (p.id === id ? mapPostToUi(updated) : p)));
    } catch (e) {
      alert(e?.message || "Từ chối bài thất bại.");
    }
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
            <span className="qs-value">{posts.filter((p) => p.status === "PENDING").length}</span>
            <span className="qs-label">Chờ duyệt</span>
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
              {f === "PENDING" && posts.filter((p) => p.status === "PENDING").length > 0 && (
                <span className="report-badge">{posts.filter((p) => p.status === "PENDING").length}</span>
              )}
            </button>
          ))}
        </div>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      <div className="post-list">
        {loading && (
          <div className="empty-state">Đang tải...</div>
        )}
        {paginated.length === 0 && (
          <div className="empty-state">Không có bài viết nào phù hợp.</div>
        )}
        {paginated.map((post) => (
          <div key={post.id} className="post-card">
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
              <span className={`badge ${post.status === "PENDING" ? "badge-red" : "badge-green"}`}>
                {post.status}
              </span>
            </div>

            {post.title ? <div className="post-title">{post.title}</div> : null}
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
              <span className="stat-item" title={reactionSummary(post.reactionCounts)}>
                🔥 {post.likes} react
              </span>
              <span className="stat-item">💬 {post.comments} bình luận</span>
            </div>

            <div className="post-actions">
              {post.status === "PENDING" && (
                <>
                  <button className="btn-resolve" onClick={() => handleApprove(post.id)}>
                    ✓ Duyệt
                  </button>
                  <button className="btn-resolve" onClick={() => handleReject(post.id)}>
                    ✕ Từ chối
                  </button>
                </>
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
