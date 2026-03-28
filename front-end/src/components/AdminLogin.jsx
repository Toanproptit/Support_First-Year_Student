import React, { useState } from "react";
import "../styles/AdminLogin.css"; // Nhớ tạo file CSS này ở Bước 2 nhé

export default function AdminLogin() {
    // State để quản lý việc ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-header">
                    <h3>Quản trị hệ thống</h3>
                    <h2>Đăng nhập</h2>
                </div>

                <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                        <label htmlFor="admin-email">Địa chỉ email<span className="required">*</span></label>
                        <input
                            type="email"
                            id="admin-email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="admin-password">Mật khẩu<span className="required">*</span></label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="admin-password"
                                required
                            />
                            {/* Nút con mắt để ẩn/hiện mật khẩu */}
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={togglePasswordVisibility}
                                aria-label="Hiện/Ẩn mật khẩu"
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="remember-group">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me">Ghi nhớ đăng nhập</label>
                    </div>

                    <button type="submit" className="admin-submit-btn">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}