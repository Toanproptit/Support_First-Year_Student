import React from "react";
import "../../styles/AdminPages.css";

const stats = [
  { label: "Tổng sinh viên", value: "1,248", icon: "👥", color: "#3b82f6" },
  { label: "Bài viết", value: "84", icon: "📝", color: "#10b981" },
  { label: "Mục cẩm nang", value: "32", icon: "📚", color: "#f59e0b" },
  { label: "Phản hồi mới", value: "17", icon: "💬", color: "#c8102e" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <h2 className="page-title">Tổng quan</h2>
      <p className="page-subtitle">Chào mừng trở lại, Admin! Đây là tóm tắt hệ thống.</p>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label} style={{ "--accent-color": s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
