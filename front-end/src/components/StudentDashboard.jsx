import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import logoPtit from "../assets/logoptit.jpg";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("home");

    const currentUser = "Vũ Duy Thái";

    // Dữ liệu giả lập mang phong cách Facebook
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Nguyễn Văn A",
            time: "2 giờ trước",
            text: "Mọi người cho mình hỏi lịch đăng ký tín chỉ học kỳ 2 xem ở đâu vậy ạ? Mình tìm trên web trường không thấy 😢",
            likes: 15,
            isLiked: false, // User hiện tại đã like bài này chưa
            comments: [
                {
                    id: 101, author: "Trần Thị B", time: "1 giờ trước",
                    text: "Bạn vào trang tín chỉ ptit xem thông báo nhé!",
                    likes: 12, isLiked: false,
                    replies: [
                        { id: 1011, author: "Lê Văn C", time: "45 phút trước", text: "Trang đó dạo này hay sập lắm =))", likes: 5, isLiked: true }
                    ]
                },
                {
                    id: 102, author: "Phạm Thị D", time: "30 phút trước",
                    text: "Thường là đầu tháng 12 nha bạn.",
                    likes: 3, isLiked: false, replies: []
                }
            ]
        }
    ]);

    const [newPostText, setNewPostText] = useState("");
    const [editingPostId, setEditingPostId] = useState(null);
    const [editPostText, setEditPostText] = useState("");

    const [commentInputs, setCommentInputs] = useState({});
    const [visibleCommentsCount, setVisibleCommentsCount] = useState({});
    const [openReplyBoxes, setOpenReplyBoxes] = useState({});
    const [replyInputs, setReplyInputs] = useState({});

    const handleLogout = () => navigate("/");

    // --- CÁC HÀM XỬ LÝ BÀI VIẾT ---
    const handleCreatePost = () => {
        if (!newPostText.trim()) return;
        const newPost = { id: Date.now(), author: currentUser, time: "Vừa xong", text: newPostText, likes: 0, isLiked: false, comments: [] };
        setPosts([newPost, ...posts]);
        setNewPostText("");
    };

    const handleDeletePost = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const handleStartEdit = (post) => {
        setEditingPostId(post.id);
        setEditPostText(post.text);
    };

    const handleSaveEdit = (id) => {
        if (!editPostText.trim()) return;
        setPosts(posts.map(post => post.id === id ? { ...post, text: editPostText } : post));
        setEditingPostId(null);
    };

    // --- LOGIC THÍCH (LIKE) BÀI VIẾT & BÌNH LUẬN ---
    const handleLikePost = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 };
            }
            return post;
        }));
    };

    const handleLikeComment = (postId, commentId, isReply = false, replyId = null) => {
        setPosts(posts.map(post => {
            if (post.id !== postId) return post;
            return {
                ...post,
                comments: post.comments.map(cmt => {
                    if (!isReply && cmt.id === commentId) {
                        return { ...cmt, isLiked: !cmt.isLiked, likes: cmt.isLiked ? cmt.likes - 1 : cmt.likes + 1 };
                    } else if (isReply && cmt.id === commentId) {
                        return {
                            ...cmt,
                            replies: cmt.replies.map(rep =>
                                rep.id === replyId ? { ...rep, isLiked: !rep.isLiked, likes: rep.isLiked ? rep.likes - 1 : rep.likes + 1 } : rep
                            )
                        };
                    }
                    return cmt;
                })
            };
        }));
    };

    // --- BÌNH LUẬN & PHẢN HỒI ---
    const handleAddComment = (postId) => {
        const commentText = commentInputs[postId];
        if (!commentText || !commentText.trim()) return;
        const newComment = { id: Date.now(), author: currentUser, time: "Vừa xong", text: commentText, likes: 0, isLiked: false, replies: [] };
        setPosts(posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post));
        setCommentInputs({ ...commentInputs, [postId]: "" });
    };

    const handleAddReply = (postId, commentId) => {
        const replyText = replyInputs[commentId];
        if (!replyText || !replyText.trim()) return;
        const newReply = { id: Date.now(), author: currentUser, time: "Vừa xong", text: replyText, likes: 0, isLiked: false };
        setPosts(posts.map(post => {
            if (post.id !== postId) return post;
            return { ...post, comments: post.comments.map(cmt => cmt.id === commentId ? { ...cmt, replies: [...(cmt.replies || []), newReply] } : cmt) };
        }));
        setReplyInputs({ ...replyInputs, [commentId]: "" });
        setOpenReplyBoxes(prev => ({ ...prev, [commentId]: false }));
    };

    const toggleReplyBox = (cmtId) => setOpenReplyBoxes(prev => ({ ...prev, [cmtId]: !prev[cmtId] }));
    const handleLoadMoreComments = (postId) => setVisibleCommentsCount(prev => ({ ...prev, [postId]: (prev[postId] || 2) + 2 }));
    const handleCollapseComments = (postId) => setVisibleCommentsCount(prev => ({ ...prev, [postId]: 2 }));

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon"><img src={logoPtit} alt="PTIT Logo" className="sidebar-logo-img" /></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="#" className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}><span className="nav-icon">🏠</span> Bảng điều khiển</Link>
                    <Link to="#" className={`nav-item ${activeTab === "qa" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActiveTab("qa"); }}><span className="nav-icon">❓</span> Góc Hỏi Đáp</Link>
                    <Link to="#" className="nav-item"><span className="nav-icon">💬</span> Phản hồi hệ thống</Link>
                    <Link to="#" className="nav-item"><span className="nav-icon">👤</span> Hồ sơ cá nhân</Link>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>{activeTab === "home" ? "Trang chủ sinh viên" : "Diễn đàn Hỏi Đáp"}</h2>
                    <div className="header-avatar">VT</div>
                </header>

                <div className="dashboard-content">
                    {/* ... TAB BẢNG ĐIỀU KHIỂN GIỮ NGUYÊN ... */}
                    {activeTab === "home" && (
                        <>
                            <div className="welcome-card">
                                <div className="user-info">
                                    <div className="avatar-large">VT</div>
                                    <div><p className="greeting">Xin chào</p><h3 className="user-name">Vũ Duy Thái</h3></div>
                                </div>
                                <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                            </div>
                            <div className="info-cards-row">
                                <div className="info-card"><h4>Chương trình đào tạo</h4><p>Tên chương trình: <strong>Cử nhân</strong></p><p>Mã chương trình: <strong>CN</strong></p></div>
                                <div className="info-card"><h4>Kỳ học hiện tại</h4><p>Kỳ học: <strong>Học kỳ 1 Năm Học 2025-2026</strong></p><p>Năm học: <strong>2025</strong></p></div>
                            </div>
                        </>
                    )}

                    {/* ----------------- TAB GÓC HỎI ĐÁP (STYLE FACEBOOK) ----------------- */}
                    {activeTab === "qa" && (
                        <div className="fb-forum-container">
                            {/* Khu vực tạo bài viết */}
                            <div className="fb-create-post-card">
                                <div className="fb-create-input-row">
                                    <div className="avatar-small">VT</div>
                                    <input
                                        type="text"
                                        placeholder={`${currentUser} ơi, bạn đang thắc mắc gì thế?`}
                                        value={newPostText}
                                        onChange={(e) => setNewPostText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                                    />
                                    <button className="fb-post-btn" onClick={handleCreatePost}>Đăng</button>
                                </div>
                            </div>

                            {/* Danh sách bài viết */}
                            <div className="fb-post-list">
                                {posts.map(post => {
                                    const sortedComments = [...post.comments].sort((a, b) => b.likes - a.likes);
                                    const visibleCount = visibleCommentsCount[post.id] || 2;
                                    const displayedComments = sortedComments.slice(0, visibleCount);
                                    const remainingComments = sortedComments.length - visibleCount;
                                    const totalCommentsCount = post.comments.length + post.comments.reduce((acc, cmt) => acc + (cmt.replies?.length || 0), 0);

                                    return (
                                        <div key={post.id} className="fb-post-card">
                                            {/* HEADER BÀI VIẾT */}
                                            <div className="fb-post-header">
                                                <div className="fb-post-author-info">
                                                    <div className="avatar-small alt">{post.author.charAt(0)}</div>
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

                                            {/* NỘI DUNG BÀI VIẾT */}
                                            {editingPostId === post.id ? (
                                                <div className="fb-post-edit-box">
                                                    <textarea value={editPostText} onChange={(e) => setEditPostText(e.target.value)} />
                                                    <div>
                                                        <button className="save-btn" onClick={() => handleSaveEdit(post.id)}>Lưu</button>
                                                        <button className="cancel-btn" onClick={() => setEditingPostId(null)}>Hủy</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="fb-post-content">{post.text}</div>
                                            )}

                                            {/* THỐNG KÊ LIKE/COMMENT */}
                                            <div className="fb-post-stats">
                                                <span className="stats-likes">👍 {post.likes}</span>
                                                <span className="stats-comments">{totalCommentsCount} bình luận</span>
                                            </div>

                                            {/* THANH NÚT LIKE / BÌNH LUẬN (GIỐNG FB) */}
                                            <div className="fb-post-action-bar">
                                                <button className={`fb-action-btn ${post.isLiked ? 'liked' : ''}`} onClick={() => handleLikePost(post.id)}>
                                                    👍 Thích
                                                </button>
                                                <button className="fb-action-btn" onClick={() => document.getElementById(`comment-input-${post.id}`).focus()}>
                                                    💬 Bình luận
                                                </button>
                                            </div>

                                            {/* KHU VỰC BÌNH LUẬN */}
                                            <div className="fb-post-comments">
                                                {displayedComments.map(cmt => (
                                                    <div key={cmt.id} className="fb-comment-thread">
                                                        {/* BÌNH LUẬN GỐC */}
                                                        <div className="fb-comment-row">
                                                            <div className="avatar-small alt2">{cmt.author.charAt(0)}</div>
                                                            <div className="fb-comment-body">
                                                                <div className="fb-comment-bubble">
                                                                    <strong>{cmt.author}</strong>
                                                                    <span>{cmt.text}</span>
                                                                    {cmt.likes > 0 && <div className="fb-comment-like-count">👍 {cmt.likes}</div>}
                                                                </div>
                                                                <div className="fb-comment-actions">
                                                                    <button className={cmt.isLiked ? "liked" : ""} onClick={() => handleLikeComment(post.id, cmt.id)}>Thích</button>
                                                                    <button onClick={() => toggleReplyBox(cmt.id)}>Phản hồi</button>
                                                                    <span>{cmt.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* DANH SÁCH PHẢN HỒI (REPLIES) */}
                                                        {cmt.replies && cmt.replies.length > 0 && (
                                                            <div className="fb-replies-list">
                                                                {cmt.replies.map(reply => (
                                                                    <div key={reply.id} className="fb-comment-row">
                                                                        <div className="avatar-micro alt3">{reply.author.charAt(0)}</div>
                                                                        <div className="fb-comment-body">
                                                                            <div className="fb-comment-bubble reply-bubble">
                                                                                <strong>{reply.author}</strong>
                                                                                <span>{reply.text}</span>
                                                                                {reply.likes > 0 && <div className="fb-comment-like-count">👍 {reply.likes}</div>}
                                                                            </div>
                                                                            <div className="fb-comment-actions">
                                                                                <button className={reply.isLiked ? "liked" : ""} onClick={() => handleLikeComment(post.id, cmt.id, true, reply.id)}>Thích</button>

                                                                                {/* --- NÚT PHẢN HỒI MỚI THÊM VÀO ĐÂY --- */}
                                                                                <button onClick={() => {
                                                                                    // Mở ô nhập liệu
                                                                                    toggleReplyBox(cmt.id);
                                                                                    // Tự động điền tên người được phản hồi (vd: "@Lê Văn C ")
                                                                                    setReplyInputs(prev => ({ ...prev, [cmt.id]: `@${reply.author} ` }));
                                                                                }}>
                                                                                    Phản hồi
                                                                                </button>

                                                                                <span>{reply.time}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Ô NHẬP PHẢN HỒI */}
                                                        {openReplyBoxes[cmt.id] && (
                                                            <div className="fb-reply-input-row">
                                                                <div className="avatar-micro">VT</div>
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Phản hồi ${cmt.author}...`}
                                                                    value={replyInputs[cmt.id] || ""}
                                                                    onChange={(e) => setReplyInputs({ ...replyInputs, [cmt.id]: e.target.value })}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id, cmt.id)}
                                                                    autoFocus
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* NÚT TẢI THÊM BÌNH LUẬN */}
                                                {remainingComments > 0 ? (
                                                    <button className="fb-see-more-btn" onClick={() => handleLoadMoreComments(post.id)}>
                                                        Xem thêm {remainingComments} bình luận...
                                                    </button>
                                                ) : sortedComments.length > 2 ? (
                                                    <button className="fb-see-more-btn" onClick={() => handleCollapseComments(post.id)}>
                                                        Thu gọn bình luận
                                                    </button>
                                                ) : null}

                                                {/* Ô NHẬP BÌNH LUẬN GỐC */}
                                                <div className="fb-comment-input-row">
                                                    <div className="avatar-small">VT</div>
                                                    <input
                                                        id={`comment-input-${post.id}`}
                                                        type="text"
                                                        placeholder="Viết bình luận..."
                                                        value={commentInputs[post.id] || ""}
                                                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                    />
                                                    <button className="send-icon-btn" onClick={() => handleAddComment(post.id)}>➢</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}