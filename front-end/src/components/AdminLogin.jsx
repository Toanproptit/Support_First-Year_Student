import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import { clearAuth, login, saveAuth } from "../service/auth";
import { useToast } from "./ToastProvider";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, role } = await login({ email, password });
      if (role !== "Admin") {
        clearAuth();
        const msg = "Tài khoản này không phải Admin. Vui lòng đăng nhập ở trang Sinh viên.";
        setError(msg);
        toast.show({ type: "warning", title: "Sai vai trò", message: msg });
        return;
      }
      saveAuth({ token, role, email });
      toast.show({ type: "success", title: "Đăng nhập thành công", message: "Chào mừng Admin!" });
      navigate("/admin/dashboard");
    } catch (err) {
      clearAuth();
      const msg = err?.message || "Đăng nhập thất bại.";
      setError(msg);
      toast.show({ type: "error", title: "Đăng nhập thất bại", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-back-home">
          <Link to="/" className="admin-back-home-link" aria-label="Trở về Home">
            ← Trở về Home
          </Link>
        </div>
        <div className="admin-header">
          <h3>Quản trị hệ thống</h3>
          <h2>Đăng nhập</h2>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="admin-email">
              Địa chỉ email<span className="required">*</span>
            </label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="admin-password">
              Mật khẩu<span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={togglePasswordVisibility}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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

          {error ? (
            <div style={{ color: "#b91c1c", fontSize: 14, marginBottom: 10 }} role="alert">
              {error}
            </div>
          ) : null}

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
