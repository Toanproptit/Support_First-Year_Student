// src/components/common/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="text-xl font-semibold text-red-600">
          PTIT Student Support
        </Link>
      </div>

      {/* NAV LINKS cho mobile (hiện trên mobile, ẩn trên md+) */}
      <nav className="flex md:hidden items-center gap-3 text-gray-700">
        <Link to="/" className="hover:text-red-500">Trang chủ</Link>
        <Link to="/qna" className="hover:text-red-500">Hỏi đáp</Link>
        <Link to="/faq" className="hover:text-red-500">FAQ</Link>
        <Link to="/schedule" className="hover:text-red-500">Lịch học</Link>
      </nav>

      {/* Profile / Auth area luôn hiển thị (desktop + mobile) */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm text-gray-700">{user.fullName}</span>
            <button
              onClick={() => { logout(); }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
