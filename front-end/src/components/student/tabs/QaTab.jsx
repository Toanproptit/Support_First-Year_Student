import React, { useEffect, useMemo, useRef, useState } from "react";
import { getMe } from "../../../service/me";
import { getAllCategories } from "../../../service/categories";
import {
  createPost as createPostApi,
  deletePost as deletePostApi,
  getAllPosts as getAllPostsApi,
  getPostsByUserId as getPostsByUserIdApi,
  updatePost as updatePostApi,
} from "../../../service/posts";
import { createComment as createCommentApi, createReply as createReplyApi, getCommentsTreeByPostId as getCommentsTreeByPostIdApi } from "../../../service/comments";
import { createReaction as createReactionApi, deleteReaction as deleteReactionApi } from "../../../service/reactions";

const mapTreeCommentToUi = (c) => ({
  id: c?.id,
  author: c?.userName || "Unknown",
  time: c?.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : "",
  text: c?.content || "",
  likes: 0,
  isLiked: false,
  replies: Array.isArray(c?.replies) ? c.replies.map(mapTreeCommentToUi) : [],
});

const addReplyToTree = (nodes, targetId, replyNode) => {
  if (!Array.isArray(nodes) || nodes.length === 0) return nodes || [];
  return nodes.map((n) => {
    if (n?.id === targetId) {
      return { ...n, replies: [...(n.replies || []), replyNode] };
    }
    if (Array.isArray(n?.replies) && n.replies.length > 0) {
      return { ...n, replies: addReplyToTree(n.replies, targetId, replyNode) };
    }
    return n;
  });
};

const countCommentsInTree = (nodes) => {
  if (!Array.isArray(nodes) || nodes.length === 0) return 0;
  return nodes.reduce((acc, n) => acc + 1 + countCommentsInTree(n?.replies), 0);
};

const REACTIONS = [
  { type: "LIKE", label: "Like" },
  { type: "LOVE", label: "Love" },
  { type: "HAHA", label: "Haha" },
  { type: "WOW", label: "Wow" },
  { type: "SAD", label: "Sad" },
  { type: "ANGRY", label: "Angry" },
];

const sumReactionCounts = (counts) =>
  Object.values(counts || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);

const buildReactionSummary = (counts) => {
  const entries = Object.entries(counts || {}).filter(([, v]) => Number(v) > 0);
  if (entries.length === 0) return "";
  const byCountDesc = entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  return byCountDesc
    .slice(0, 3)
    .map(([type, count]) => {
      const label = REACTIONS.find((r) => r.type === type)?.label || type;
      return `${label} ${count}`;
    })
    .join(" · ");
};

