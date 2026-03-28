import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import logoPtit from "../assets/logoptit.jpg";
export default function StudentDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xử lý đăng xuất (xóa token, v.v.) rồi chuyển về trang chọn vai trò
        navigate("/");
    };

    return (
        <div className="dashboard-layout">
            {/* THANH SIDEBAR BÊN TRÁI */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    {/* Chỗ này để icon logo nhỏ */}
                    <div className="logo-icon">
                        <img src={logoPtit} alt="PTIT Logo" className="sidebar-logo-img" />
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {/* Menu Bảng điều khiển đang được chọn (active) */}
                    <Link to="/student-dashboard" className="nav-item active">
                        <span className="nav-icon">🏠</span> Bảng điều khiển
                    </Link>
                    <Link to="#" className="nav-item">
                        <span className="nav-icon">⇄</span> Yêu cầu điều chỉnh lớp học
                    </Link>
                    <Link to="#" className="nav-item">
                        <span className="nav-icon">⊕</span> Yêu cầu mở lớp
                    </Link>
                    <Link to="#" className="nav-item">
                        <span className="nav-icon">📖</span> Lớp học phần đang mở
                    </Link>
                    <Link to="#" className="nav-item">
                        <span className="nav-icon">📄</span> Điểm môn học
                    </Link>
                    <Link to="#" className="nav-item">
                        <span className="nav-icon">💬</span> Phản hồi hệ thống
                    </Link>
                    <Link to="#" className="nav-item">
                        <span className="nav-icon">👤</span> Hồ sơ cá nhân
                    </Link>
                </nav>
            </aside>

            {/* NỘI DUNG CHÍNH BÊN PHẢI */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>Trang chủ sinh viên</h2>
                    <div className="header-avatar">VT</div>
                </header>

                <div className="dashboard-content">
                    {/* Thẻ Lời chào & Đăng xuất */}
                    <div className="welcome-card">
                        <div className="user-info">
                            <div className="avatar-large">VT</div>
                            <div>
                                <p className="greeting">Xin chào</p>
                                <h3 className="user-name">Vũ Duy Thái</h3>
                            </div>
                        </div>

                        <button className="logout-btn" onClick={handleLogout}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Đăng xuất
                        </button>
                    </div>

                    {/* Hàng chứa 2 thẻ thông tin */}
                    <div className="info-cards-row">
                        {/* Thẻ Chương trình đào tạo */}
                        <div className="info-card">
                            <h4>Chương trình đào tạo</h4>
                            <p>Tên chương trình: <strong>Cử nhân</strong></p>
                            <p>Mã chương trình: <strong>CN</strong></p>
                        </div>

                        {/* Thẻ Kỳ học hiện tại */}
                        <div className="info-card">
                            <h4>Kỳ học hiện tại</h4>
                            <p>Kỳ học: <strong>Học kỳ 1 Năm Học 2025-2026</strong></p>
                            <p>Năm học: <strong>2025</strong></p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}