import React, { useEffect, useMemo, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { clearAuth } from "../service/auth";
import { getRoleFromToken, isTokenExpired } from "../utils/jwt";
import { useToast } from "./ToastProvider";

function getStoredRole(token) {
  const role = localStorage.getItem("role");
  if (role) return role;
  return getRoleFromToken(token);
}

export default function RequireAuth({ role: requiredRole, children }) {
  const location = useLocation();
  const toast = useToast();
  const shownRef = useRef(false);

  const token = localStorage.getItem("token");
  const role = useMemo(() => (token ? getStoredRole(token) : null), [token]);

  useEffect(() => {
    if (token && role && !localStorage.getItem("role")) {
      localStorage.setItem("role", role);
    }
  }, [token, role]);

  if (!token) {
    const to = requiredRole === "Admin" ? "/login/admin" : "/login/student";
    return <Navigate to={to} replace state={{ from: location }} />;
  }

  if (isTokenExpired(token)) {
    if (!shownRef.current) {
      shownRef.current = true;
      toast.show({
        type: "info",
        title: "Phiên đăng nhập đã hết hạn",
        message: "Vui lòng đăng nhập lại.",
      });
    }
    clearAuth();
    const to = requiredRole === "Admin" ? "/login/admin" : "/login/student";
    return <Navigate to={to} replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    if (!shownRef.current) {
      shownRef.current = true;
      toast.show({
        type: "warning",
        title: "Không có quyền truy cập",
        message: "Bạn đang đăng nhập bằng tài khoản không đúng vai trò.",
      });
    }
    clearAuth();
    const to = requiredRole === "Admin" ? "/login/admin" : "/login/student";
    return <Navigate to={to} replace state={{ from: location }} />;
  }

  return children;
}
