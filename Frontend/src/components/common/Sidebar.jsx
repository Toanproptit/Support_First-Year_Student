// src/components/common/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ open = false, onClose = () => { } }) {
  const { user } = useAuth();

  return (
    <>
      {/* Overlay (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } md:hidden`}
        onClick={() => onClose && onClose()}
        aria-hidden={!open}
      />

      <aside
        role="navigation"
        aria-label="Main sidebar"
        className={`fixed z-40 left-0 top-0 h-full w-64 bg-red-700 text-white p-6 transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center justify-between mb-6">
          <NavLink to="/" className="flex items-center gap-3">
            <img src="/logoptit.jpg" alt="PTIT Student Support" className="w-8 h-8 rounded" />
            <span className="ml-2 text-lg font-bold text-white hidden md:inline">PTIT</span>
          </NavLink>

          <button
            onClick={() => onClose && onClose()}
            className="md:hidden p-2 rounded hover:bg-white/10"
            aria-label="Đóng menu"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `px-2 py-2 rounded ${isActive ? "bg-white/20 text-white" : "hover:bg-white/10"}`
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/qna"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `px-2 py-2 rounded ${isActive ? "bg-white/20 text-white" : "hover:bg-white/10"}`
            }
          >
            Hỏi đáp
          </NavLink>

          <NavLink
            to="/faq"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `px-2 py-2 rounded ${isActive ? "bg-white/20 text-white" : "hover:bg-white/10"}`
            }
          >
            FAQ
          </NavLink>

          <NavLink
            to="/schedule"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `px-2 py-2 rounded ${isActive ? "bg-white/20 text-white" : "hover:bg-white/10"}`
            }
          >
            Lịch học
          </NavLink>

          {user?.role === "admin" && (
            <>
              <hr className="my-3 border-white/30" />
              <NavLink
                to="/admin/users"
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `px-2 py-2 rounded ${isActive ? "bg-white/20 text-white" : "hover:bg-white/10"}`
                }
              >
                Quản lý user
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
