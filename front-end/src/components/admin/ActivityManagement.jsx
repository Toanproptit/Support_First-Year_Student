import React, { useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/ActivityManagement.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 6;

const ALL_STAFF = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nv@ptit.edu.vn", department: "CNTT" },
  { id: 2, name: "Trần Thị Bình", email: "binh.tt@ptit.edu.vn", department: "DTVT" },
  { id: 3, name: "Lê Minh Cường", email: "cuong.lm@ptit.edu.vn", department: "QTKD" },
  { id: 4, name: "Phạm Thu Hà", email: "ha.pt@ptit.edu.vn", department: "CNTT" },
  { id: 5, name: "Hoàng Đức Long", email: "long.hd@ptit.edu.vn", department: "KT" },
  { id: 6, name: "Đỗ Thanh Mai", email: "mai.dt@ptit.edu.vn", department: "DTVT" },
  { id: 7, name: "Vũ Quốc Nam", email: "nam.vq@ptit.edu.vn", department: "CNTT" },
  { id: 8, name: "Bùi Thị Oanh", email: "oanh.bt@ptit.edu.vn", department: "QTKD" },
];

const STATUS_CONFIG = {
  upcoming: { label: "Sắp diễn ra", className: "badge-blue" },
  ongoing: { label: "Đang diễn ra", className: "badge-green" },
  completed: { label: "Đã kết thúc", className: "badge-yellow" },
  cancelled: { label: "Đã hủy", className: "badge-red" },
};

const initialActivities = [
  {
    id: 1,
    name: "Ngày hội Tân sinh viên 2025",
    location: "Sân vận động PTIT",
    startTime: "2025-09-15T08:00",
    endTime: "2025-09-15T17:00",
    status: "completed",
    description: "Hoạt động chào đón tân sinh viên nhập học năm 2025 với nhiều trò chơi và hoạt động vui vẻ.",
    participantIds: [1, 2, 4, 7],
  },
  {
    id: 2,
    name: "Hội thảo Hướng nghiệp CNTT",
    location: "Hội trường A1",
    startTime: "2025-10-20T13:30",
    endTime: "2025-10-20T17:00",
    status: "completed",
    description: "Kết nối sinh viên với doanh nghiệp, định hướng nghề nghiệp ngành CNTT.",
    participantIds: [1, 3, 5],
  },
  {
    id: 3,
    name: "Giải thể thao Xuân 2026",
    location: "Nhà thi đấu PTIT",
    startTime: "2026-01-10T07:30",
    endTime: "2026-01-12T17:00",
    status: "ongoing",
    description: "Giải đấu thể thao truyền thống mừng xuân mới với nhiều bộ môn hấp dẫn.",
    participantIds: [2, 4, 6, 8],
  },
  {
    id: 4,
    name: "Workshop Kỹ năng mềm",
    location: "Phòng học B301",
    startTime: "2026-05-15T09:00",
    endTime: "2026-05-15T12:00",
    status: "upcoming",
    description: "Rèn luyện kỹ năng giao tiếp, thuyết trình và làm việc nhóm cho sinh viên.",
    participantIds: [3, 5, 7],
  },
  {
    id: 5,
    name: "Hiến máu nhân đạo",
    location: "Sảnh tòa nhà C",
    startTime: "2026-06-01T07:00",
    endTime: "2026-06-01T11:30",
    status: "upcoming",
    description: "Chương trình hiến máu tình nguyện vì cộng đồng.",
    participantIds: [1, 6, 8],
  },
];

function formatDateTime(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name) {
  return name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase();
}

const AVATAR_COLORS = ["#c8102e", "#2563eb", "#16a34a", "#b45309", "#6d28d9", "#be185d", "#0891b2", "#ea580c"];

