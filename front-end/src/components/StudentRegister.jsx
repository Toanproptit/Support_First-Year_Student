import React, { useState } from "react";
import "../styles/StudentLogin.css";
import logoPtit from "../assets/logoptit.jpg";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../service/auth";
import { useToast } from "./ToastProvider";

export default function StudentRegister() {
  const navigate = useNavigate();
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      const msg = "Mật khẩu phải có ít nhất 6 ký tự.";
      setError(msg);
      toast.show({ type: "warning", title: "Dữ liệu không hợp lệ", message: msg });
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Mật khẩu nhập lại không khớp.";
      setError(msg);
      toast.show({ type: "warning", title: "Dữ liệu không hợp lệ", message: msg });
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, username, email, password });
      toast.show({ type: "success", title: "Đăng ký thành công", message: "Bạn có thể đăng nhập ngay bây giờ." });
      navigate("/login/student");
    } catch (err) {
      const msg = err?.message || "Đăng ký thất bại.";
      setError(msg);
      toast.show({ type: "error", title: "Đăng ký thất bại", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cas-layout">
      <div className="cas-sidebar">
        <div className="cas-logo-header">
          <img src={logoPtit} alt="PTIT Logo" className="cas-logo-img" />
          <h2>Central Authentication Service</h2>
        </div>

        <form className="cas-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div style={{ color: "#b91c1c", fontSize: 14, marginTop: 8 }} role="alert">
              {error}
            </div>
          ) : null}

          <button type="submit" className="cas-submit-btn" disabled={loading}>
            {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
          </button>
        </form>

        <div className="cas-footer">
          <Link to="/login/student" className="forgot-pw">
            Quay lại đăng nhập
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
