import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../service/users";
import { getAllFaculties } from "../../service/faculties";
import { getAllMajors } from "../../service/majors";

const PAGE_SIZE = 5;

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function UserManagement() {
  const [allUsers, setAllUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("Student"); // Student | Teacher

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "Student",
    majorCode: "",
  });

  const refresh = async () => {
    const all = await getAllUsers({ size: 100 });
    setAllUsers(all || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [all, fList, mList] = await Promise.all([getAllUsers({ size: 100 }), getAllFaculties(), getAllMajors()]);
        if (cancelled) return;
        setAllUsers(all || []);
        setFaculties(fList || []);
        setMajors(mList || []);
      } catch (e) {
        alert(getErrorMessage(e, "Không tải được danh sách sinh viên."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const users = useMemo(() => {
    const role = String(activeRole || "");
    return (allUsers || []).filter((u) => String(u?.role || u?.Role || "") === role);
  }, [allUsers, activeRole]);

  const facultyByCode = useMemo(() => {
    const map = new Map();
    (faculties || []).forEach((f) => map.set(f.code, f));
    return map;
  }, [faculties]);

  const majorByCode = useMemo(() => {
    const map = new Map();
    (majors || []).forEach((m) => map.set(m.code, m));
    return map;
  }, [majors]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return users;
    return (users || []).filter((u) => {
      const name = (u?.fullName || "").toLowerCase();
      const username = String(u?.userName || u?.username || "");
      return name.includes(q) || username.toLowerCase().includes(q);
    });
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const label = activeRole === "Teacher" ? "giáo viên" : "sinh viên";
    if (!window.confirm(`Bạn có chắc muốn xoá ${label} này khỏi hệ thống?`)) return;
    try {
      await deleteUser(id);
      await refresh();
      if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (e) {
      alert(getErrorMessage(e, "Xoá người dùng thất bại."));
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      username: "",
      password: "",
      role: activeRole,
      majorCode: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.userName || user?.username || "",
      password: "",
      role: user?.role || user?.Role || activeRole,
      majorCode: user?.majorCode || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const majorOptions = useMemo(() => {
    const list = Array.isArray(majors) ? [...majors] : [];
    list.sort((a, b) => String(a?.code || "").localeCompare(String(b?.code || "")));
    return list;
  }, [majors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = (formData.fullName || "").trim();
    const username = (formData.username || "").trim();
    const email = (formData.email || "").trim();
    const password = (formData.password || "").trim();
    const role = String(formData.role || "").trim() || activeRole;
    const majorCode = (formData.majorCode || "").trim();
    const majorCodeToSend = role === "Student" ? majorCode : null;
    if (!fullName || !username || !email || !password) return;
    if (role === "Student" && !majorCodeToSend) return;

    try {
      if (editingUser) {
        await updateUser(editingUser.id, { fullName, username, email, password, role, majorCode: majorCodeToSend });
      } else {
        await createUser({ fullName, username, email, password, role, majorCode: majorCodeToSend });
        setCurrentPage(1);
      }
      await refresh();
      closeModal();
    } catch (err) {
      alert(getErrorMessage(err, "Lưu người dùng thất bại."));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...(prev || {}), [name]: value };
      if (name === "role" && value !== "Student") next.majorCode = "";
      return next;
    });
  };

  const roleLabel = activeRole === "Teacher" ? "Giáo viên" : "Sinh viên";
  const usernameLabel = activeRole === "Teacher" ? "Mã GV" : "Mã SV";

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý {roleLabel}</h2>
          <p className="page-subtitle">Danh sách tài khoản {roleLabel.toLowerCase()} trong hệ thống</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm {roleLabel.toLowerCase()}
        </button>
      </div>

      <div className="table-toolbar">
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className={`btn-secondary ${activeRole === "Student" ? "active" : ""}`}
            onClick={() => {
              setActiveRole("Student");
              setSearch("");
              setCurrentPage(1);
            }}
          >
            Sinh viên
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeRole === "Teacher" ? "active" : ""}`}
            onClick={() => {
              setActiveRole("Teacher");
              setSearch("");
              setCurrentPage(1);
            }}
          >
            Giáo viên
          </button>
        </div>
        <input
          className="search-input"
          type="text"
          placeholder={`Tìm kiếm theo tên hoặc ${usernameLabel}...`}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>{usernameLabel}</th>
              <th>Email</th>
              <th>Khoa</th>
              <th>Ngành</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  Không tìm thấy {roleLabel.toLowerCase()} nào.
                </td>
              </tr>
            ) : (
              paginated.map((user, idx) => {
                const major = user?.majorCode ? majorByCode.get(user.majorCode) : null;
                const faculty = major?.facultyCode ? facultyByCode.get(major.facultyCode) : null;
                return (
                  <tr key={user.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <strong>{user.fullName}</strong>
                    </td>
                    <td>
                      <code>{user.userName || user.username || "-"}</code>
                    </td>
                    <td>{user.email}</td>
                    <td>{faculty ? `[${faculty.code}] ${faculty.name}` : major?.facultyCode || "—"}</td>
                    <td>{major ? `[${major.code}] ${major.name}` : user?.majorCode || "—"}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEditModal(user)}>
                          Sửa
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingUser
                  ? `Sửa thông tin ${formData.role === "Teacher" ? "giáo viên" : "sinh viên"}`
                  : `Thêm ${formData.role === "Teacher" ? "giáo viên" : "sinh viên"} mới`}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Vai trò *</label>
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="Student">Sinh viên</option>
                    <option value="Teacher">Giáo viên</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Họ tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên..."
                  />
                </div>

                <div className="form-group">
                  <label>{formData.role === "Teacher" ? "Mã GV (username) *" : "MSSV (username) *"}</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder={formData.role === "Teacher" ? "VD: GV001" : "VD: B21DCCN001"}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Nhập địa chỉ email..."
                  />
                </div>

                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={editingUser ? "Nhập mật khẩu mới..." : "Nhập mật khẩu..."}
                  />
                </div>

                {formData.role === "Student" && (
                  <div className="form-group">
                    <label>Ngành *</label>
                    <select name="majorCode" value={formData.majorCode} onChange={handleChange} required>
                      <option value="">-- Chọn ngành --</option>
                      {majorOptions.map((m) => {
                        const f = m?.facultyCode ? facultyByCode.get(m.facultyCode) : null;
                        const facultyLabel = f ? `[${f.code}] ${f.name}` : m?.facultyCode ? `[${m.facultyCode}]` : "";
                        const label = `${facultyLabel} - [${m.code}] ${m.name}`;
                        return (
                          <option key={m.code} value={m.code}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {editingUser ? (
                  <div style={{ color: "#64748b", fontSize: "0.92rem" }}>
                    Backend hiện yêu cầu nhập mật khẩu khi cập nhật thông tin.
                  </div>
                ) : null}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