export default function QaTab({ toast, fallbackUserName }) {
  const [me, setMe] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [postScope, setPostScope] = useState("all"); // all | mine
  const [myStatusFilter, setMyStatusFilter] = useState("ALL"); // ALL | PENDING | APPROVED | REJECTED

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
  const [collapsedReplies, setCollapsedReplies] = useState({});
  const [openReactionPickerForPostId, setOpenReactionPickerForPostId] = useState(null);
  const reactionPickerCloseTimerRef = useRef(null);

  const currentUser = me?.fullName || fallbackUserName || "User";

  const filteredPosts = useMemo(() => {
    let result = posts || [];

    if (postScope === "mine" && myStatusFilter !== "ALL") {
      result = result.filter((p) => String(p.status || "").toUpperCase() === myStatusFilter);
    }

    const id = Number(filterCategoryId);
    if (!id) return result;
    return result.filter((p) => Array.isArray(p.categories) && p.categories.some((c) => Number(c.id) === id));
  }, [posts, filterCategoryId, postScope, myStatusFilter]);

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

        // const postResponses = await getAllPostsApi();
        // if (cancelled) return;

        // Posts are loaded in a separate effect so "Bai cua toi" can use a different source.
      } catch (e) {
        toast?.show?.({
          type: "error",
          title: "Khong tai duoc bai viet",
          message: e?.message || "Vui long thu lai.",
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

  useEffect(() => {
    if (!me?.id) return;

    let cancelled = false;
    async function loadPosts() {
      try {
        setQaLoading(true);

        const postResponses = postScope === "mine" ? await getPostsByUserIdApi(me.id) : await getAllPostsApi();
        if (cancelled) return;

        const uiPosts = await Promise.all(
          (postResponses || []).map(async (p) => {
            const commentsTreeRes = await getCommentsTreeByPostIdApi(p.id);
            return {
              id: p.id,
              userId: p.userId,
              status: p.status,
              author: p.userName || "Unknown",
              time: p.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : "",
              title: p.title || "",
              text: p.content || "",
              categories: p.categories || [],
              reactionCounts: p?.reactionCounts || {},
              myReactionType: p?.myReactionType || null,
              likes: sumReactionCounts(p?.reactionCounts) || Number(p.likeCount ?? 0),
              isLiked: Boolean(p?.myReactionType) || Boolean(p.likedByMe),
              comments: (commentsTreeRes || []).map(mapTreeCommentToUi),
            };
          })
        );

        if (cancelled) return;
        setPosts(uiPosts);
      } catch (e) {
        toast?.show?.({
          type: "error",
          title: "Khong tai duoc bai viet",
          message: e?.message || "Vui long thu lai",
        });
      } finally {
        if (!cancelled) setQaLoading(false);
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [toast, me?.id, postScope]);

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
        userId: created?.userId ?? me.id,
        status: created?.status,
        author: created?.userName || currentUser,
        time: created?.createdAt ? new Date(created.createdAt).toLocaleString("vi-VN") : "Vừa xong",
        title: created?.title || title,
        text: created?.content || content,
        categories: created?.categories || [],
        reactionCounts: created?.reactionCounts || {},
        myReactionType: created?.myReactionType || null,
        likes: sumReactionCounts(created?.reactionCounts) || Number(created?.likeCount ?? 0),
        isLiked: Boolean(created?.myReactionType) || Boolean(created?.likedByMe),
        comments: [],
      };
      toast?.show?.({
        type: "success",
        title: "Đã gửi bài",
        message:
          String(uiPost.status || "").toUpperCase() === "APPROVED"
            ? "Bài viết đã đăng thành công."
            : "Bài viết đang chờ duyệt. Bạn có thể xem trong \"Bài của tôi\".",
      });

      if (String(uiPost.status || "").toUpperCase() !== "APPROVED") {
        setPostScope("mine");
        setMyStatusFilter("ALL");
      }

      if (postScope === "mine" || String(uiPost.status || "").toUpperCase() === "APPROVED") {
        setPosts((prev) => [uiPost, ...(prev || [])]);
      }
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

  const handleReactPost = async (postId, reactionType) => {
    if (!me?.id) return;
    const post = (posts || []).find((p) => p.id === postId);
    if (!post) return;

    const prevType = post.myReactionType || null;
    const isRemoving = prevType && prevType === reactionType;
    const nextType = isRemoving ? null : reactionType;

    setPosts((prev) =>
      (prev || []).map((p) => {
        if (p.id !== postId) return p;
        const nextCounts = { ...(p.reactionCounts || {}) };
        if (prevType) nextCounts[prevType] = Math.max(0, Number(nextCounts[prevType] || 0) - 1);
        if (nextType) nextCounts[nextType] = Number(nextCounts[nextType] || 0) + 1;
        return {
          ...p,
          reactionCounts: nextCounts,
          myReactionType: nextType,
          isLiked: Boolean(nextType),
          likes: sumReactionCounts(nextCounts),
        };
      })
    );
    setOpenReactionPickerForPostId((prev) => (prev === postId ? null : prev));

    try {
      if (isRemoving) {
        await deleteReactionApi({ userId: me.id, postId });
      } else {
        await createReactionApi({ userId: me.id, postId, reactionType });
      }
    } catch (e) {
      setPosts((prev) =>
        (prev || []).map((p) => {
          if (p.id !== postId) return p;
          const rollbackCounts = { ...(p.reactionCounts || {}) };
          if (nextType) rollbackCounts[nextType] = Math.max(0, Number(rollbackCounts[nextType] || 0) - 1);
          if (prevType) rollbackCounts[prevType] = Number(rollbackCounts[prevType] || 0) + 1;
          return {
            ...p,
            reactionCounts: rollbackCounts,
            myReactionType: prevType,
            isLiked: Boolean(prevType),
            likes: sumReactionCounts(rollbackCounts),
          };
        })
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

  const handleAddReply = async (postId, commentId) => {
    const replyText = (replyInputs?.[commentId] || "").trim();
    if (!replyText) return;
    if (!me?.id) return;
    try {
      const created = await createReplyApi({ content: replyText, postId, userId: me.id, parentId: commentId });
      const newReply = {
        id: created?.id,
        author: created?.userName || currentUser,
        time: created?.createdAt ? new Date(created.createdAt).toLocaleString("vi-VN") : "Vừa xong",
        text: created?.content || replyText,
        likes: 0,
        isLiked: false,
        replies: [],
      };

      setPosts((prev) =>
        (prev || []).map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: addReplyToTree(post.comments || [], commentId, newReply),
          };
        })
      );

      setReplyInputs((prev) => ({ ...(prev || {}), [commentId]: "" }));
      setOpenReplyBoxes((prev) => ({ ...(prev || {}), [commentId]: false }));
    } catch (e) {
      toast?.show?.({ type: "error", title: "Phản hồi thất bại", message: e?.message || "Vui lòng thử lại." });
    }
  };

  const toggleReplyBox = (cmtId) => setOpenReplyBoxes((prev) => ({ ...(prev || {}), [cmtId]: !prev?.[cmtId] }));
  const toggleReplies = (cmtId) =>
    setCollapsedReplies((prev) => {
      const current = prev?.[cmtId];
      const next = current === undefined ? false : !current;
      return { ...(prev || {}), [cmtId]: next };
    });
  const handleLoadMoreComments = (postId) =>
    setVisibleCommentsCount((prev) => ({ ...(prev || {}), [postId]: (prev?.[postId] || 2) + 2 }));
  const handleCollapseComments = (postId) => setVisibleCommentsCount((prev) => ({ ...(prev || {}), [postId]: 2 }));

  const openReactionPicker = (postId) => {
    if (reactionPickerCloseTimerRef.current) {
      clearTimeout(reactionPickerCloseTimerRef.current);
      reactionPickerCloseTimerRef.current = null;
    }
    setOpenReactionPickerForPostId(postId);
  };

  const scheduleCloseReactionPicker = (postId) => {
    if (reactionPickerCloseTimerRef.current) {
      clearTimeout(reactionPickerCloseTimerRef.current);
    }
    reactionPickerCloseTimerRef.current = setTimeout(() => {
      setOpenReactionPickerForPostId((prev) => (prev === postId ? null : prev));
      reactionPickerCloseTimerRef.current = null;
    }, 250);
  };

  const CommentNode = ({ node, postId, depth = 0 }) => {
    if (!node?.id) return null;
    const isReply = depth > 0;
    const bubbleClass = isReply ? "fb-comment-bubble reply-bubble" : "fb-comment-bubble";
    const isCollapsed = collapsedReplies?.[node.id] ?? true;
    const repliesCount = Array.isArray(node.replies) ? node.replies.length : 0;

    return (
      <div className="fb-comment-thread" style={depth ? { marginLeft: Math.min(depth * 18, 72) } : undefined}>
        <div className="fb-comment-row">
          <div className={`avatar-small ${isReply ? "alt3" : "alt2"}`}>{node.author?.charAt?.(0) || "?"}</div>
          <div className="fb-comment-body">
            <div className={bubbleClass}>
              <strong>{node.author}</strong>
              <span>{node.text}</span>
              {node.likes > 0 && <div className="fb-comment-like-count">Like {node.likes}</div>}
            </div>
            <div className="fb-comment-actions">
              <button onClick={() => toggleReplyBox(node.id)}>Phản hồi</button>
              {repliesCount > 0 && (
                <button onClick={() => toggleReplies(node.id)}>
                  {isCollapsed ? `Xem ${repliesCount} phản hồi` : "Thu gọn"}
                </button>
              )}
            </div>

            {!isCollapsed && Array.isArray(node.replies) && node.replies.length > 0 && (
              <div className="fb-replies-list">
                {node.replies.map((child) => (
                  <CommentNode key={child.id} node={child} postId={postId} depth={depth + 1} />
                ))}
              </div>
            )}

            {openReplyBoxes[node.id] && (
              <div className="fb-reply-input-row">
                <input
                  type="text"
                  placeholder="Viết phản hồi..."
                  value={replyInputs[node.id] || ""}
                  onChange={(e) => setReplyInputs((prev) => ({ ...(prev || {}), [node.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    handleAddReply(postId, node.id);
                  }}
                />
                <button className="send-icon-btn" onClick={() => handleAddReply(postId, node.id)}>
                  Gửi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fb-forum-container">
      {qaLoading && <div style={{ padding: 12 }}>{"Đang tải bài viết..."}</div>}

      <div className="fb-forum-topbar">
        <div className="fb-topbar-left">
          <div className="fb-field">
            <label className="fb-label">{"Hiển thị"}</label>
            <select
              className="fb-select"
              value={postScope}
              onChange={(e) => {
                const next = e.target.value;
                setPostScope(next);
                if (next !== "mine") setMyStatusFilter("ALL");
              }}
            >
              <option value="all">{"Tất cả bài đã duyệt"}</option>
              <option value="mine">{"Bài của tôi"}</option>
            </select>
          </div>

          {postScope === "mine" && (
            <div className="fb-field">
              <label className="fb-label">{"Trạng thái"}</label>
              <select className="fb-select" value={myStatusFilter} onChange={(e) => setMyStatusFilter(e.target.value)}>
                <option value="ALL">{"Tất cả"}</option>
                <option value="PENDING">{"Chờ duyệt"}</option>
                <option value="APPROVED">{"Đã duyệt"}</option>
                <option value="REJECTED">{"Từ chối"}</option>
              </select>
            </div>
          )}

          <div className="fb-field">
          <label className="fb-label">{"Lọc theo danh mục"}</label>
          <select className="fb-select" value={filterCategoryId} onChange={(e) => setFilterCategoryId(e.target.value)}>
            <option value="">{"Tất cả"}</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        </div>

        <button className="fb-post-btn" type="button" onClick={openCreate}>
          {"+ Đăng bài"}
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
                x
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
                  <option value="">Chọn danh mục...</option>
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
                        <span className="fb-chip-x">x</span>
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
                  placeholder="Nhập tiêu đề ngắn gọn..."
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                />
              </div>

              <div className="fb-field" style={{ minWidth: "unset" }}>
                <label className="fb-label">Nội dung</label>
                <textarea
                  className="fb-textarea"
                  rows={6}
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
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
          const totalCommentsCount = countCommentsInTree(post.comments || []);

          return (
            <div key={post.id} className="fb-post-card">
              <div className="fb-post-header">
                <div className="fb-post-author-info">
                  <div className="avatar-small alt">{post.author?.charAt?.(0) || "?"}</div>
                  <div>
                    <strong>{post.author}</strong>
                    <span className="fb-post-time">{post.time}</span>
                  </div>
                </div>
                {postScope === "mine" && post.status ? (
                  <span className={`fb-post-status status-${String(post.status || "").toLowerCase()}`}>
                    {String(post.status).toUpperCase() === "APPROVED"
                      ? "Đã duyệt"
                      : String(post.status).toUpperCase() === "REJECTED"
                        ? "Từ chối"
                        : "Chờ duyệt"}
                  </span>
                ) : null}
                {post.userId && me?.id && Number(post.userId) === Number(me.id) && (
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
                <span className="stats-likes">
                  {sumReactionCounts(post?.reactionCounts) > 0 ? buildReactionSummary(post?.reactionCounts) : `Like ${post.likes}`}
                </span>
                <span className="stats-comments">{totalCommentsCount} bình luận</span>
              </div>

              <div className="fb-post-action-bar">
                <div
                  className="fb-reaction-wrap"
                  onMouseEnter={() => openReactionPicker(post.id)}
                  onMouseLeave={() => scheduleCloseReactionPicker(post.id)}
                >
                  <button
                    className={`fb-action-btn ${post?.myReactionType ? "liked" : ""}`}
                    type="button"
                    onClick={() => handleReactPost(post.id, post?.myReactionType || "LIKE")}
                  >
                    {post?.myReactionType
                      ? (REACTIONS.find((r) => r.type === post.myReactionType)?.label || post.myReactionType)
                      : "React"}
                  </button>

                  {openReactionPickerForPostId === post.id && (
                    <div
                      className="fb-reaction-picker"
                      role="menu"
                      onMouseEnter={() => openReactionPicker(post.id)}
                      onMouseLeave={() => scheduleCloseReactionPicker(post.id)}
                    >
                      {REACTIONS.map((r) => (
                        <button
                          key={r.type}
                          type="button"
                          className={`fb-reaction-item ${post?.myReactionType === r.type ? "active" : ""}`}
                          onClick={() => handleReactPost(post.id, r.type)}
                          title={r.type}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="fb-action-btn" onClick={() => document.getElementById(`comment-input-${post.id}`)?.focus?.()}>
                  Bình luận
                </button>
              </div>

              <div className="fb-post-comments">
                {displayedComments.map((cmt) => (
                  <CommentNode key={cmt.id} node={cmt} postId={post.id} depth={0} />
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
                    Gửi
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
