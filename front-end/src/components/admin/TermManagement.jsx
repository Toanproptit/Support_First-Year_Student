import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";
import { createTerm, deleteTerm, getAllTerms, updateTerm } from "../../service/terms";

const PAGE_SIZE = 8;

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function formatDate(value) {
  if (!value) return "-";
  return value;
}

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
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
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [formData, setFormData] = useState({ code: "", name: "", startDate: "", endDate: "" });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = async () => {
    const list = await getAllTerms();
    setTerms(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const list = await getAllTerms();
        if (cancelled) return;
        setTerms(list || []);
      } catch (e) {
        alert(getErrorMessage(e, "Không tải được danh sách kỳ học."));
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
    const q = search.trim().toLowerCase();
    if (!q) return terms;
    return (terms || []).filter((t) => t.code.toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = normalizeCode(formData.code);
    const name = (formData.name || "").trim();
    if (!code || !name) return;
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) return;

    try {
      if (editingTerm) {
        await updateTerm(editingTerm.code, {
          name,
          startDate: formData.startDate || "",
          endDate: formData.endDate || "",
        });
      } else {
        await createTerm({
          code,
          name,
          startDate: formData.startDate || "",
          endDate: formData.endDate || "",
        });
        setCurrentPage(1);
      }
      await refresh();
      closeModal();
    } catch (err) {
      alert(getErrorMessage(err, "Lưu kỳ học thất bại."));
    }
  };

  const confirmDelete = (term) => setDeleteTarget(term);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTerm(deleteTarget.code);
      setDeleteTarget(null);
      setCurrentPage(1);
      await refresh();
    } catch (err) {
      alert(getErrorMessage(err, "Xoá kỳ học thất bại."));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Kỳ học</h2>
          <p className="page-subtitle">Tạo / sửa / xoá kỳ học</p>
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
        <div className="result-count">{filtered.length} kết quả</div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã</th>
              <th>Tên kỳ học</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
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
                  Không có kỳ học nào.
                </td>
              </tr>
            ) : (
              paginated.map((term, idx) => {
                const status = getTermStatus(term);
                return (
                  <tr key={term.code}>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <code>{term.code}</code>
                    </td>
                    <td>
                      <strong>{term.name}</strong>
                    </td>
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

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

