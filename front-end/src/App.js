import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LoginSelection from "./components/LoginSelection";
import StudentLogin from "./components/StudentLogin"; // Gọi file mới tạo vào đây
import ForgotPassword from "./components/ForgotPassword";
import AdminLogin from "./components/AdminLogin";
import StudentHandbook from "./components/StudentHandbook";
import StudentDashboard from "./components/StudentDashboard";

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="container full-center">
        <Routes>
          <Route path="/" element={<LoginSelection />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cam-nang" element={<StudentHandbook />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
      </main>
    </div>
  );
}