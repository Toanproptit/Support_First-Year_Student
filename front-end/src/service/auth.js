import api from "./api";
import { getRoleFromToken } from "../utils/jwt";

function extractErrorMessage(err, fallback) {
  const msg = err?.response?.data?.message || err?.message;
  return msg || fallback;
}

export async function login({ email, password }) {
  try {
    const res = await api.post("/auth/login", { email, password });
    const token = res?.data?.result?.token;
    if (!token) throw new Error(res?.data?.message || "Đăng nhập thất bại.");
    const role = getRoleFromToken(token);
    return { token, role };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Đăng nhập thất bại."));
  }
}

export async function register({ fullName, username, email, password }) {
  try {
    const res = await api.post("/auth/register", { fullName, username, email, password });
    return res?.data?.result ?? null;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Đăng ký thất bại."));
  }
}

export function saveAuth({ token, role, email }) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role || "");
  localStorage.setItem("email", email || "");
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
}
