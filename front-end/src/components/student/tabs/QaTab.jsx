import React, { useEffect, useMemo, useState } from "react";
import { getMe } from "../../../service/me";
import { getAllCategories } from "../../../service/categories";
import {
  createPost as createPostApi,
  deletePost as deletePostApi,
  getAllPosts as getAllPostsApi,
  updatePost as updatePostApi,
} from "../../../service/posts";
import { createComment as createCommentApi, getCommentsByPostId as getCommentsByPostIdApi } from "../../../service/comments";
import { createReaction as createReactionApi, deleteReaction as deleteReactionApi } from "../../../service/reactions";

export default function QaTab({ toast, fallbackUserName }) {
  const [me, setMe] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");

  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostText, setEditPostText] = useState("");

  const [commentInputs, setCommentInputs] = useState({});
  const [visibleCommentsCount, setVisibleCommentsCount] = useState({});
  const [openReplyBoxes, setOpenReplyBoxes] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  const currentUser = me?.fullName || fallbackUserName || "User";

  const filteredPosts = useMemo(() => {
    const id = Number(filterCategoryId);
    if (!id) return posts || [];
    return (posts || []).filter((p) => Array.isArray(p.categories) && p.categories.some((c) => Number(c.id) === id));
  }, [posts, filterCategoryId]);

  useEffect(() => {
    let cancelled = false;
    async function loadQa() {
      try {
        setQaLoading(true);

        const categoryRes = await getAllCategories();
        if (!cancelled) setCategories(categoryRes || []);

        const meRes = await getMe();
        if (cancelled) return;
        setMe(meRes);

        const postResponses = await getAllPostsApi();
        if (cancelled) return;

        const uiPosts = await Promise.all(
          (postResponses || []).map(async (p) => {
            const commentsRes = await getCommentsByPostIdApi(p.id);
            return {
              id: p.id,
              author: p.userName || "Unknown",
              time: p.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : "",
              title: p.title || "",
              text: p.content || "",
              categories: p.categories || [],
              likes: Number(p.likeCount ?? 0),
              isLiked: Boolean(p.likedByMe),
              comments: (commentsRes || []).map((c) => ({
                id: c.id,
                author: c.userName || "Unknown",
                time: c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : "",
                text: c.content || "",
                likes: 0,
                isLiked: false,
                replies: [],
              })),
            };
          })
        );

        if (cancelled) return;
        setPosts(uiPosts);
      } catch (e) {
        toast?.show?.({
          type: "error",
          title: "Không tải được bài viết",
          message: e?.message || "Vui lòng thử lại.",
        });
      } finally {
        if (!cancelled) setQaLoading(false);
      }
    }

    loadQa();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleStartEdit = (post) => {
    setEditingPostId(post.id);
    setEditPostText(post.text);
  };

  const openCreate = () => {
    setCreateTitle("");
    setCreateContent("");
    setSelectedCategoryIds([]);
    setIsCreateOpen(true);
  };

  const handleCreatePost = async () => {
    const title = (createTitle || "").trim();
    const content = (createContent || "").trim();
    if (!title || !content) {
      toast?.show?.({ type: "warning", title: "Thiếu thông tin", message: "Vui lòng nhập tiêu đề và nội dung." });
      return;
    }
    if (!me?.id) {
      toast?.show?.({ type: "warning", title: "Chưa xác định người dùng", message: "Vui lòng đăng nhập lại." });
      return;
    }

    try {
      const created = await createPostApi({ title, content, userId: me.id, categoryIds: selectedCategoryIds });
      const uiPost = {
        id: created?.id,
        author: created?.userName || currentUser,
        time: created?.createdAt ? new Date(created.createdAt).toLocaleString("vi-VN") : "Vừa xong",
        title: created?.title || title,
        text: created?.content || content,
        categories: created?.categories || [],
        likes: Number(created?.likeCount ?? 0),
        isLiked: Boolean(created?.likedByMe),
        comments: [],
      };
      setPosts((prev) => [uiPost, ...(prev || [])]);
      setSelectedCategoryIds([]);
      setIsCreateOpen(false);
    } catch (e) {
      toast?.show?.({ type: "error", title: "Đăng bài thất bại", message: e?.message || "Vui lòng thử lại." });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      await deletePostApi(postId);
      setPosts((prev) => (prev || []).filter((p) => p.id !== postId));
    } catch (e) {
      toast?.show?.({ type: "error", title: "Xóa bài thất bại", message: e?.message || "Vui lòng thử lại." });
    }
  };

  const handleSaveEdit = async (postId) => {
    const content = (editPostText || "").trim();
    if (!content) return;
    try {
      const title = content.length > 80 ? content.slice(0, 80) + "..." : content;
      const updated = await updatePostApi(postId, { title, content });
      setPosts((prev) =>
        (prev || []).map((p) =>
          p.id === postId ? { ...p, title: updated?.title ?? title, text: updated?.content ?? content } : p
        )
      );
      setEditingPostId(null);
    } catch (e) {
      toast?.show?.({ type: "error", title: "Cập nhật thất bại", message: e?.message || "Vui lòng thử lại." });
    }
  };

  const handleLikePost = async (postId) => {
    if (!me?.id) return;
    const post = (posts || []).find((p) => p.id === postId);
    if (!post) return;

    const nextLiked = !post.isLiked;
    setPosts((prev) =>
      (prev || []).map((p) =>
        p.id === postId
          ? { ...p, isLiked: nextLiked, likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1) }
          : p
      )
    );

    try {
      if (nextLiked) {
        await createReactionApi({ userId: me.id, postId, reactionType: "LIKE" });
      } else {
        await deleteReactionApi({ userId: me.id, postId });
      }
    } catch (e) {
      setPosts((prev) =>
        (prev || []).map((p) =>
          p.id === postId
            ? { ...p, isLiked: !nextLiked, likes: !nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1) }
            : p
        )
      );
      toast?.show?.({ type: "error", title: "Thao tác thất bại", message: e?.message || "Vui lòng thử lại." });
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = (commentInputs?.[postId] || "").trim();
    if (!commentText) return;
    if (!me?.id) return;

    try {
      const created = await createCommentApi({ content: commentText, postId, userId: me.id });
      const newComment = {
        id: created?.id,
        author: created?.userName || currentUser,
        time: created?.createdAt ? new Date(created.createdAt).toLocaleString("vi-VN") : "Vừa xong",
        text: created?.content || commentText,
        likes: 0,
        isLiked: false,
        replies: [],
      };
      setPosts((prev) =>
        (prev || []).map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p))
      );
      setCommentInputs((prev) => ({ ...(prev || {}), [postId]: "" }));
    } catch (e) {
      toast?.show?.({ type: "error", title: "Bình luận thất bại", message: e?.message || "Vui lòng thử lại." });
    }
  };

  const handleAddReply = (postId, commentId) => {
    const replyText = replyInputs[commentId];
    if (!replyText || !replyText.trim()) return;
    const newReply = { id: Date.now(), author: currentUser, time: "Vừa xong", text: replyText, likes: 0, isLiked: false };
    setPosts((prev) =>
      (prev || []).map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: (post.comments || []).map((cmt) =>
            cmt.id === commentId ? { ...cmt, replies: [...(cmt.replies || []), newReply] } : cmt
          ),
        };
      })
    );
    setReplyInputs((prev) => ({ ...(prev || {}), [commentId]: "" }));
    setOpenReplyBoxes((prev) => ({ ...(prev || {}), [commentId]: false }));
  };

  const toggleReplyBox = (cmtId) => setOpenReplyBoxes((prev) => ({ ...(prev || {}), [cmtId]: !prev?.[cmtId] }));
  const handleLoadMoreComments = (postId) =>
    setVisibleCommentsCount((prev) => ({ ...(prev || {}), [postId]: (prev?.[postId] || 2) + 2 }));
  const handleCollapseComments = (postId) => setVisibleCommentsCount((prev) => ({ ...(prev || {}), [postId]: 2 }));

  return (
    <div className="fb-forum-container">
      {qaLoading && <div style={{ padding: 12 }}>Đang tải bài viết...</div>}

      <div className="fb-forum-topbar">
        <div className="fb-field">
          <label className="fb-label">Lọc theo danh mục</label>
          <select className="fb-select" value={filterCategoryId} onChange={(e) => setFilterCategoryId(e.target.value)}>
            <option value="">Tất cả</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button className="fb-post-btn" type="button" onClick={openCreate}>
          + Đăng bài
        </button>
      </div>

      {isCreateOpen && (
        <div className="fb-modal-overlay" onClick={() => setIsCreateOpen(false)} role="presentation">
          <div className="fb-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="fb-modal-header">
              <div>
                <div className="fb-modal-title">Tạo bài viết</div>
                <div className="fb-modal-subtitle">Chọn danh mục, nhập tiêu đề và nội dung chi tiết</div>
              </div>
              <button className="fb-modal-close" type="button" onClick={() => setIsCreateOpen(false)} aria-label="Đóng">
                ×
              </button>
            </div>

            <div className="fb-modal-body">
              <div className="fb-field" style={{ minWidth: "unset" }}>
                <label className="fb-label">Danh mục</label>
                <select
                  className="fb-select"
                  value=""
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    if (!id) return;
                    setSelectedCategoryIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
                  }}
                >
                  <option value="">Chọn danh mục…</option>
                  {(categories || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategoryIds.length > 0 && (
                <div className="fb-chips" aria-label="Danh mục đã chọn">
                  {selectedCategoryIds.map((id) => {
                    const cat = (categories || []).find((c) => c.id === id);
                    const label = cat?.name || `#${id}`;
                    return (
                      <button
                        key={id}
                        type="button"
                        className="fb-chip"
                        onClick={() => setSelectedCategoryIds((prev) => prev.filter((x) => x !== id))}
                        title="Bỏ chọn"
                      >
                        <span className="fb-chip-text">{label}</span>
                        <span className="fb-chip-x">×</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="fb-field" style={{ minWidth: "unset" }}>
                <label className="fb-label">Tiêu đề</label>
                <input
                  className="fb-input"
                  type="text"
                  placeholder="Nhập tiêu đề ngắn gọn…"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                />
              </div>

              <div className="fb-field" style={{ minWidth: "unset" }}>
                <label className="fb-label">Nội dung</label>
                <textarea
                  className="fb-textarea"
                  rows={6}
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải…"
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                />
              </div>
            </div>

            <div className="fb-modal-actions">
              <button className="fb-btn-secondary" type="button" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </button>
              <button className="fb-btn-primary" type="button" onClick={handleCreatePost}>
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fb-post-list">
        {(filteredPosts || []).map((post) => {
          const sortedComments = [...(post.comments || [])].sort((a, b) => b.likes - a.likes);
          const visibleCount = visibleCommentsCount[post.id] || 2;
          const displayedComments = sortedComments.slice(0, visibleCount);
          const remainingComments = sortedComments.length - visibleCount;
          const totalCommentsCount =
            (post.comments || []).length +
            (post.comments || []).reduce((acc, cmt) => acc + ((cmt.replies || []).length || 0), 0);

          return (
            <div key={post.id} className="fb-post-card">
              <div className="fb-post-header">
                <div className="fb-post-author-info">
                  <div className="avatar-small alt">{post.author?.charAt?.(0) || "?"}</div>
                  <div>
                    <strong>{post.author}</strong>
                    <span className="fb-post-time">{post.time} • 🌎</span>
                  </div>
                </div>
                {post.author === currentUser && (
                  <div className="fb-post-actions-menu">
                    <button onClick={() => handleStartEdit(post)}>Sửa</button>
                    <button onClick={() => handleDeletePost(post.id)}>Xóa</button>
                  </div>
                )}
              </div>

              {editingPostId === post.id ? (
                <div className="fb-post-edit-box">
                  <textarea value={editPostText} onChange={(e) => setEditPostText(e.target.value)} />
                  <div>
                    <button className="save-btn" onClick={() => handleSaveEdit(post.id)}>
                      Lưu
                    </button>
                    <button className="cancel-btn" onClick={() => setEditingPostId(null)}>
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {Array.isArray(post.categories) && post.categories.length > 0 && (
                    <div className="fb-post-categories">
                      {post.categories.map((c) => (
                        <span
                          key={c.id || c.slug || c.name}
                          className="fb-post-category"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="fb-post-content">{post.text}</div>
                </>
              )}

              <div className="fb-post-stats">
                <span className="stats-likes">👍 {post.likes}</span>
                <span className="stats-comments">{totalCommentsCount} bình luận</span>
              </div>

              <div className="fb-post-action-bar">
                <button className={`fb-action-btn ${post.isLiked ? "liked" : ""}`} onClick={() => handleLikePost(post.id)}>
                  👍 Thích
                </button>
                <button className="fb-action-btn" onClick={() => document.getElementById(`comment-input-${post.id}`)?.focus?.()}>
                  💬 Bình luận
                </button>
              </div>

              <div className="fb-post-comments">
                {displayedComments.map((cmt) => (
                  <div key={cmt.id} className="fb-comment-thread">
                    <div className="fb-comment-row">
                      <div className="avatar-small alt2">{cmt.author?.charAt?.(0) || "?"}</div>
                      <div className="fb-comment-body">
                        <div className="fb-comment-bubble">
                          <strong>{cmt.author}</strong>
                          <span>{cmt.text}</span>
                          {cmt.likes > 0 && <div className="fb-comment-like-count">👍 {cmt.likes}</div>}
                        </div>
                        <div className="fb-comment-actions">
                          <button onClick={() => toggleReplyBox(cmt.id)}>Phản hồi</button>
                        </div>

                        {(cmt.replies || []).length > 0 && (
                          <div className="fb-replies-list">
                            {(cmt.replies || []).map((reply) => (
                              <div key={reply.id} className="fb-comment-row">
                                <div className="avatar-small alt3">{reply.author?.charAt?.(0) || "?"}</div>
                                <div className="fb-comment-body">
                                  <div className="fb-comment-bubble reply-bubble">
                                    <strong>{reply.author}</strong>
                                    <span>{reply.text}</span>
                                    {reply.likes > 0 && <div className="fb-comment-like-count">👍 {reply.likes}</div>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {openReplyBoxes[cmt.id] && (
                          <div className="fb-reply-input-row">
                            <input
                              type="text"
                              placeholder="Viết phản hồi..."
                              value={replyInputs[cmt.id] || ""}
                              onChange={(e) => setReplyInputs((prev) => ({ ...(prev || {}), [cmt.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                handleAddReply(post.id, cmt.id);
                                toggleReplyBox(cmt.id);
                              }}
                            />
                            <button
                              className="send-icon-btn"
                              onClick={() => {
                                handleAddReply(post.id, cmt.id);
                                toggleReplyBox(cmt.id);
                              }}
                            >
                              ➢
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {remainingComments > 0 ? (
                  <button className="fb-see-more-btn" onClick={() => handleLoadMoreComments(post.id)}>
                    Xem thêm {remainingComments} bình luận...
                  </button>
                ) : sortedComments.length > 2 ? (
                  <button className="fb-see-more-btn" onClick={() => handleCollapseComments(post.id)}>
                    Thu gọn bình luận
                  </button>
                ) : null}

                <div className="fb-comment-input-row">
                  <input
                    id={`comment-input-${post.id}`}
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs((prev) => ({ ...(prev || {}), [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                  />
                  <button className="send-icon-btn" onClick={() => handleAddComment(post.id)}>
                    ➢
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
