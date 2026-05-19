import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import Pagination from "./Pagination";
import { createSubject, deleteSubject, getAllSubjects, updateSubject } from "../../service/subjects";

const PAGE_SIZE = 8;

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

function toIntOrNull(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export default function SubjectManagement() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    finalExamWeight: "",
    midtermWeight: "",
    attendanceWeight: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = async () => {
    const list = await getAllSubjects();
    setSubjects(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const list = await getAllSubjects();
        if (cancelled) return;
        setSubjects(list || []);
      } catch (e) {
        if (!cancelled) alert(getErrorMessage(e, "Không tải được danh sách môn học."));
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
    return (subjects || []).filter((s) => {
      if (!q) return true;
      return (
        String(s?.code || "").toLowerCase().includes(q) ||
        String(s?.name || "").toLowerCase().includes(q)
      );
    });
  }, [subjects, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAddModal = () => {
    setEditing(null);
    setFormData({
      code: "",
      name: "",
      finalExamWeight: "",
      midtermWeight: "",
      attendanceWeight: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditing(subject);
    setFormData({
      code: subject?.code || "",
      name: subject?.name || "",
      finalExamWeight: subject?.finalExamWeight ?? "",
      midtermWeight: subject?.midtermWeight ?? "",
      attendanceWeight: subject?.attendanceWeight ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const weightsSum = useMemo(() => {
    const a = toIntOrNull(formData.attendanceWeight) ?? 0;
    const m = toIntOrNull(formData.midtermWeight) ?? 0;
    const f = toIntOrNull(formData.finalExamWeight) ?? 0;
    return a + m + f;
  }, [formData.attendanceWeight, formData.midtermWeight, formData.finalExamWeight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = normalizeCode(formData.code);
    const name = (formData.name || "").trim();
    if (!code || !name) return;

    const payload = {
      code,
      name,
      finalExamWeight: toIntOrNull(formData.finalExamWeight),
      midtermWeight: toIntOrNull(formData.midtermWeight),
      attendanceWeight: toIntOrNull(formData.attendanceWeight),
    };

    try {
      if (editing) {
        await updateSubject(editing.code, payload);
      } else {
        await createSubject(payload);
        setCurrentPage(1);
      }
      await refresh();
      closeModal();
    } catch (err) {
      alert(getErrorMessage(err, "Lưu môn học thất bại."));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubject(deleteTarget.code);
      setDeleteTarget(null);
      await refresh();
      if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      alert(getErrorMessage(err, "Xoá môn học thất bại."));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Môn học</h2>
          <p className="page-subtitle">Tạo / sửa / xoá môn học</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm môn
        </button>
      </div>

      <div className="table-toolbar" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <input
          className="search-input"
          placeholder="Tìm theo mã môn / tên môn..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <span className="result-count">
          {filtered.length} kết quả • Trang {currentPage}/{totalPages}
        </span>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã môn</th>
              <th>Tên môn</th>
              <th>Điểm danh</th>
              <th>Giữa kỳ</th>
              <th>Cuối kỳ</th>
              <th>Tổng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              paginated.map((s, idx) => {
                const sum = Number(s?.attendanceWeight || 0) + Number(s?.midtermWeight || 0) + Number(s?.finalExamWeight || 0);
                return (
                  <tr key={s.code}>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <code>{s.code}</code>
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>{s.name}</td>
                    <td>{s.attendanceWeight ?? 0}%</td>
                    <td>{s.midtermWeight ?? 0}%</td>
                    <td>{s.finalExamWeight ?? 0}%</td>
                    <td>
                      <span className={`badge ${sum === 100 ? "badge-green" : "badge-yellow"}`}>{sum}%</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEditModal(s)}>
                          Sửa
                        </button>
                        <button className="btn-delete" onClick={() => setDeleteTarget(s)}>
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

      <div style={{ marginTop: 16 }}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Cập nhật môn học" : "Thêm môn học"}</h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    Mã môn <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                    disabled={!!editing}
                    required
                    placeholder="VD: INT101"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Tên môn <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="VD: Nhập môn CNTT"
                  />
                </div>

                <div className="form-group">
                  <label>Điểm danh (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendanceWeight}
                    onChange={(e) => setFormData((p) => ({ ...p, attendanceWeight: e.target.value }))}
                    placeholder="VD: 10"
                  />
                </div>

                <div className="form-group">
                  <label>Giữa kỳ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.midtermWeight}
                    onChange={(e) => setFormData((p) => ({ ...p, midtermWeight: e.target.value }))}
                    placeholder="VD: 30"
                  />
                </div>

                <div className="form-group">
                  <label>Cuối kỳ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.finalExamWeight}
                    onChange={(e) => setFormData((p) => ({ ...p, finalExamWeight: e.target.value }))}
                    placeholder="VD: 60"
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="result-count">Tổng: {weightsSum}%</span>
                  {weightsSum === 100 ? (
                    <span className="badge badge-green">Hợp lệ</span>
                  ) : (
                    <span className="badge badge-yellow">Chưa đủ 100%</span>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary">
                  {editing ? "Lưu" : "Tạo mới"}
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
              <h3>⚠️ Xác nhận xoá</h3>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Bạn chắc chắn muốn xoá môn <strong>{deleteTarget.code}</strong>?
              </p>
              <div className="confirm-warning">
                Nếu môn học đã có lớp tín chỉ, backend có thể chặn xoá.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Huỷ
              </button>
              <button className="btn-delete-confirm" onClick={handleDelete}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

