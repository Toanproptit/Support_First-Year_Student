import React, { useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 7;

const initialFaculties = [
  {
    id: 1,
    name: "Khoa Công nghệ Thông tin",
    code: "CNTT",
  },
  {
    id: 2,
    name: "Khoa Điện tử Viễn thông",
    code: "DTVT",
  },
  {
    id: 3,
    name: "Khoa Quản trị Kinh doanh",
    code: "QTKD",
  },
  {
    id: 4,
    name: "Khoa Kế toán",
    code: "KT",
  },
  {
    id: 5,
    name: "Khoa Cơ bản",
    code: "CB",
  },
];

const initialMajors = [
  { id: 1, name: "Kỹ thuật Phần mềm", code: "KTPM", description: "Thiết kế và phát triển phần mềm chất lượng cao", facultyId: 1 },
  { id: 2, name: "Khoa học Máy tính", code: "KHMT", description: "Nghiên cứu lý thuyết tính toán, thuật toán, AI", facultyId: 1 },
  { id: 3, name: "An toàn Thông tin", code: "ATTT", description: "Bảo mật hệ thống, mạng máy tính và dữ liệu", facultyId: 1 },
  { id: 4, name: "Kỹ thuật Điện tử", code: "KTDT", description: "Thiết kế mạch điện tử, vi điều khiển, nhúng", facultyId: 2 },
  { id: 5, name: "Kỹ thuật Viễn thông", code: "KTVT", description: "Truyền thông, mạng viễn thông, 5G", facultyId: 2 },
  { id: 6, name: "Quản trị Kinh doanh", code: "QTKD", description: "Quản lý doanh nghiệp, chiến lược kinh doanh", facultyId: 3 },
  { id: 7, name: "Marketing", code: "MKT", description: "Tiếp thị, truyền thông thương hiệu, digital marketing", facultyId: 3 },
  { id: 8, name: "Kế toán Doanh nghiệp", code: "KTDN", description: "Kế toán tài chính, kiểm toán, phân tích tài chính", facultyId: 4 },
];

export default function MajorManagement() {
  const [majors, setMajors] = useState(initialMajors);
  const [faculties] = useState(initialFaculties);
  const [search, setSearch] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    facultyId: "",
  });

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  const getFacultyName = (facultyId) => {
    const f = faculties.find((f) => f.id === facultyId);
    return f ? f.name : "—";
  };

  const getFacultyCode = (facultyId) => {
    const f = faculties.find((f) => f.id === facultyId);
    return f ? f.code : "—";
  };

  const filtered = majors.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase());
    const matchFaculty =
      filterFaculty === "all" || String(m.facultyId) === String(filterFaculty);
    return matchSearch && matchFaculty;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
    setFormData({ name: "", code: "", description: "", facultyId: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (major) => {
    setEditingMajor(major);
    setFormData({
      name: major.name,
      code: major.code,
      description: major.description,
      facultyId: major.facultyId,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.facultyId) return;

    const payload = {
      ...formData,
      facultyId: Number(formData.facultyId),
    };

    if (editingMajor) {
      setMajors((prev) =>
        prev.map((m) => (m.id === editingMajor.id ? { ...m, ...payload } : m))
      );
    } else {
      const newId = majors.length > 0 ? Math.max(...majors.map((m) => m.id)) + 1 : 1;
      setMajors((prev) => [{ id: newId, ...payload }, ...prev]);
      setCurrentPage(1);
    }
    closeModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const confirmDelete = (major) => setDeleteTarget(major);

  const handleDelete = () => {
    setMajors((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Color palette for faculty badges
  const facultyColors = [
    { bg: "#dbeafe", color: "#1d4ed8" },
    { bg: "#dcfce7", color: "#15803d" },
    { bg: "#fef9c3", color: "#b45309" },
    { bg: "#fce7f3", color: "#be185d" },
    { bg: "#ede9fe", color: "#6d28d9" },
  ];
  const getFacultyColor = (facultyId) => {
    const idx = faculties.findIndex((f) => f.id === facultyId);
    return facultyColors[idx % facultyColors.length] || facultyColors[0];
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Ngành</h2>
          <p className="page-subtitle">
            Danh sách ngành học — tổng <strong>{majors.length}</strong> ngành
            trong <strong>{faculties.length}</strong> khoa
          </p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm ngành mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar major-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tên ngành hoặc mã ngành..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterFaculty}
          onChange={(e) => handleFilterFaculty(e.target.value)}
        >
          <option value="all">Tất cả khoa</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      {/* Faculty quick filter chips */}
      <div className="faculty-filter-chips">
        <button
          className={`filter-chip ${filterFaculty === "all" ? "active" : ""}`}
          onClick={() => handleFilterFaculty("all")}
        >
          Tất cả
        </button>
        {faculties.map((f) => (
          <button
            key={f.id}
            className={`filter-chip ${String(filterFaculty) === String(f.id) ? "active" : ""}`}
            onClick={() => handleFilterFaculty(f.id)}
          >
            {f.code}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên ngành</th>
              <th>Mã ngành</th>
              <th>Khoa trực thuộc</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">
                  Không tìm thấy ngành nào.
                </td>
              </tr>
            ) : (
              paginated.map((major, idx) => {
                const clr = getFacultyColor(major.facultyId);
                return (
                  <tr key={major.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <strong>{major.name}</strong>
                    </td>
                    <td>
                      <code className="faculty-code-badge">{major.code}</code>
                    </td>
                    <td>
                      <span
                        className="faculty-tag"
                        style={{ background: clr.bg, color: clr.color }}
                      >
                        <span className="faculty-tag-code">
                          {getFacultyCode(major.facultyId)}
                        </span>
                        {getFacultyName(major.facultyId)}
                      </span>
                    </td>
                    <td className="desc-cell">
                      {major.description || "—"}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() => openEditModal(major)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDelete(major)}
                        >
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
              <h3>
                {editingMajor ? "✏️ Sửa thông tin ngành" : "📚 Thêm ngành mới"}
              </h3>
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
                    placeholder="Vd: Kỹ thuật Phần mềm"
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
                    required
                    placeholder="Vd: KTPM"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Khoa trực thuộc <span className="required">*</span>
                  </label>
                  <select
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn khoa --</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        [{f.code}] {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn về ngành học..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingMajor ? "Lưu thay đổi" : "Thêm ngành"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="modal-content modal-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>⚠️ Xác nhận xoá ngành</h3>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Bạn có chắc muốn xoá ngành{" "}
                <strong>"{deleteTarget.name}"</strong> khỏi hệ thống?
              </p>
              <div className="confirm-warning">
                Ngành này thuộc khoa:{" "}
                <strong>{getFacultyName(deleteTarget.facultyId)}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Hủy
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
