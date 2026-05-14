import axios from "axios";

const API_URL = "http://localhost:8080";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const requestUrl = error?.config?.url || "";
            const isAuthRequest =
                requestUrl.startsWith("/auth/login") ||
                requestUrl.startsWith("/auth/register");

            // Sai mật khẩu / đăng nhập lỗi cũng có thể trả về 401,
            // không redirect về home để còn hiển thị thông báo lỗi.
            if (!isAuthRequest) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("email");
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
