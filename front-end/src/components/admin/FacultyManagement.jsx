import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import Pagination from "./Pagination";
import {
  createFaculty,
  deleteFaculty,
  getAllFaculties,
  getMajorsByFaculty,
  updateFaculty,
} from "../../service/faculties";

const PAGE_SIZE = 6;

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCode, setExpandedCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [majorsByFaculty, setMajorsByFaculty] = useState({});
  const [majorsLoading, setMajorsLoading] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "" });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = async () => {
    const list = await getAllFaculties();
    setFaculties(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const list = await getAllFaculties();
        if (cancelled) return;
        setFaculties(list || []);
      } catch (e) {
        alert(getErrorMessage(e, "Không tải được danh sách khoa."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return faculties;
    return (faculties || []).filter(
      (f) =>
        (f?.name || "").toLowerCase().includes(q) ||
        (f?.code || "").toLowerCase().includes(q)
    );
  }, [faculties, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
    setExpandedCode(null);
  };

  const loadMajors = async (facultyCode) => {
    if (!facultyCode) return;
    if (majorsByFaculty[facultyCode]) return;
    if (majorsLoading[facultyCode]) return;

    try {
      setMajorsLoading((p) => ({ ...p, [facultyCode]: true }));
      const majors = await getMajorsByFaculty(facultyCode);
      setMajorsByFaculty((p) => ({ ...p, [facultyCode]: majors || [] }));
    } catch (e) {
      alert(getErrorMessage(e, "Không tải được danh sách ngành theo khoa."));
    } finally {
      setMajorsLoading((p) => ({ ...p, [facultyCode]: false }));
    }
  };

  const toggleExpand = (code) => {
    setExpandedCode((prev) => {
      const next = prev === code ? null : code;
      if (next) loadMajors(next);
      return next;
    });
  };

  const openAddModal = () => {
    setEditingFaculty(null);
    setFormData({ name: "", code: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({ name: faculty?.name || "", code: faculty?.code || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = (formData.name || "").trim();
    const code = normalizeCode(formData.code);
    if (!name || !code) return;

    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.code, { name });
      } else {
        await createFaculty({ code, name });
        setCurrentPage(1);
      }
      await refresh();
      closeModal();
    } catch (err) {
      alert(getErrorMessage(err, "Lưu khoa thất bại."));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const confirmDelete = (faculty) => setDeleteTarget(faculty);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFaculty(deleteTarget.code);
      setDeleteTarget(null);
      if (expandedCode === deleteTarget.code) setExpandedCode(null);
      await refresh();
      if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      alert(getErrorMessage(err, "Xoá khoa thất bại."));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Khoa</h2>
          <p className="page-subtitle">
            Danh sách các khoa trong trường — tổng{" "}
            <strong>{faculties.length}</strong> khoa
          </p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm khoa mới
        </button>
      </div>

      <div className="table-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm theo tên hoặc mã khoa..."
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
              <th>Mã khoa</th>
              <th>Tên khoa</th>
              <th>Ngành</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  Không có khoa nào.
                </td>
              </tr>
            ) : (
              paginated.map((faculty, idx) => (
                <React.Fragment key={faculty.code}>
                  <tr>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <code>{faculty.code}</code>
                    </td>
                    <td>
                      <strong>{faculty.name}</strong>
                    </td>
                    <td>
                      <button className="btn-expand" onClick={() => toggleExpand(faculty.code)}>
                        {expandedCode === faculty.code ? "Thu gọn" : "Xem ngành"}
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEditModal(faculty)}>
                          Sửa
                        </button>
                        <button className="btn-delete" onClick={() => confirmDelete(faculty)}>
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedCode === faculty.code && (
                    <tr className="expanded-row">
                      <td colSpan={5}>
                        <div className="expanded-content">
                          <h4>Danh sách ngành thuộc khoa</h4>
                          {majorsLoading[faculty.code] ? (
                            <div className="empty-state">Đang tải...</div>
                          ) : (majorsByFaculty[faculty.code] || []).length > 0 ? (
                            <ul className="major-list">
                              {(majorsByFaculty[faculty.code] || []).map((major) => (
                                <li key={major.code}>
                                  <strong>{major.name}</strong> <code>{major.code}</code>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-major">Chưa có ngành nào.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFaculty ? "✏️ Sửa thông tin khoa" : "🏛️ Thêm khoa mới"}</h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    Tên khoa <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="VD: Khoa Công nghệ Thông tin"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Mã khoa <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={!!editingFaculty}
                    required
                    placeholder="VD: CNTT"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary">
                  {editingFaculty ? "Lưu thay đổi" : "Thêm khoa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Xác nhận xoá khoa</h3>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Bạn có chắc muốn xoá khoa <strong>"{deleteTarget.name}"</strong>?
              </p>
              <div className="confirm-warning">Nếu khoa đang có ngành, backend sẽ không cho phép xoá.</div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Huỷ
              </button>
              <button className="btn-delete-confirm" onClick={handleDelete}>
                Xoá khoa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

