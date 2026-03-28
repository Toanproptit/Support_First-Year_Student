import React from "react";
import { Link } from "react-router-dom";
import "../styles/ForgotPassword.css"; // Link tới file CSS sẽ tạo ở Bước 2

export default function ForgotPassword() {
    return (
        <div className="forgot-pw-page">
            {/* Header màu đỏ */}
            <header className="forgot-header">
                <div className="header-left">
                    <span>Tài khoản PTIT</span>
                </div>
                <div className="header-right">
                    {/* Bấm đăng xuất quay về trang Chọn vai trò */}
                    <Link to="/" className="logout-btn">
                        Đăng xuất <span aria-hidden="true">➜</span>
                    </Link>
                </div>
            </header>

            {/* Khối nội dung chính */}
            <main className="forgot-main">
                <div className="forgot-card">
                    <h2>Đặt lại mật khẩu</h2>
                    <form className="forgot-form" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Nhập email của bạn..."
                            required
                        />
                        <small><em>*Email cá nhân đã đăng ký với hệ thống.</em></small>

                        <button type="submit" className="next-btn">Tiếp theo</button>
                    </form>
                </div>
            </main>
        </div>
    );
}