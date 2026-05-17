import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import Pagination from "./Pagination";
import { getAllFaculties } from "../../service/faculties";
import { createMajor, deleteMajor, getAllMajors, updateMajor } from "../../service/majors";

const PAGE_SIZE = 7;

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function MajorManagement() {
  const [majors, setMajors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    facultyCode: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = async ({ facultyCode } = {}) => {
    const list = await getAllMajors({ facultyCode: facultyCode || undefined });
    setMajors(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [fList, mList] = await Promise.all([getAllFaculties(), getAllMajors()]);
        if (cancelled) return;
        setFaculties(fList || []);
        setMajors(mList || []);
      } catch (e) {
        alert(getErrorMessage(e, "Không tải được danh sách ngành / khoa."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const facultyByCode = useMemo(() => {
    const map = new Map();
    (faculties || []).forEach((f) => map.set(f.code, f));
    return map;
  }, [faculties]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (majors || []).filter((m) => {
      const matchSearch =
        (m?.name || "").toLowerCase().includes(q) || (m?.code || "").toLowerCase().includes(q);
      const matchFaculty = filterFaculty === "all" || String(m?.facultyCode || "") === String(filterFaculty);
      return matchSearch && matchFaculty;
    });
  }, [majors, search, filterFaculty]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterFaculty = (val) => {
    setFilterFaculty(val);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingMajor(null);
    setFormData({ name: "", code: "", facultyCode: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (major) => {
    setEditingMajor(major);
    setFormData({
      name: major?.name || "",
      code: major?.code || "",
      facultyCode: major?.facultyCode || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = (formData.name || "").trim();
    const code = normalizeCode(formData.code);
    const facultyCode = normalizeCode(formData.facultyCode);
    if (!name || !code || !facultyCode) return;

    try {
      if (editingMajor) {
        await updateMajor(editingMajor.code, { name, facultyCode });
      } else {
        await createMajor({ code, name, facultyCode });
        setCurrentPage(1);
      }
      await refresh();
      closeModal();
    } catch (err) {
      alert(getErrorMessage(err, "Lưu ngành thất bại."));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const confirmDelete = (major) => setDeleteTarget(major);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMajor(deleteTarget.code);
      setDeleteTarget(null);
      await refresh();
      if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      alert(getErrorMessage(err, "Xoá ngành thất bại."));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Ngành</h2>
          <p className="page-subtitle">Danh sách ngành trong trường</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm ngành
        </button>
      </div>

      <div className="table-toolbar" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tên hoặc mã ngành..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select className="select-input" value={filterFaculty} onChange={(e) => handleFilterFaculty(e.target.value)}>
          <option value="all">Tất cả khoa</option>
          {(faculties || []).map((f) => (
            <option key={f.code} value={f.code}>
              [{f.code}] {f.name}
            </option>
          ))}
        </select>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã ngành</th>
              <th>Tên ngành</th>
              <th>Khoa</th>
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
                  Không có ngành nào.
                </td>
              </tr>
            ) : (
              paginated.map((major, idx) => {
                const faculty = facultyByCode.get(major.facultyCode);
                return (
                  <tr key={major.code}>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <code>{major.code}</code>
                    </td>
                    <td>
                      <strong>{major.name}</strong>
                    </td>
                    <td>{faculty ? `[${faculty.code}] ${faculty.name}` : major.facultyCode || "—"}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEditModal(major)}>
                          Sửa
                        </button>
                        <button className="btn-delete" onClick={() => confirmDelete(major)}>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMajor ? "Cập nhật ngành" : "Thêm ngành"}</h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    Tên ngành <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="VD: Kỹ thuật Phần mềm"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Mã ngành <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={!!editingMajor}
                    required
                    placeholder="VD: KTPM"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Khoa trực thuộc <span className="required">*</span>
                  </label>
                  <select name="facultyCode" value={formData.facultyCode} onChange={handleChange} required>
                    <option value="">-- Chọn khoa --</option>
                    {(faculties || []).map((f) => (
                      <option key={f.code} value={f.code}>
                        [{f.code}] {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary">
                  {editingMajor ? "Lưu" : "Thêm ngành"}
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
              <h3>⚠️ Xác nhận xoá ngành</h3>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Bạn có chắc muốn xoá ngành <strong>"{deleteTarget.name}"</strong>?
              </p>
              <div className="confirm-warning">
                Ngành thuộc khoa: <strong>{deleteTarget.facultyCode}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Huỷ
              </button>
              <button className="btn-delete-confirm" onClick={handleDelete}>
                Xoá ngành
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

