import React, { useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 6;

const initialFaculties = [
  {
    id: 1,
    name: "Khoa Công nghệ Thông tin",
    code: "CNTT",
    description: "Đào tạo kỹ sư CNTT, lập trình viên, chuyên gia bảo mật...",
    majors: [
      { id: 1, name: "Kỹ thuật Phần mềm", code: "KTPM" },
      { id: 2, name: "Khoa học Máy tính", code: "KHMT" },
      { id: 3, name: "An toàn Thông tin", code: "ATTT" },
    ],
  },
  {
    id: 2,
    name: "Khoa Điện tử Viễn thông",
    code: "DTVT",
    description: "Đào tạo kỹ sư điện tử, viễn thông, IoT...",
    majors: [
      { id: 4, name: "Kỹ thuật Điện tử", code: "KTDT" },
      { id: 5, name: "Kỹ thuật Viễn thông", code: "KTVT" },
    ],
  },
  {
    id: 3,
    name: "Khoa Quản trị Kinh doanh",
    code: "QTKD",
    description: "Đào tạo cử nhân quản trị, kinh doanh, marketing...",
    majors: [
      { id: 6, name: "Quản trị Kinh doanh", code: "QTKD" },
      { id: 7, name: "Marketing", code: "MKT" },
    ],
  },
  {
    id: 4,
    name: "Khoa Kế toán",
    code: "KT",
    description: "Đào tạo cử nhân kế toán, kiểm toán, tài chính...",
    majors: [
      { id: 8, name: "Kế toán Doanh nghiệp", code: "KTDN" },
    ],
  },
  {
    id: 5,
    name: "Khoa Cơ bản",
    code: "CB",
    description: "Giảng dạy các môn học đại cương cho toàn trường",
    majors: [],
  },
];

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState(initialFaculties);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = faculties.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openAddModal = () => {
    setEditingFaculty(null);
    setFormData({ name: "", code: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({ name: faculty.name, code: faculty.code, description: faculty.description });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    if (editingFaculty) {
      setFaculties((prev) =>
        prev.map((f) =>
          f.id === editingFaculty.id ? { ...f, ...formData } : f
        )
      );
    } else {
      const newId = faculties.length > 0 ? Math.max(...faculties.map((f) => f.id)) + 1 : 1;
      setFaculties((prev) => [{ id: newId, ...formData, majors: [] }, ...prev]);
      setCurrentPage(1);
    }
    closeModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const confirmDelete = (faculty) => setDeleteTarget(faculty);

  const handleDelete = () => {
    setFaculties((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    if (expandedId === deleteTarget.id) setExpandedId(null);
    setDeleteTarget(null);
    if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="admin-page">
      {/* Header */}
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

      {/* Toolbar */}
      <div className="table-toolbar faculty-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tên khoa hoặc mã khoa..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      {/* Stats row */}
      <div className="faculty-stats-row">
        <div className="faculty-stat-chip">
          <span className="chip-icon">🏛️</span>
          <span>{faculties.length} Khoa</span>
        </div>
        <div className="faculty-stat-chip">
          <span className="chip-icon">📚</span>
          <span>
            {faculties.reduce((acc, f) => acc + f.majors.length, 0)} Ngành
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>#</th>
              <th>Tên khoa</th>
              <th>Mã khoa</th>
              <th>Số ngành</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  Không tìm thấy khoa nào.
                </td>
              </tr>
            ) : (
              paginated.map((faculty, idx) => (
                <React.Fragment key={faculty.id}>
                  <tr className={expandedId === faculty.id ? "row-expanded" : ""}>
                    <td>
                      <button
                        className={`expand-btn ${expandedId === faculty.id ? "open" : ""}`}
                        onClick={() => toggleExpand(faculty.id)}
                        title={expandedId === faculty.id ? "Thu gọn" : "Xem ngành"}
                      >
                        {expandedId === faculty.id ? "▾" : "▸"}
                      </button>
                    </td>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <strong className="faculty-name">{faculty.name}</strong>
                    </td>
                    <td>
                      <code className="faculty-code-badge">{faculty.code}</code>
                    </td>
                    <td>
                      <span className={`badge ${faculty.majors.length > 0 ? "badge-blue" : "badge-yellow"}`}>
                        {faculty.majors.length} ngành
                      </span>
                    </td>
                    <td className="desc-cell">{faculty.description || "—"}</td>
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

                  {/* Expanded majors row */}
                  {expandedId === faculty.id && (
                    <tr className="expanded-row">
                      <td colSpan={7}>
                        <div className="majors-expand-panel">
                          <div className="majors-expand-header">
                            <span>📚 Danh sách ngành thuộc <strong>{faculty.name}</strong></span>
                          </div>
                          {faculty.majors.length === 0 ? (
                            <p className="no-majors-text">Khoa này chưa có ngành nào.</p>
                          ) : (
                            <div className="major-chips-grid">
                              {faculty.majors.map((m) => (
                                <div className="major-chip" key={m.id}>
                                  <span className="major-chip-code">{m.code}</span>
                                  <span className="major-chip-name">{m.name}</span>
                                </div>
                              ))}
                            </div>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
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
                  <label>Tên khoa <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Vd: Khoa Công nghệ Thông tin"
                  />
                </div>
                <div className="form-group">
                  <label>Mã khoa <span className="required">*</span></label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="Vd: CNTT"
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn về khoa..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingFaculty ? "Lưu thay đổi" : "Thêm khoa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
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
                Bạn có chắc muốn xoá khoa{" "}
                <strong>"{deleteTarget.name}"</strong>?
              </p>
              {deleteTarget.majors.length > 0 && (
                <div className="confirm-warning">
                  ⚠️ Khoa này có <strong>{deleteTarget.majors.length} ngành</strong> đang thuộc về nó. Tất cả ngành cũng sẽ bị xoá!
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Hủy
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
