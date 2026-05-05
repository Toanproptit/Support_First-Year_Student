import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LoginSelection from "./components/LoginSelection";
import StudentLogin from "./components/StudentLogin";
import ForgotPassword from "./components/ForgotPassword";
import AdminLogin from "./components/AdminLogin";
import StudentHandbook from "./components/StudentHandbook";
import StudentDashboard from "./components/StudentDashboard";
import TrainingPrograms from "./components/TrainingPrograms";
import ProgramDetail from "./components/ProgramDetail";
import ScholarshipDetail from "./components/ScholarshipDetail";
// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import PostManagement from "./components/admin/PostManagement";
import HandbookManagement from "./components/admin/HandbookManagement";
import FacultyManagement from "./components/admin/FacultyManagement";
import MajorManagement from "./components/admin/MajorManagement";
import ActivityManagement from "./components/admin/ActivityManagement";

// Layout chung cho các trang public (có Header)
function PublicLayout({ children }) {
  return (
    <div className="app-root">
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ===== Tuyến công khai (có Header) ===== */}
      <Route path="/" element={<PublicLayout><LoginSelection /></PublicLayout>} />
      <Route path="/login/student" element={<PublicLayout><StudentLogin /></PublicLayout>} />
      <Route path="/login/admin" element={<PublicLayout><AdminLogin /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/cam-nang" element={<PublicLayout><StudentHandbook /></PublicLayout>} />
      <Route path="/student-dashboard" element={<PublicLayout><StudentDashboard /></PublicLayout>} />
      <Route path="/cam-nang/1" element={<PublicLayout><TrainingPrograms /></PublicLayout>} />
      <Route path="/chuong-trinh/:id" element={<ProgramDetail />} />
      <Route path="/cam-nang/2" element={<ScholarshipDetail />} />

      {/* ===== Tuyến Admin (có Sidebar, KHÔNG có Header chung) ===== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="posts" element={<PostManagement />} />
        <Route path="handbook" element={<HandbookManagement />} />
        <Route path="faculties" element={<FacultyManagement />} />
        <Route path="majors" element={<MajorManagement />} />
        <Route path="activities" element={<ActivityManagement />} />
      </Route>
    </Routes>
  );
}