import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import logoPtit from "../assets/logoptit.jpg";
import StudentCourseSections from "./student/StudentCourseSections";
import { clearAuth } from "../service/auth";
import { useToast } from "./ToastProvider";
import HomeTab from "./student/tabs/HomeTab";
import ActivitiesTab from "./student/tabs/ActivitiesTab";
import QaTab from "./student/tabs/QaTab";
import FeedbackTab from "./student/tabs/FeedbackTab";
import ProfileTab from "./student/tabs/ProfileTab";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("home");

  const [userInfo, setUserInfo] = useState({
    name: "Vũ Duy Thái",
    studentId: "B21DCCN123",
    class: "D21CQCN01-B",
    major: "Công nghệ thông tin",
    department: "Khoa CNTT 1",
    schoolEmail: "thaivd.b21@stu.ptit.edu.vn",
    personalEmail: "vuduythai@gmail.com",
    phone: "0987 654 321",
    batch: "2021 - 2026",
    status: "Đang học",
  });

  const handleLogout = () => {
    clearAuth();
    toast.show({ type: "info", title: "Đã đăng xuất", message: "Hẹn gặp lại bạn!" });
    navigate("/login/student", { replace: true });
  };

  const title =
    activeTab === "home"
      ? "Trang chủ sinh viên"
      : activeTab === "courseSections"
      ? "Lớp tín chỉ"
      : activeTab === "qa"
      ? "Diễn đàn Hỏi Đáp"
      : activeTab === "activities"
      ? "Hoạt động Ngoại khóa"
      : activeTab === "feedback"
      ? "Phản hồi hệ thống"
      : "Hồ sơ cá nhân";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={logoPtit} alt="PTIT Logo" className="sidebar-logo-img" />
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="#"
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("home");
            }}
          >
            <span className="nav-icon">🏠</span> Bảng điều khiển
          </Link>
          <Link
            to="#"
            className={`nav-item ${activeTab === "courseSections" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("courseSections");
            }}
          >
            <span className="nav-icon">📚</span> Lớp tín chỉ
          </Link>
          <Link
            to="#"
            className={`nav-item ${activeTab === "qa" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("qa");
            }}
          >
            <span className="nav-icon">❓</span> Góc Hỏi Đáp
          </Link>
          <Link
            to="#"
            className={`nav-item ${activeTab === "activities" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("activities");
            }}
          >
            <span className="nav-icon">🎯</span> Hoạt động Ngoại khóa
          </Link>
          <Link
            to="#"
            className={`nav-item ${activeTab === "feedback" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("feedback");
            }}
          >
            <span className="nav-icon">💬</span> Phản hồi hệ thống
          </Link>
          <Link
            to="#"
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("profile");
            }}
          >
            <span className="nav-icon">👤</span> Hồ sơ cá nhân
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>{title}</h2>
          <div className="header-right">
            <div className="header-avatar">VT</div>
            <button className="logout-btn-header" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "home" && <HomeTab userInfo={userInfo} />}
          {activeTab === "courseSections" && <StudentCourseSections />}
          {activeTab === "qa" && <QaTab toast={toast} fallbackUserName={userInfo.name} />}
          {activeTab === "activities" && <ActivitiesTab />}
          {activeTab === "feedback" && <FeedbackTab />}
          {activeTab === "profile" && <ProfileTab userInfo={userInfo} setUserInfo={setUserInfo} />}
        </div>
      </main>
    </div>
  );
}

