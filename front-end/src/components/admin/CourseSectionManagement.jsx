import React, { useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

// Mock masters
const mockTerms = [
  { code: "2025-1", name: "HK1 2025-2026" },
  { code: "2025-2", name: "HK2 2025-2026" },
  { code: "2026-S", name: "Hè 2026" },
];

const mockMajors = [
  { code: "CNTT", name: "Công nghệ thông tin" },
  { code: "ATTT", name: "An toàn thông tin" },
  { code: "DTVT", name: "Điện tử viễn thông" },
];

const mockSubjects = [
  { code: "INT101", name: "Nhập môn CNTT" },
  { code: "PRJ101", name: "Lập trình cơ bản" },
  { code: "DBI101", name: "Cơ sở dữ liệu" },
  { code: "NET101", name: "Mạng máy tính" },
];

const mockTeachers = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

const initialCourseSections = [
  {
    code: "INT101-01",
    name: "INT101 - Lớp 01",
    termCode: "2025-1",
    majorCode: "CNTT",
    subjectCode: "INT101",
    teacherId: 1,
    maxStudents: 60,
    startDate: "2025-08-18",
    endDate: "2025-12-20",
  },
  {
    code: "PRJ101-02",
    name: "PRJ101 - Lớp 02",
    termCode: "2025-1",
    majorCode: "CNTT",
    subjectCode: "PRJ101",
    teacherId: 2,
    maxStudents: 55,
    startDate: "2025-08-18",
    endDate: "2025-12-20",
  },
  {
    code: "DBI101-01",
    name: "DBI101 - Lớp 01",
    termCode: "2025-2",
    majorCode: "ATTT",
    subjectCode: "DBI101",
    teacherId: 3,
    maxStudents: 50,
    startDate: "2026-01-12",
    endDate: "2026-05-10",
  },
];

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function formatDate(value) {
  return value ? value : "-";
}

function getNameByCode(list, code) {
  const found = list.find((x) => x.code === code);
  return found ? found.name : code || "-";
}

function getTeacherName(id) {
  const found = mockTeachers.find((t) => t.id === id);
  return found ? found.name : id ? `#${id}` : "-";
}

function getStatus(cs) {
  if (!cs.startDate || !cs.endDate) return { label: "Chưa cập nhật", className: "badge-yellow" };
  const today = new Date();
  const start = new Date(cs.startDate);
  const end = new Date(cs.endDate);
  if (today < start) return { label: "Sắp diễn ra", className: "badge-blue" };
  if (today > end) return { label: "Đã kết thúc", className: "badge-yellow" };
  return { label: "Đang diễn ra", className: "badge-green" };
}

export default function CourseSectionManagement() {
  const [courseSections, setCourseSections] = useState(initialCourseSections);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters (term-first UX)
  const [termFilter, setTermFilter] = useState(mockTerms[0]?.code || "");
  const [majorFilter, setMajorFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    termCode: "",
    majorCode: "",
    subjectCode: "",
    teacherId: "",
    maxStudents: "",
    startDate: "",
    endDate: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courseSections.filter((cs) => {
      if (termFilter && cs.termCode !== termFilter) return false;
      if (majorFilter && cs.majorCode !== majorFilter) return false;
      if (subjectFilter && cs.subjectCode !== subjectFilter) return false;
      if (!q) return true;
      return (
        cs.code.toLowerCase().includes(q) ||
        (cs.name || "").toLowerCase().includes(q) ||
        (cs.subjectCode || "").toLowerCase().includes(q)
      );
    });
  }, [courseSections, majorFilter, search, subjectFilter, termFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPaging = () => setCurrentPage(1);

  const onChangeTerm = (value) => {
    setTermFilter(value);
    resetPaging();
  };

  const onChangeMajor = (value) => {
    setMajorFilter(value);
    resetPaging();
  };

  const onChangeSubject = (value) => {
    setSubjectFilter(value);
    resetPaging();
  };

  const onSearch = (value) => {
    setSearch(value);
    resetPaging();
  };

  const openAddModal = () => {
    setEditing(null);
    setFormData({
      code: "",
      name: "",
      termCode: termFilter || "",
      majorCode: majorFilter || "",
      subjectCode: subjectFilter || "",
      teacherId: "",
      maxStudents: "",
      startDate: "",
      endDate: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cs) => {
    setEditing(cs);
    setFormData({
      code: cs.code,
      name: cs.name || "",
      termCode: cs.termCode || "",
      majorCode: cs.majorCode || "",
      subjectCode: cs.subjectCode || "",
      teacherId: cs.teacherId ?? "",
      maxStudents: cs.maxStudents ?? "",
      startDate: cs.startDate || "",
      endDate: cs.endDate || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = normalizeCode(formData.code);
    const name = (formData.name || "").trim();
    const termCode = (formData.termCode || "").trim();
    const majorCode = (formData.majorCode || "").trim();
    const subjectCode = (formData.subjectCode || "").trim();

    if (!code || !termCode || !majorCode || !subjectCode) return;
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) return;

    const teacherId = formData.teacherId === "" ? null : Number(formData.teacherId);
    const maxStudents = formData.maxStudents === "" ? null : Number(formData.maxStudents);

    if (!editing) {
      if (courseSections.some((x) => normalizeCode(x.code) === code)) return;
      const newItem = {
        code,
        name: name || code,
        termCode,
        majorCode,
        subjectCode,
        teacherId,
        maxStudents,
        startDate: formData.startDate || "",
        endDate: formData.endDate || "",
      };
      setCourseSections((prev) => [newItem, ...prev]);
      setTermFilter(termCode);
      setMajorFilter("");
      setSubjectFilter("");
      setSearch("");
      resetPaging();
      closeModal();
      return;
    }

    setCourseSections((prev) =>
      prev.map((x) =>
        x.code === editing.code
          ? {
              ...x,
              name: name || x.name,
              termCode,
              majorCode,
              subjectCode,
              teacherId,
              maxStudents,
              startDate: formData.startDate || "",
              endDate: formData.endDate || "",
            }
          : x
      )
    );
    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCourseSections((prev) => prev.filter((x) => x.code !== deleteTarget.code));
    setDeleteTarget(null);
    resetPaging();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Lớp tín chỉ</h2>
          <p className="page-subtitle">Tạo / sửa / xoá lớp tín chỉ (mock data, chưa kết nối BE)</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm lớp
        </button>
      </div>

      <div
        className="table-toolbar"
        style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
      >
        <select className="search-input" style={{ maxWidth: 220 }} value={termFilter} onChange={(e) => onChangeTerm(e.target.value)}>
          {mockTerms.map((t) => (
            <option key={t.code} value={t.code}>
              {t.code} — {t.name}
            </option>
          ))}
        </select>

        <select className="search-input" style={{ maxWidth: 220 }} value={majorFilter} onChange={(e) => onChangeMajor(e.target.value)}>
          <option value="">Tất cả ngành</option>
          {mockMajors.map((m) => (
            <option key={m.code} value={m.code}>
              {m.code} — {m.name}
            </option>
          ))}
        </select>

        <select className="search-input" style={{ maxWidth: 260 }} value={subjectFilter} onChange={(e) => onChangeSubject(e.target.value)}>
          <option value="">Tất cả môn</option>
          {mockSubjects.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} — {s.name}
            </option>
          ))}
        </select>

        <input
          className="search-input"
          placeholder="Tìm theo mã lớp / tên / mã môn..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />

        <div className="result-count">
          {filtered.length} kết quả • Trang {currentPage}/{totalPages}
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
              <th>Kỳ</th>
              <th>Ngành</th>
              <th>Môn</th>
              <th>Giảng viên</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: 18, color: "#64748b" }}>
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              paginated.map((cs) => {
                const status = getStatus(cs);
                return (
                  <tr key={cs.code}>
                    <td>
                      <code>{cs.code}</code>
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>{cs.name || "-"}</td>
                    <td><code>{cs.termCode}</code></td>
                    <td>{getNameByCode(mockMajors, cs.majorCode)}</td>
                    <td>{getNameByCode(mockSubjects, cs.subjectCode)}</td>
                    <td>{getTeacherName(cs.teacherId)}</td>
                    <td>
                      {formatDate(cs.startDate)} → {formatDate(cs.endDate)}
                    </td>
                    <td>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEditModal(cs)}>
                          Sửa
                        </button>
                        <button className="btn-delete" onClick={() => setDeleteTarget(cs)}>
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
              <h3>{editing ? "Cập nhật lớp tín chỉ" : "Thêm lớp tín chỉ"}</h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mã lớp *</label>
                  <input
                    type="text"
                    placeholder="VD: INT101-01"
                    value={formData.code}
                    disabled={!!editing}
                    onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Tên lớp</label>
                  <input
                    type="text"
                    placeholder="VD: INT101 - Lớp 01"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Kỳ học *</label>
                  <select value={formData.termCode} onChange={(e) => setFormData((p) => ({ ...p, termCode: e.target.value }))}>
                    {mockTerms.map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.code} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ngành *</label>
                  <select value={formData.majorCode} onChange={(e) => setFormData((p) => ({ ...p, majorCode: e.target.value }))}>
                    <option value="">-- Chọn ngành --</option>
                    {mockMajors.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.code} — {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Môn *</label>
                  <select value={formData.subjectCode} onChange={(e) => setFormData((p) => ({ ...p, subjectCode: e.target.value }))}>
                    <option value="">-- Chọn môn --</option>
                    {mockSubjects.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Giảng viên</label>
                  <select value={formData.teacherId} onChange={(e) => setFormData((p) => ({ ...p, teacherId: e.target.value }))}>
                    <option value="">(Chưa gán)</option>
                    {mockTeachers.map((t) => (
                      <option key={t.id} value={String(t.id)}>
                        #{t.id} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sĩ số tối đa</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="VD: 60"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData((p) => ({ ...p, maxStudents: e.target.value }))}
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
                  {editing ? "Lưu" : "Tạo mới"}
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
                Bạn chắc chắn muốn xoá lớp <code>{deleteTarget.code}</code>?
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

