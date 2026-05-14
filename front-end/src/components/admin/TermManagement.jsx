import React, { useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

const initialTerms = [
  { code: "2025-1", name: "Học kỳ 1 - Năm học 2025-2026", startDate: "2025-08-18", endDate: "2025-12-28" },
  { code: "2025-2", name: "Học kỳ 2 - Năm học 2025-2026", startDate: "2026-01-12", endDate: "2026-05-24" },
  { code: "2026-S", name: "Học kỳ hè 2026", startDate: "2026-06-08", endDate: "2026-08-02" },
  { code: "2024-2", name: "Học kỳ 2 - Năm học 2024-2025", startDate: "2025-01-13", endDate: "2025-05-25" },
  { code: "2024-1", name: "Học kỳ 1 - Năm học 2024-2025", startDate: "2024-08-19", endDate: "2024-12-29" },
];

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function formatDate(value) {
  if (!value) return "-";
  return value;
}

function getTermStatus(term) {
  const today = new Date();
  const start = term.startDate ? new Date(term.startDate) : null;
  const end = term.endDate ? new Date(term.endDate) : null;

  if (start && end) {
    if (today < start) return { label: "Sắp diễn ra", className: "badge-blue" };
    if (today > end) return { label: "Đã kết thúc", className: "badge-yellow" };
    return { label: "Đang diễn ra", className: "badge-green" };
  }
  return { label: "Chưa cập nhật", className: "badge-yellow" };
}

export default function TermManagement() {
  const [terms, setTerms] = useState(initialTerms);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [formData, setFormData] = useState({ code: "", name: "", startDate: "", endDate: "" });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) => t.code.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [terms, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingTerm(null);
    setFormData({ code: "", name: "", startDate: "", endDate: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (term) => {
    setEditingTerm(term);
    setFormData({
      code: term.code,
      name: term.name,
      startDate: term.startDate || "",
      endDate: term.endDate || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = normalizeCode(formData.code);
    const name = (formData.name || "").trim();
    if (!code || !name) return;

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) return;

    if (editingTerm) {
      setTerms((prev) =>
        prev.map((t) =>
          t.code === editingTerm.code
            ? { ...t, name, startDate: formData.startDate || "", endDate: formData.endDate || "" }
            : t
        )
      );
    } else {
      if (terms.some((t) => normalizeCode(t.code) === code)) return;
      const newTerm = {
        code,
        name,
        startDate: formData.startDate || "",
        endDate: formData.endDate || "",
      };
      setTerms((prev) => [newTerm, ...prev]);
      setCurrentPage(1);
    }

    closeModal();
  };

  const confirmDelete = (term) => setDeleteTarget(term);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setTerms((prev) => prev.filter((t) => t.code !== deleteTarget.code));
    setDeleteTarget(null);
    setCurrentPage(1);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Kỳ học</h2>
          <p className="page-subtitle">Tạo / sửa / xoá kỳ học (mock data, chưa kết nối BE)</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm kỳ học
        </button>
      </div>

      <div className="table-toolbar" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <input
          className="search-input"
          placeholder="Tìm theo mã hoặc tên kỳ học..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="result-count">
          {filtered.length} kết quả • Trang {currentPage}/{totalPages}
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã kỳ</th>
              <th>Tên kỳ học</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: 18, color: "#64748b" }}>
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              paginated.map((term) => {
                const status = getTermStatus(term);
                return (
                  <tr key={term.code}>
                    <td>
                      <code>{term.code}</code>
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>{term.name}</td>
                    <td>{formatDate(term.startDate)}</td>
                    <td>{formatDate(term.endDate)}</td>
                    <td>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEditModal(term)}>
                          Sửa
                        </button>
                        <button className="btn-delete" onClick={() => confirmDelete(term)}>
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
              <h3>{editingTerm ? "Cập nhật kỳ học" : "Thêm kỳ học"}</h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mã kỳ học *</label>
                  <input
                    type="text"
                    placeholder="VD: 2025-1"
                    value={formData.code}
                    disabled={!!editingTerm}
                    onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Tên kỳ học *</label>
                  <input
                    type="text"
                    placeholder="VD: Học kỳ 1 - Năm học 2025-2026"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary">
                  {editingTerm ? "Lưu" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận xoá</h3>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div>
                Bạn chắc chắn muốn xoá kỳ học <code>{deleteTarget.code}</code>?
              </div>
              <div style={{ color: "#64748b", fontSize: "0.92rem" }}>
                Thao tác này hiện chỉ xoá khỏi mock data trên UI.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Huỷ
              </button>
              <button className="btn-primary" onClick={handleDelete}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

