import React from "react";
import "../styles/StudentLogin.css";
import logoPtit from "../assets/logoptit.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function StudentLogin() {
    const navigate = useNavigate(); // Khai báo hook điều hướng

    // Hàm xử lý khi người dùng ấn Đăng nhập
    const handleLoginSubmit = (e) => {
        e.preventDefault(); // Chặn hành vi tự động reload trang của trình duyệt
        navigate("/student-dashboard"); // Nhảy sang trang Dashboard
    };

    return (
        <div className="cas-layout">
            {/* --- CỘT TRÁI: FORM ĐĂNG NHẬP --- */}
            <div className="cas-sidebar">
                <div className="cas-logo-header">
                    <img src={logoPtit} alt="PTIT Logo" className="cas-logo-img" />
                    <h2>Central Authentication Service</h2>
                </div>

                {/* Sửa lại onSubmit cho chuẩn (bỏ dấu ngoặc dư) */}
                <form className="cas-form" onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input type="text" id="username" name="username" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <div className="cas-recaptcha">
                        <div className="checkbox-wrap">
                            <input type="checkbox" id="robot" />
                            <label htmlFor="robot">Tôi không phải là người máy</label>
                        </div>
                        <div className="recaptcha-logo">
                            <span>reCAPTCHA</span>
                            <small>Bảo mật - Điều khoản</small>
                        </div>
                    </div>

                    {/* LƯU Ý: Nút Submit BẮT BUỘC PHẢI nằm TRONG thẻ form */}
                    <button type="submit" className="cas-submit-btn">
                        ĐĂNG NHẬP
                    </button>
                </form>

                <div className="cas-footer">
                    <Link to="/forgot-password" className="forgot-pw">
                        Bạn quên mật khẩu?
                    </Link>
                </div>
            </div>

            {/* --- CỘT PHẢI: BACKGROUND & LOGO TO --- */}
            <div className="cas-main-bg">
                <div className="top-right-card">
                    <div className="globe-icon">🌍</div>
                    <div>
                        <p>Hệ thống Hỗ trợ Sinh viên -<br />Học viện Công nghệ Bưu chính Viễn thông</p>
                    </div>
                </div>

                <div className="big-center-logo">
                    <img src={logoPtit} alt="Big PTIT Logo" className="big-circle-img" />
                </div>
            </div>
        </div>
    );
}