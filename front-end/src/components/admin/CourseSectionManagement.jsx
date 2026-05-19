import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";
import { getAllCourseSections, createCourseSection, updateCourseSection, deleteCourseSection } from "../../service/courseSections";
import { getAllTerms } from "../../service/terms";
import { getAllMajors } from "../../service/majors";
import { getAllSubjects } from "../../service/subjects";
import { getAllUsers } from "../../service/users";
import {
  getStudentsByCourseSection,
  registerCourseSection,
  unregisterStudentFromCourseSection,
} from "../../service/courseSectionRegistrations";

const PAGE_SIZE = 8;

function normalizeCode(value) {
  return (value || "").trim().toUpperCase();
}

function formatDate(value) {
  return value ? value : "-";
}

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

function getStatus(cs) {
  if (!cs?.startDate || !cs?.endDate) return { label: "Chưa cập nhật", className: "badge-yellow" };
  const today = new Date();
  const start = new Date(cs.startDate);
  const end = new Date(cs.endDate);
  if (today < start) return { label: "Sắp diễn ra", className: "badge-blue" };
  if (today > end) return { label: "Đã kết thúc", className: "badge-yellow" };
  return { label: "Đang diễn ra", className: "badge-green" };
}

export default function CourseSectionManagement() {
  const [loading, setLoading] = useState(false);
  const [courseSections, setCourseSections] = useState([]);
  const [terms, setTerms] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [termFilter, setTermFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

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

  const [assignTarget, setAssignTarget] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);

  const termByCode = useMemo(() => {
    const map = new Map();
    (terms || []).forEach((t) => map.set(t.code, t));
    return map;
  }, [terms]);

  const majorByCode = useMemo(() => {
    const map = new Map();
    (majors || []).forEach((m) => map.set(m.code, m));
    return map;
  }, [majors]);

  const subjectByCode = useMemo(() => {
    const map = new Map();
    (subjects || []).forEach((s) => map.set(s.code, s));
    return map;
  }, [subjects]);

  const userById = useMemo(() => {
    const map = new Map();
    (users || []).forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const teachers = useMemo(() => {
    return (users || []).filter((u) => String(u?.role || u?.Role || "") === "Teacher");
  }, [users]);

  const students = useMemo(() => {
    return (users || []).filter((u) => String(u?.role || u?.Role || "") === "Student");
  }, [users]);

  const resetPaging = () => setCurrentPage(1);

  const refreshCourseSections = async ({ termCode, majorCode, subjectCode } = {}) => {
    const list = await getAllCourseSections({
      termCode: termCode || undefined,
      majorCode: majorCode || undefined,
      subjectCode: subjectCode || undefined,
    });
    setCourseSections(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function loadMasters() {
      try {
        setLoading(true);
        const [tList, mList, sList, uList] = await Promise.all([
          getAllTerms(),
          getAllMajors(),
          getAllSubjects(),
          getAllUsers({ size: 100 }),
        ]);
        if (cancelled) return;
        setTerms(tList || []);
        setMajors(mList || []);
        setSubjects(sList || []);
        setUsers(uList || []);

        const defaultTerm = (tList || [])[0]?.code || "";
        setTermFilter((prev) => prev || defaultTerm);
      } catch (e) {
        alert(getErrorMessage(e, "Không tải được dữ liệu kỳ/ngành/môn/giảng viên."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMasters();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadCourseSections() {
      try {
        setLoading(true);
        await refreshCourseSections({
          termCode: termFilter || undefined,
          majorCode: majorFilter || undefined,
          subjectCode: subjectFilter || undefined,
        });
      } catch (e) {
        if (!cancelled) alert(getErrorMessage(e, "Không tải được danh sách lớp tín chỉ."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadCourseSections();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termFilter, majorFilter, subjectFilter]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (courseSections || []).filter((cs) => {
      if (termFilter && cs.termCode !== termFilter) return false;
      if (majorFilter && cs.majorCode !== majorFilter) return false;
      if (subjectFilter && cs.subjectCode !== subjectFilter) return false;
      if (!q) return true;
      const teacherName = String(cs?.teacherName || userById.get(cs.teacherId)?.fullName || "");
      const haystack = `${cs.code} ${cs.name || ""} ${cs.subjectCode || ""} ${teacherName}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [courseSections, majorFilter, search, subjectFilter, termFilter, userById]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const onChangeTerm = (value) => {
    setTermFilter(value);
    setMajorFilter("");
    setSubjectFilter("");
    setSearch("");
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
      teacherId: cs.teacherId == null ? "" : String(cs.teacherId),
      maxStudents: cs.maxStudents == null ? "" : String(cs.maxStudents),
      startDate: cs.startDate || "",
      endDate: cs.endDate || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = normalizeCode(formData.code);
    const name = (formData.name || "").trim();
    const termCode = normalizeCode(formData.termCode);
    const majorCode = normalizeCode(formData.majorCode);
    const subjectCode = normalizeCode(formData.subjectCode);
    if (!code || !termCode || !majorCode || !subjectCode) return;
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) return;

    const teacherId = formData.teacherId === "" ? null : Number(formData.teacherId);
    const maxStudents = formData.maxStudents === "" ? null : Number(formData.maxStudents);

    try {
      if (!editing) {
        await createCourseSection({
          code,
          name: name || null,
          termCode,
          majorCode,
          subjectCode,
          teacherId,
          maxStudents,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        });
        setTermFilter(termCode);
        setMajorFilter("");
        setSubjectFilter("");
        setSearch("");
        resetPaging();
      } else {
        await updateCourseSection(editing.code, {
          name: name || null,
          termCode,
          majorCode,
          subjectCode,
          teacherId,
          maxStudents,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        });
      }

      await refreshCourseSections({
        termCode: termFilter || undefined,
        majorCode: majorFilter || undefined,
        subjectCode: subjectFilter || undefined,
      });
      closeModal();
    } catch (err) {
      alert(getErrorMessage(err, "Lưu lớp tín chỉ thất bại."));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCourseSection(deleteTarget.code);
      setDeleteTarget(null);
      await refreshCourseSections({
        termCode: termFilter || undefined,
        majorCode: majorFilter || undefined,
        subjectCode: subjectFilter || undefined,
      });
      resetPaging();
    } catch (err) {
      alert(getErrorMessage(err, "Xoá lớp tín chỉ thất bại."));
    }
  };

  const termLabel = (code) => {
    const t = termByCode.get(code);
    return t ? `${t.code} — ${t.name || ""}` : code || "-";
  };
  const majorLabel = (code) => {
    const m = majorByCode.get(code);
    return m ? `${m.code} — ${m.name || ""}` : code || "-";
  };
  const subjectLabel = (code) => {
    const s = subjectByCode.get(code);
    return s ? `${s.code} — ${s.name || ""}` : code || "-";
  };
  const teacherLabel = (cs) => {
    if (cs?.teacherName) return cs.teacherName;
    const u = userById.get(cs?.teacherId);
    return u ? u.fullName : cs?.teacherId ? `#${cs.teacherId}` : "-";
  };

  const registeredStudentIds = useMemo(() => {
    const set = new Set();
    (registeredStudents || []).forEach((u) => {
      if (u?.id != null) set.add(u.id);
    });
    return set;
  }, [registeredStudents]);

  const openAssignModal = async (cs) => {
    setAssignTarget(cs);
    setAssignSearch("");
    setRegisteredStudents([]);
    setAssignLoading(true);
    try {
      const list = await getStudentsByCourseSection(cs.code);
      setRegisteredStudents(list || []);
    } catch (e) {
      alert(getErrorMessage(e, "Không tải được danh sách sinh viên của lớp."));
    } finally {
      setAssignLoading(false);
    }
  };

  const closeAssignModal = () => setAssignTarget(null);

  const refreshAssigned = async () => {
    if (!assignTarget?.code) return;
    const list = await getStudentsByCourseSection(assignTarget.code);
    setRegisteredStudents(list || []);
  };

  const handleAssign = async (user) => {
    if (!assignTarget?.code || !user?.id) return;
    try {
      await registerCourseSection({ courseSectionCode: assignTarget.code, userId: user.id });
      await refreshAssigned();
    } catch (e) {
      alert(getErrorMessage(e, "Thêm sinh viên vào lớp thất bại."));
    }
  };

  const handleUnassign = async (user) => {
    if (!assignTarget?.code || !user?.id) return;
    try {
      await unregisterStudentFromCourseSection(assignTarget.code, user.id);
      await refreshAssigned();
    } catch (e) {
      alert(getErrorMessage(e, "Bỏ sinh viên khỏi lớp thất bại."));
    }
  };

  const filteredStudentsForAssign = useMemo(() => {
    const q = (assignSearch || "").trim().toLowerCase();
    if (!q) return students || [];
    return (students || []).filter((u) => {
      const name = String(u?.fullName || "").toLowerCase();
      const mssv = String(u?.userName || u?.username || "").toLowerCase();
      const email = String(u?.email || "").toLowerCase();
      return name.includes(q) || mssv.includes(q) || email.includes(q);
    });
  }, [assignSearch, students]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Lớp tín chỉ</h2>
          <p className="page-subtitle">Tạo / sửa / xoá lớp tín chỉ</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm lớp
        </button>
      </div>

      <div className="table-toolbar" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <select className="search-input" style={{ maxWidth: 240 }} value={termFilter} onChange={(e) => onChangeTerm(e.target.value)}>
          {(terms || []).map((t) => (
            <option key={t.code} value={t.code}>
              {t.code} — {t.name}
            </option>
          ))}
        </select>

        <select className="search-input" style={{ maxWidth: 240 }} value={majorFilter} onChange={(e) => onChangeMajor(e.target.value)}>
          <option value="">Tất cả ngành</option>
          {(majors || []).map((m) => (
            <option key={m.code} value={m.code}>
              {m.code} — {m.name}
            </option>
          ))}
        </select>

        <select className="search-input" style={{ maxWidth: 280 }} value={subjectFilter} onChange={(e) => onChangeSubject(e.target.value)}>
          <option value="">Tất cả môn</option>
          {(subjects || []).map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} — {s.name}
            </option>
          ))}
        </select>

        <input className="search-input" placeholder="Tìm theo mã lớp / tên / mã môn / giảng viên..." value={search} onChange={(e) => onSearch(e.target.value)} />

        <div className="result-count">{filtered.length} kết quả • Trang {currentPage}/{totalPages}</div>
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
            {loading ? (
              <tr>
                <td colSpan="9" style={{ padding: 18, color: "#64748b" }}>
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
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
                    <td>{termLabel(cs.termCode)}</td>
                    <td>{majorLabel(cs.majorCode)}</td>
                    <td>{subjectLabel(cs.subjectCode)}</td>
                    <td>{teacherLabel(cs)}</td>
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
                        <button className="btn-edit" onClick={() => openAssignModal(cs)}>
                          Sinh viên
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
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
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
                    required
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
                  <label>Kỳ *</label>
                  <select value={formData.termCode} onChange={(e) => setFormData((p) => ({ ...p, termCode: e.target.value }))} required>
                    <option value="">-- Chọn kỳ --</option>
                    {(terms || []).map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.code} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ngành *</label>
                  <select value={formData.majorCode} onChange={(e) => setFormData((p) => ({ ...p, majorCode: e.target.value }))} required>
                    <option value="">-- Chọn ngành --</option>
                    {(majors || []).map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.code} — {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Môn *</label>
                  <select value={formData.subjectCode} onChange={(e) => setFormData((p) => ({ ...p, subjectCode: e.target.value }))} required>
                    <option value="">-- Chọn môn --</option>
                    {(subjects || []).map((s) => (
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
                    {(teachers || []).map((u) => (
                      <option key={u.id} value={String(u.id)}>
                        #{u.id} — {u.fullName}
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
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))} />
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
                Bạn chắc chắn muốn xoá lớp <strong>{deleteTarget.code}</strong>?
              </p>
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

      {assignTarget && (
        <div className="modal-overlay" onClick={closeAssignModal}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gán sinh viên vào lớp {assignTarget.code}</h3>
              <button className="btn-close" onClick={closeAssignModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Tìm sinh viên</label>
                <input
                  type="text"
                  placeholder="Tìm theo tên / MSSV / email..."
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div className="result-count">
                    Đã gán: {registeredStudents.length} • Tổng SV: {filteredStudentsForAssign.length}
                  </div>
                  {assignLoading ? <div className="result-count">Đang tải...</div> : null}
                </div>

                <div style={{ width: "100%", overflowX: "auto", marginTop: 12 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: 80 }}>ID</th>
                        <th>Họ tên</th>
                        <th>MSSV</th>
                        <th>Email</th>
                        <th style={{ width: 160 }}>Trạng thái</th>
                        <th style={{ width: 160 }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudentsForAssign.slice(0, 50).map((u) => {
                        const isRegistered = registeredStudentIds.has(u.id);
                        return (
                          <tr key={u.id}>
                            <td>
                              <code>{u.id}</code>
                            </td>
                            <td style={{ fontWeight: 700, color: "#0f172a" }}>{u.fullName}</td>
                            <td>
                              <code>{u.userName || u.username || "-"}</code>
                            </td>
                            <td>{u.email || "-"}</td>
                            <td>
                              <span className={`badge ${isRegistered ? "badge-green" : "badge-yellow"}`}>
                                {isRegistered ? "Đã gán" : "Chưa gán"}
                              </span>
                            </td>
                            <td>
                              {isRegistered ? (
                                <button className="btn-delete" onClick={() => handleUnassign(u)}>
                                  Bỏ
                                </button>
                              ) : (
                                <button className="btn-edit" onClick={() => handleAssign(u)}>
                                  Thêm
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStudentsForAssign.length > 50 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: 14, color: "#64748b" }}>
                            Đang hiển thị 50 sinh viên đầu tiên. Hãy dùng ô tìm kiếm để lọc.
                          </td>
                        </tr>
                      ) : null}
                      {filteredStudentsForAssign.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: 14, color: "#64748b" }}>
                            Không có sinh viên phù hợp.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={closeAssignModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
