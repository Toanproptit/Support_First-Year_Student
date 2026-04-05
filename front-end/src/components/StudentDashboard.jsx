import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import logoPtit from "../assets/logoptit.jpg";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("home");

    // ========================================================
    // STATE CHO THÔNG TIN NGƯỜI DÙNG (PROFILE)
    // ========================================================
    const [userInfo, setUserInfo] = useState({
        name: "Vũ Duy Thái",
        studentId: "B21DCCN123",
        class: "D21CQCN01-B",
        major: "Công nghệ thông tin",
        department: "Khoa CNTT 1",
        schoolEmail: "thaivd.b21@stu.ptit.edu.vn",
        personalEmail: "vuduythai@gmail.com", // Thêm email cá nhân
        phone: "0987 654 321",
        batch: "2021 - 2026",
        status: "Đang học"
    });

    const currentUser = userInfo.name;

    // ========================================================
    // STATE GÓC HỎI ĐÁP (Giữ nguyên)
    // ========================================================
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Nguyễn Văn A",
            time: "2 giờ trước",
            text: "Mọi người cho mình hỏi lịch đăng ký tín chỉ học kỳ 2 xem ở đâu vậy ạ? Mình tìm trên web trường không thấy 😢",
            likes: 15,
            isLiked: false,
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

    // ========================================================
    // STATE CHO PHẢN HỒI HỆ THỐNG
    // ========================================================
    const [feedbackType, setFeedbackType] = useState("Lỗi kỹ thuật / Bug");
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackContent, setFeedbackContent] = useState("");

    // ========================================================
    // STATE CHO EDIT PROFILE (MODAL) VÀ ĐỔI MẬT KHẨU
    // ========================================================
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ phone: "", personalEmail: "" });

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // --- CÁC HÀM XỬ LÝ CHUNG ---
    const handleLogout = () => navigate("/");

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        if (!feedbackTitle.trim() || !feedbackContent.trim()) return;
        alert("Cảm ơn bạn! Phản hồi của bạn đã được gửi đến Ban quản trị hệ thống.");
        setFeedbackTitle("");
        setFeedbackContent("");
        setFeedbackType("Lỗi kỹ thuật / Bug");
    };

    // --- HÀM XỬ LÝ EDIT PROFILE ---
    const openEditProfileModal = () => {
        setEditFormData({
            phone: userInfo.phone,
            personalEmail: userInfo.personalEmail
        });
        setIsEditProfileModalOpen(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setUserInfo({
            ...userInfo,
            phone: editFormData.phone,
            personalEmail: editFormData.personalEmail
        });
        setIsEditProfileModalOpen(false);
        alert("Cập nhật thông tin liên lạc thành công!");
    };

    // --- HÀM XỬ LÝ ĐỔI MẬT KHẨU ---
    // --- HÀM XỬ LÝ ĐỔI MẬT KHẨU (Đã nâng cấp bảo mật) ---
    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        // 1. Kiểm tra độ dài tối thiểu
        if (newPassword.length < 6) {
            alert("Lỗi: Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        // 2. Kiểm tra độ phức tạp bằng Regex
        const hasUpperCase = /[A-Z]/.test(newPassword); // Có ít nhất 1 chữ in hoa
        const hasLowerCase = /[a-z]/.test(newPassword); // Có ít nhất 1 chữ thường
        const hasNumbers = /[0-9]/.test(newPassword);   // Có ít nhất 1 chữ số
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword); // Có ít nhất 1 ký tự đặc biệt

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            alert("Lỗi: Mật khẩu mới phải bao gồm ít nhất 1 chữ IN HOA, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt!");
            return;
        }

        // 3. Kiểm tra khớp mật khẩu
        if (newPassword !== confirmPassword) {
            alert("Lỗi: Mật khẩu mới và Nhập lại mật khẩu không khớp nhau!");
            return;
        }

        // Thành công
        alert("Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau.");

        // Reset form và đóng lại
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setIsChangingPassword(false);
    };

    // --- CÁC HÀM XỬ LÝ BÀI VIẾT & BÌNH LUẬN (Giữ nguyên) ---
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
            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon"><img src={logoPtit} alt="PTIT Logo" className="sidebar-logo-img" /></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="#" className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}><span className="nav-icon">🏠</span> Bảng điều khiển</Link>
                    <Link to="#" className={`nav-item ${activeTab === "qa" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActiveTab("qa"); }}><span className="nav-icon">❓</span> Góc Hỏi Đáp</Link>
                    <Link to="#" className={`nav-item ${activeTab === "feedback" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActiveTab("feedback"); }}><span className="nav-icon">💬</span> Phản hồi hệ thống</Link>
                    <Link to="#" className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActiveTab("profile"); }}><span className="nav-icon">👤</span> Hồ sơ cá nhân</Link>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>
                        {activeTab === "home" ? "Trang chủ sinh viên" :
                            activeTab === "qa" ? "Diễn đàn Hỏi Đáp" :
                                activeTab === "feedback" ? "Phản hồi hệ thống" : "Hồ sơ cá nhân"}
                    </h2>
                    <div className="header-right">
                        <div className="header-avatar">VT</div>
                        <button className="logout-btn-header" onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* ----------------- TAB BẢNG ĐIỀU KHIỂN ----------------- */}
                    {activeTab === "home" && (
                        <>
                            <div className="welcome-card">
                                <div className="user-info">
                                    <div className="avatar-large">VT</div>
                                    <div><p className="greeting">Xin chào</p><h3 className="user-name">{userInfo.name}</h3></div>
                                </div>
                            </div>
                            <div className="info-cards-row">
                                <div className="info-card"><h4>Chương trình đào tạo</h4><p>Tên chương trình: <strong>Cử nhân</strong></p><p>Mã chương trình: <strong>CN</strong></p></div>
                                <div className="info-card"><h4>Kỳ học hiện tại</h4><p>Kỳ học: <strong>Học kỳ 1 Năm Học 2025-2026</strong></p><p>Năm học: <strong>2025</strong></p></div>
                            </div>
                        </>
                    )}

                    {/* ----------------- TAB GÓC HỎI ĐÁP ----------------- */}
                    {activeTab === "qa" && (
                        <div className="fb-forum-container">
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

                            <div className="fb-post-list">
                                {posts.map(post => {
                                    const sortedComments = [...post.comments].sort((a, b) => b.likes - a.likes);
                                    const visibleCount = visibleCommentsCount[post.id] || 2;
                                    const displayedComments = sortedComments.slice(0, visibleCount);
                                    const remainingComments = sortedComments.length - visibleCount;
                                    const totalCommentsCount = post.comments.length + post.comments.reduce((acc, cmt) => acc + (cmt.replies?.length || 0), 0);

                                    return (
                                        <div key={post.id} className="fb-post-card">
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

                                            <div className="fb-post-stats">
                                                <span className="stats-likes">👍 {post.likes}</span>
                                                <span className="stats-comments">{totalCommentsCount} bình luận</span>
                                            </div>

                                            <div className="fb-post-action-bar">
                                                <button className={`fb-action-btn ${post.isLiked ? 'liked' : ''}`} onClick={() => handleLikePost(post.id)}>👍 Thích</button>
                                                <button className="fb-action-btn" onClick={() => document.getElementById(`comment-input-${post.id}`).focus()}>💬 Bình luận</button>
                                            </div>

                                            <div className="fb-post-comments">
                                                {displayedComments.map(cmt => (
                                                    <div key={cmt.id} className="fb-comment-thread">
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
                                                                                <button onClick={() => {
                                                                                    toggleReplyBox(cmt.id);
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

                                                {remainingComments > 0 ? (
                                                    <button className="fb-see-more-btn" onClick={() => handleLoadMoreComments(post.id)}>Xem thêm {remainingComments} bình luận...</button>
                                                ) : sortedComments.length > 2 ? (
                                                    <button className="fb-see-more-btn" onClick={() => handleCollapseComments(post.id)}>Thu gọn bình luận</button>
                                                ) : null}

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

                    {/* ----------------- TAB PHẢN HỒI HỆ THỐNG ----------------- */}
                    {activeTab === "feedback" && (
                        <div className="feedback-container">
                            <div className="feature-card-ui">
                                <h3>Gửi phản hồi / Báo lỗi</h3>
                                <p className="subtitle">Nếu bạn gặp vấn đề trong quá trình sử dụng hệ thống, vui lòng gửi phản hồi để Ban quản trị hỗ trợ khắc phục.</p>

                                <form className="feedback-form" onSubmit={handleSubmitFeedback}>
                                    <div className="form-group">
                                        <label>Loại vấn đề <span className="required">*</span></label>
                                        <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
                                            <option>Lỗi kỹ thuật / Bug (Không tải được trang, lỗi đăng nhập...)</option>
                                            <option>Thắc mắc về Dữ liệu (Sai điểm, thiếu môn học...)</option>
                                            <option>Góp ý cải thiện tính năng</option>
                                            <option>Khác</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Tiêu đề <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Tóm tắt ngắn gọn vấn đề..."
                                            value={feedbackTitle}
                                            onChange={(e) => setFeedbackTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Nội dung chi tiết <span className="required">*</span></label>
                                        <textarea
                                            rows="6"
                                            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                                            value={feedbackContent}
                                            onChange={(e) => setFeedbackContent(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="submit-btn-primary">Gửi Phản Hồi</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ----------------- TAB HỒ SƠ CÁ NHÂN ----------------- */}
                    {activeTab === "profile" && (
                        <div className="profile-container">
                            <div className="feature-card-ui profile-card">
                                <div className="profile-header-box">
                                    <div className="avatar-huge">VT</div>
                                    <div className="profile-titles">
                                        <h2>{userInfo.name}</h2>
                                        <p className="student-badge">Sinh viên Đại học Chính quy</p>
                                    </div>
                                    <button className="edit-profile-btn" onClick={openEditProfileModal}>Chỉnh sửa</button>
                                </div>

                                <div className="profile-details-grid">
                                    <div className="detail-box">
                                        <span className="detail-label">Mã sinh viên</span>
                                        <strong className="detail-value">{userInfo.studentId}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Lớp</span>
                                        <strong className="detail-value">{userInfo.class}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Chuyên ngành</span>
                                        <strong className="detail-value">{userInfo.major}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Khoa / Viện</span>
                                        <strong className="detail-value">{userInfo.department}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Email trường cấp</span>
                                        <strong className="detail-value">{userInfo.schoolEmail}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Email cá nhân</span>
                                        <strong className="detail-value">{userInfo.personalEmail}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Số điện thoại liên hệ</span>
                                        <strong className="detail-value">{userInfo.phone}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Niên khóa</span>
                                        <strong className="detail-value">{userInfo.batch}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span className="detail-label">Trạng thái học tập</span>
                                        <strong className="detail-value status-active">{userInfo.status}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* BẢO MẬT TÀI KHOẢN (ĐỔI MẬT KHẨU) */}
                            <div className="feature-card-ui security-card" style={{ marginTop: '20px' }}>
                                <h3>Bảo mật tài khoản</h3>

                                {!isChangingPassword ? (
                                    <div className="security-status">
                                        <p>Mật khẩu của bạn đã được bảo vệ. Bạn nên đổi mật khẩu định kỳ để đảm bảo an toàn.</p>
                                        <button className="open-pw-btn" onClick={() => setIsChangingPassword(true)}>
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                ) : (
                                    <form className="change-pw-form" onSubmit={handlePasswordSubmit}>
                                        <div className="form-group">
                                            <label>Mật khẩu hiện tại <span className="required">*</span></label>
                                            <input
                                                type="password"
                                                placeholder="Nhập mật khẩu hiện tại..."
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-row">
                                            <div className="form-group">
                                                <label>Mật khẩu mới <span className="required">*</span></label>
                                                <input
                                                    type="password"
                                                    placeholder="In hoa, in thường, số, ký tự đặc biệt..."
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Nhập lại mật khẩu mới <span className="required">*</span></label>
                                                <input
                                                    type="password"
                                                    placeholder="Nhập lại mật khẩu mới..."
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="pw-form-actions">
                                            <button type="submit" className="submit-btn-primary">Lưu mật khẩu mới</button>
                                            <button type="button" className="cancel-pw-btn" onClick={() => setIsChangingPassword(false)}>Hủy</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ========================================================
                MODAL CHỈNH SỬA THÔNG TIN LIÊN LẠC
                ======================================================== */}
            {isEditProfileModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Cập nhật thông tin liên lạc</h3>
                        <p>Bạn chỉ có thể thay đổi các thông tin liên hệ. Các thông tin học vụ khác vui lòng liên hệ phòng giáo vụ.</p>

                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email cá nhân</label>
                                <input
                                    type="email"
                                    value={editFormData.personalEmail}
                                    onChange={(e) => setEditFormData({ ...editFormData, personalEmail: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditProfileModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-save">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}