export default function ActivityManagement() {
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Views: "list" | "detail"
  const [view, setView] = useState("list");
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);

  const emptyForm = { name: "", location: "", startTime: "", endTime: "", status: "upcoming", description: "" };
  const [formData, setFormData] = useState(emptyForm);

  // --- Filtering ---
  const filtered = activities.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // --- Handlers ---
  const handleSearch = v => { setSearch(v); setCurrentPage(1); };
  const handleFilterStatus = v => { setFilterStatus(v); setCurrentPage(1); };

  const openDetail = (activity) => {
    setSelectedActivity(activities.find(a => a.id === activity.id));
    setView("detail");
  };

  const backToList = () => { setView("list"); setSelectedActivity(null); };

  const openAdd = () => { setEditingActivity(null); setFormData(emptyForm); setIsFormOpen(true); };
  const openEdit = (a) => { setEditingActivity(a); setFormData({ name: a.name, location: a.location, startTime: a.startTime, endTime: a.endTime, status: a.status, description: a.description }); setIsFormOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (editingActivity) {
      setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...a, ...formData } : a));
      if (selectedActivity?.id === editingActivity.id) setSelectedActivity(prev => ({ ...prev, ...formData }));
    } else {
      const newId = Math.max(...activities.map(a => a.id)) + 1;
      setActivities(prev => [{ id: newId, ...formData, participantIds: [] }, ...prev]);
      setCurrentPage(1);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    setActivities(prev => prev.filter(a => a.id !== deleteTarget.id));
    if (view === "detail") backToList();
    setDeleteTarget(null);
  };

  const removeParticipant = (staffId) => {
    setActivities(prev => prev.map(a =>
      a.id === selectedActivity.id ? { ...a, participantIds: a.participantIds.filter(id => id !== staffId) } : a
    ));
    setSelectedActivity(prev => ({ ...prev, participantIds: prev.participantIds.filter(id => id !== staffId) }));
  };

  const addParticipant = (staffId) => {
    setActivities(prev => prev.map(a =>
      a.id === selectedActivity.id ? { ...a, participantIds: [...a.participantIds, staffId] } : a
    ));
    setSelectedActivity(prev => ({ ...prev, participantIds: [...prev.participantIds, staffId] }));
  };

  const notJoined = ALL_STAFF.filter(s => !selectedActivity?.participantIds.includes(s.id));

  // ===================== DETAIL VIEW =====================
  if (view === "detail" && selectedActivity) {
    const participants = ALL_STAFF.filter(s => selectedActivity.participantIds.includes(s.id));
    const cfg = STATUS_CONFIG[selectedActivity.status];
    return (
      <div className="admin-page">
        {/* Back button */}
        <button className="btn-back" onClick={backToList}>
          ← Quay lại danh sách
        </button>

        <div className="detail-layout">
          {/* LEFT: Info card */}
          <div className="detail-info-card">
            <div className="detail-header-banner">
              <span className="detail-banner-icon">🎯</span>
            </div>
            <div className="detail-info-body">
              <div className="detail-title-row">
                <h2 className="detail-title">{selectedActivity.name}</h2>
                <span className={`badge ${cfg.className}`}>{cfg.label}</span>
              </div>
              <div className="detail-meta-list">
                <div className="detail-meta-item">
                  <span className="meta-icon">📍</span>
                  <div><span className="meta-label">Địa điểm</span><span className="meta-value">{selectedActivity.location}</span></div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">🕐</span>
                  <div><span className="meta-label">Bắt đầu</span><span className="meta-value">{formatDateTime(selectedActivity.startTime)}</span></div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">🕔</span>
                  <div><span className="meta-label">Kết thúc</span><span className="meta-value">{formatDateTime(selectedActivity.endTime)}</span></div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">👥</span>
                  <div><span className="meta-label">Tham gia</span><span className="meta-value">{participants.length} nhân viên</span></div>
                </div>
              </div>
              {selectedActivity.description && (
                <div className="detail-description">
                  <p className="meta-label">Mô tả</p>
                  <p className="desc-text">{selectedActivity.description}</p>
                </div>
              )}
              <div className="detail-action-row">
                <button className="btn-edit" onClick={() => openEdit(selectedActivity)}>✏️ Sửa</button>
                <button className="btn-delete" onClick={() => setDeleteTarget(selectedActivity)}>🗑 Xoá</button>
              </div>
            </div>
          </div>

          {/* RIGHT: Participants */}
          <div className="detail-participants-card">
            <div className="participants-header">
              <div>
                <h3 className="participants-title">Nhân viên tham gia</h3>
                <p className="participants-subtitle">{participants.length} / {ALL_STAFF.length} nhân viên</p>
              </div>
              <button className="btn-primary btn-sm" onClick={() => setIsAddParticipantOpen(true)}>
                + Thêm
              </button>
            </div>

            {participants.length === 0 ? (
              <div className="no-participants">
                <span className="no-participants-icon">👤</span>
                <p>Chưa có nhân viên nào tham gia</p>
                <button className="btn-primary btn-sm" onClick={() => setIsAddParticipantOpen(true)}>
                  Thêm nhân viên
                </button>
              </div>
            ) : (
              <div className="participants-list">
                {participants.map((s, i) => (
                  <div className="participant-item" key={s.id}>
                    <div className="participant-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {getInitials(s.name)}
                    </div>
                    <div className="participant-info">
                      <strong>{s.name}</strong>
                      <span>{s.email}</span>
                      <code>{s.department}</code>
                    </div>
                    <button
                      className="btn-remove-participant"
                      title="Xoá khỏi danh sách"
                      onClick={() => removeParticipant(s.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Participant Modal */}
        {isAddParticipantOpen && (
          <div className="modal-overlay" onClick={() => setIsAddParticipantOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>➕ Thêm nhân viên tham gia</h3>
                <button className="btn-close" onClick={() => setIsAddParticipantOpen(false)}>&times;</button>
              </div>
              <div className="modal-body" style={{ padding: "12px 24px" }}>
                {notJoined.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", padding: "24px 0" }}>
                    Tất cả nhân viên đã tham gia hoạt động này.
                  </p>
                ) : (
                  <div className="add-participant-list">
                    {notJoined.map((s, i) => (
                      <div className="add-participant-item" key={s.id}>
                        <div className="participant-avatar small" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                          {getInitials(s.name)}
                        </div>
                        <div className="participant-info">
                          <strong>{s.name}</strong>
                          <span>{s.department}</span>
                        </div>
                        <button
                          className="btn-add-participant"
                          onClick={() => { addParticipant(s.id); }}
                        >
                          + Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setIsAddParticipantOpen(false)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {isFormOpen && <ActivityFormModal formData={formData} setFormData={setFormData} editing={editingActivity} onSubmit={handleSubmit} onClose={() => setIsFormOpen(false)} />}

        {/* Delete confirm */}
        {deleteTarget && <DeleteConfirmModal target={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
      </div>
    );
  }

  // ===================== LIST VIEW =====================
  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Hoạt động Ngoại khóa</h2>
          <p className="page-subtitle">Tổng <strong>{activities.length}</strong> hoạt động trong hệ thống</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Thêm hoạt động</button>
      </div>

      {/* Status summary chips */}
      <div className="activity-summary-row">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div className="activity-summary-chip" key={key}>
            <span className={`badge ${cfg.className}`}>{cfg.label}</span>
            <span className="chip-count">{activities.filter(a => a.status === key).length}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="table-toolbar" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tên hoạt động hoặc địa điểm..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
        <select className="filter-select" value={filterStatus} onChange={e => handleFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      {/* Activity Cards Grid */}
      {paginated.length === 0 ? (
        <div className="empty-activities">
          <span>🎯</span>
          <p>Không tìm thấy hoạt động nào.</p>
        </div>
      ) : (
        <div className="activity-grid">
          {paginated.map((activity) => {
            const cfg = STATUS_CONFIG[activity.status];
            const participants = ALL_STAFF.filter(s => activity.participantIds.includes(s.id));
            return (
              <div className="activity-card" key={activity.id}>
                <div className="activity-card-top">
                  <span className={`badge ${cfg.className}`}>{cfg.label}</span>
                  <div className="activity-card-actions">
                    <button className="btn-edit btn-xs" onClick={() => openEdit(activity)}>Sửa</button>
                    <button className="btn-delete btn-xs" onClick={() => setDeleteTarget(activity)}>Xoá</button>
                  </div>
                </div>
                <h3 className="activity-card-title">{activity.name}</h3>
                <div className="activity-card-meta">
                  <span>📍 {activity.location}</span>
                  <span>🕐 {formatDateTime(activity.startTime)}</span>
                  <span>🕔 {formatDateTime(activity.endTime)}</span>
                </div>
                {activity.description && (
                  <p className="activity-card-desc">{activity.description}</p>
                )}
                <div className="activity-card-footer">
                  <div className="participant-avatars">
                    {participants.slice(0, 4).map((s, i) => (
                      <div
                        key={s.id}
                        className="mini-avatar"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], zIndex: 10 - i }}
                        title={s.name}
                      >
                        {getInitials(s.name)}
                      </div>
                    ))}
                    {participants.length > 4 && (
                      <div className="mini-avatar mini-avatar-more">+{participants.length - 4}</div>
                    )}
                    <span className="participant-count-label">
                      {participants.length === 0 ? "Chưa có ai" : `${participants.length} nhân viên`}
                    </span>
                  </div>
                  <button className="btn-detail" onClick={() => openDetail(activity)}>
                    Chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {isFormOpen && <ActivityFormModal formData={formData} setFormData={setFormData} editing={editingActivity} onSubmit={handleSubmit} onClose={() => setIsFormOpen(false)} />}
      {deleteTarget && <DeleteConfirmModal target={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ============================
// Sub-components
// ============================
function ActivityFormModal({ formData, setFormData, editing, onSubmit, onClose }) {
  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editing ? "✏️ Sửa hoạt động" : "🎯 Thêm hoạt động mới"}</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tên hoạt động <span className="required">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Vd: Ngày hội Tân sinh viên..." />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Thời gian bắt đầu <span className="required">*</span></label>
                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Thời gian kết thúc <span className="required">*</span></label>
                <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Địa điểm <span className="required">*</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Vd: Hội trường A1" />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Mô tả ngắn về hoạt động..." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">{editing ? "Lưu thay đổi" : "Tạo hoạt động"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ target, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚠️ Xác nhận xoá</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p className="confirm-text">Bạn có chắc muốn xoá hoạt động <strong>"{target.name}"</strong>?</p>
          <div className="confirm-warning">Hành động này không thể khôi phục.</div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn-delete-confirm" onClick={onConfirm}>Xoá hoạt động</button>
        </div>
      </div>
    </div>
  );
}
