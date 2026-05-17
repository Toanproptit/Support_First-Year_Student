import React, { useState } from "react";
import "../styles/StudentLogin.css";
import logoPtit from "../assets/logoptit.jpg";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, login, saveAuth } from "../service/auth";
import { useToast } from "./ToastProvider";

export default function StudentLogin() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, role } = await login({ email, password });
      if (role !== "Student") {
        clearAuth();
        const msg = "Tài khoản này không phải Sinh viên. Vui lòng đăng nhập ở trang Quản trị viên.";
        setError(msg);
        toast.show({ type: "warning", title: "Sai vai trò", message: msg });
        return;
      }
      saveAuth({ token, role, email });
      toast.show({ type: "success", title: "Đăng nhập thành công", message: "Chào mừng bạn!" });
      navigate("/student-dashboard");
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
    <div className="cas-layout">
      <div className="cas-sidebar">
        <div className="cas-back-home">
          <Link to="/" className="cas-back-home-link" aria-label="Trở về Home">
            ← Trở về Home
          </Link>
        </div>
        <div className="cas-logo-header">
          <img src={logoPtit} alt="PTIT Logo" className="cas-logo-img" />
          <h2>Central Authentication Service</h2>
        </div>

        <form className="cas-form" onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div style={{ color: "#b91c1c", fontSize: 14, marginTop: 8 }} role="alert">
              {error}
            </div>
          ) : null}

          <button type="submit" className="cas-submit-btn" disabled={loading}>
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="cas-footer">
          <Link to="/forgot-password" className="forgot-pw">
            Bạn quên mật khẩu?
          </Link>
          <Link to="/register" className="forgot-pw">
            Tạo tài khoản
          </Link>
        </div>
      </div>

      <div className="cas-main-bg">
        <div className="top-right-card">
          <div className="globe-icon">🌍</div>
          <div>
            <p>
              Hệ thống Hỗ trợ Sinh viên -
              <br />
              Học viện Công nghệ Bưu chính Viễn thông
            </p>
          </div>
        </div>

        <div className="big-center-logo">
          <img src={logoPtit} alt="Big PTIT Logo" className="big-circle-img" />
        </div>
      </div>
    </div>
  );
}
