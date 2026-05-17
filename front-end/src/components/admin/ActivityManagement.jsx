import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/ActivityManagement.css";
import Pagination from "./Pagination";
import { createActivity, deleteActivity, getAllActivities, updateActivity } from "../../service/activities";
import { approveCancelParticipation, createParticipation, deleteParticipation, rejectCancelParticipation, setParticipationLead, unsetParticipationLead } from "../../service/participations";
import { getUsersPaged } from "../../service/users";
import { useToast } from "../ToastProvider";

const PAGE_SIZE = 6;

const STATUS_CONFIG = {
  upcoming: { label: "Sắp diễn ra", className: "badge-blue" },
  ongoing: { label: "Đang diễn ra", className: "badge-green" },
  completed: { label: "Đã kết thúc", className: "badge-yellow" },
  cancelled: { label: "Đã hủy", className: "badge-red" },
};

const initialActivities = [];

function formatDateTime(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name) {
  return name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase();
}

const AVATAR_COLORS = ["#c8102e", "#2563eb", "#16a34a", "#b45309", "#6d28d9", "#be185d", "#0891b2", "#ea580c"];

function toDatetimeLocal(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toUiActivity(a) {
  const participations = Array.isArray(a?.participations) ? a.participations : [];
  const qRaw = a?.studentQuantity;
  const q = qRaw == null ? null : Number(qRaw);
  return {
    id: a?.id,
    name: a?.name || "",
    location: a?.address || "",
    startTime: toDatetimeLocal(a?.startDate),
    endTime: toDatetimeLocal(a?.endDate),
    status: String(a?.status || "UPCOMING").toLowerCase(),
    description: a?.description || "",
    studentQuantity: Number.isFinite(q) && q > 0 ? q : null,
    participations,
    participantIds: participations.map((p) => p?.userId).filter((v) => v != null),
    participantCount: a?.participantCount ?? participations.length,
  };
}

function toApiStatus(status) {
  return String(status || "UPCOMING").toUpperCase();
}

function toApiDate(dtLocal) {
  if (!dtLocal) return null;
  const t = new Date(dtLocal).getTime();
  return Number.isNaN(t) ? null : t;
}

export default function ActivityManagement() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [capacityNotice, setCapacityNotice] = useState("");
  const toast = useToast();

  // Views: "list" | "detail"
  const [view, setView] = useState("list");
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [cancelReviewModal, setCancelReviewModal] = useState({
    open: false,
    action: "approve", // "approve" | "reject"
    participationId: null,
    studentName: "",
    reason: "",
    note: "",
  });

  const emptyForm = { name: "", location: "", startTime: "", endTime: "", status: "upcoming", description: "", studentQuantity: "" };
  const [formData, setFormData] = useState(emptyForm);

  const usersById = useMemo(() => {
    const map = new Map();
    (users || []).forEach((u) => {
      if (u?.id != null) map.set(u.id, u);
    });
    return map;
  }, [users]);

  const refreshActivities = async () => {
    const res = await getAllActivities();
    const mapped = (res || []).map(toUiActivity);
    setActivities(mapped);
    return mapped;
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [acts, usersPage] = await Promise.all([getAllActivities(), getUsersPaged({ page: 0, size: 100 })]);
        if (cancelled) return;
        setActivities((acts || []).map(toUiActivity));
        setUsers(usersPage?.results ?? []);
      } catch (e) {
        if (!cancelled) {
          setActivities(initialActivities);
          toast.show({
            type: "error",
            title: "Tải thất bại",
            message: e?.response?.data?.message || e?.message || "Không tải được danh sách hoạt động.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

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
  const openEdit = (a) => {
    setEditingActivity(a);
    setFormData({
      name: a.name,
      location: a.location,
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
      description: a.description,
      studentQuantity: a.studentQuantity ?? "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name,
      startDate: toApiDate(formData.startTime),
      endDate: toApiDate(formData.endTime),
      address: formData.location,
      status: toApiStatus(formData.status),
      description: formData.description,
      studentQuantity: formData.studentQuantity === "" || formData.studentQuantity == null
        ? null
        : Number(formData.studentQuantity),
    };

    try {
      setLoading(true);
      if (editingActivity) {
        const updated = await updateActivity(editingActivity.id, payload);
        const ui = toUiActivity(updated);
        setActivities((prev) => (prev || []).map((a) => (a.id === editingActivity.id ? ui : a)));
        if (selectedActivity?.id === editingActivity.id) setSelectedActivity(ui);
      } else {
        const created = await createActivity(payload);
        const ui = toUiActivity(created);
        setActivities((prev) => [ui, ...(prev || [])]);
        setCurrentPage(1);
      }
      setIsFormOpen(false);
    } catch (e2) {
      toast.show({
        type: "error",
        title: "Lưu thất bại",
        message: e2?.response?.data?.message || e2?.message || "Lưu hoạt động thất bại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      setLoading(true);
      await deleteActivity(deleteTarget.id);
      setActivities((prev) => (prev || []).filter((a) => a.id !== deleteTarget.id));
      if (view === "detail") backToList();
      setDeleteTarget(null);
    } catch (e) {
      toast.show({
        type: "error",
        title: "Xoá thất bại",
        message: e?.response?.data?.message || e?.message || "Xoá hoạt động thất bại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeParticipant = async (userId) => {
    if (!selectedActivity?.id || userId == null) return;
    const activityId = selectedActivity.id;

    const nextSelected = {
      ...selectedActivity,
      participantIds: (selectedActivity.participantIds || []).filter((id) => id !== userId),
      participations: (selectedActivity.participations || []).filter((p) => p?.userId !== userId),
      participantCount: Math.max(0, Number(selectedActivity.participantCount ?? (selectedActivity.participantIds || []).length) - 1),
    };

    setSelectedActivity(nextSelected);
    setActivities((prev) => (prev || []).map((a) => (a.id === activityId ? nextSelected : a)));
    setCapacityNotice("");

    try {
      setLoading(true);
      await deleteParticipation({ userId, activityId });
    } catch (e) {
      toast.show({
        type: "error",
        title: "Xoá thất bại",
        message: e?.response?.data?.message || e?.message || "Xoá người tham gia thất bại.",
      });
      const mapped = await refreshActivities();
      setSelectedActivity((prev) => (prev?.id ? mapped.find((a) => a.id === prev.id) ?? prev : prev));
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (userId) => {
    if (!selectedActivity?.id || userId == null) return;
    const activityId = selectedActivity.id;

    const limit = selectedActivity.studentQuantity;
    const current = (selectedActivity.participantIds || []).length;
    if (limit != null && current >= limit) {
      const msg = `Hoạt động đã đạt giới hạn (${current}/${limit} SV).`;
      setCapacityNotice(msg);
      toast.show({ type: "warning", title: "Đã đủ số lượng", message: msg });
      return;
    }

    try {
      setLoading(true);
      const created = await createParticipation({ userId, activityId, role: "PARTICIPANT" });
      const nextSelected = {
        ...selectedActivity,
        participantIds: Array.from(new Set([...(selectedActivity.participantIds || []), userId])),
        participations: [...(selectedActivity.participations || []), created].filter(Boolean),
        participantCount: Number(selectedActivity.participantCount ?? (selectedActivity.participantIds || []).length) + 1,
      };
      setSelectedActivity(nextSelected);
      setActivities((prev) => (prev || []).map((a) => (a.id === activityId ? nextSelected : a)));

      const limit = nextSelected.studentQuantity;
      const current = (nextSelected.participantIds || []).length;
      if (limit != null && current >= limit) {
        setCapacityNotice(`Hoạt động đã đạt giới hạn (${current}/${limit} SV).`);
      }

      toast.show({ type: "success", title: "Thành công", message: "Thêm sinh viên thành công." });
    } catch (e) {
      toast.show({
        type: "error",
        title: "Thêm thất bại",
        message: e?.response?.data?.message || e?.message || "Thêm người tham gia thất bại.",
      });
      await refreshActivities();
    } finally {
      setLoading(false);
    }
  };

  const notJoined = (users || []).filter((u) => u?.id != null && !(selectedActivity?.participantIds || []).includes(u.id));
  const isSelectedAtCapacity = selectedActivity?.studentQuantity != null
    && (selectedActivity?.participantIds || []).length >= selectedActivity.studentQuantity;

  useEffect(() => {
    if (!selectedActivity) {
      setCapacityNotice("");
      return;
    }
    const limit = selectedActivity.studentQuantity;
    const current = (selectedActivity.participantIds || []).length;
    if (limit != null && current >= limit) {
      setCapacityNotice(`Hoạt động đã đạt giới hạn (${current}/${limit} SV).`);
    } else {
      setCapacityNotice("");
    }
  }, [selectedActivity]);

  const toggleLead = async (participationId, nextIsLead) => {
    if (!participationId) return;
    try {
      setLoading(true);
      const updated = nextIsLead ? await setParticipationLead(participationId) : await unsetParticipationLead(participationId);
      const role = updated?.role || (nextIsLead ? "LEAD" : "PARTICIPANT");

      const nextSelected = {
        ...selectedActivity,
        participations: (selectedActivity.participations || []).map((p) =>
          p?.id === participationId ? { ...p, role } : p
        ),
      };
      setSelectedActivity(nextSelected);
      setActivities((prev) => (prev || []).map((a) => (a.id === nextSelected.id ? nextSelected : a)));
    } catch (e) {
      toast.show({
        type: "error",
        title: "Cập nhật thất bại",
        message: e?.response?.data?.message || e?.message || "Cập nhật vai trò thất bại.",
      });
      await refreshActivities();
    } finally {
      setLoading(false);
    }
  };

  const openCancelReviewModal = ({ action, participationId, studentName, reason } = {}) => {
    if (!participationId) return;
    setCancelReviewModal({
      open: true,
      action: action === "reject" ? "reject" : "approve",
      participationId,
      studentName: studentName || "",
      reason: reason || "",
      note: "",
    });
  };

  const closeCancelReviewModal = () => {
    setCancelReviewModal({
      open: false,
      action: "approve",
      participationId: null,
      studentName: "",
      reason: "",
      note: "",
    });
  };

  const submitCancelReview = async () => {
    const { participationId, action, note } = cancelReviewModal || {};
    if (!participationId) return;

    try {
      setLoading(true);
      if (action === "reject") {
        await rejectCancelParticipation(participationId, { note });
        toast.show({ type: "success", title: "Thành công", message: "Đã từ chối yêu cầu hủy." });
      } else {
        await approveCancelParticipation(participationId, { note });
        toast.show({ type: "success", title: "Thành công", message: "Đã duyệt hủy đăng ký." });
      }
      closeCancelReviewModal();
      const mapped = await refreshActivities();
      setSelectedActivity((prev) => (prev?.id ? mapped.find((a) => a.id === prev.id) ?? prev : prev));
    } catch (e) {
      toast.show({
        type: "error",
        title: "Thất bại",
        message: e?.response?.data?.message || e?.message || "Không thể xử lý yêu cầu.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ===================== DETAIL VIEW =====================
  if (view === "detail" && selectedActivity) {
    const participants = (selectedActivity.participations || []).map((p) => {
      const u = usersById.get(p?.userId);
      return {
        id: p?.userId,
        participationId: p?.id,
        name: u?.fullName || p?.userName || `User ${p?.userId}`,
        email: u?.email || "",
        role: u?.role ?? u?.Role,
        participationRole: p?.role || "PARTICIPANT",
        participationStatus: String(p?.status || "ACTIVE").toUpperCase(),
        cancelReason: p?.cancelRequestReason,
      };
    });
    const cfg = STATUS_CONFIG[selectedActivity.status] || STATUS_CONFIG.upcoming;

    const openAddParticipantModal = () => {
      if (isSelectedAtCapacity) {
        const limit = selectedActivity.studentQuantity;
        const current = (selectedActivity.participantIds || []).length;
        const msg = `Hoạt động đã đạt giới hạn (${current}/${limit} SV).`;
        setCapacityNotice(msg);
        toast.show({ type: "warning", title: "Đã đủ số lượng", message: msg });
        return;
      }
      setIsAddParticipantOpen(true);
    };
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
                  <span className="meta-icon">🎓</span>
                  <div><span className="meta-label">Số lượng SV</span><span className="meta-value">{selectedActivity.studentQuantity ?? "Không giới hạn"}</span></div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">👥</span>
                  <div>
                    <span className="meta-label">Tham gia</span>
                    <span className="meta-value">
                      {selectedActivity.studentQuantity ? `${participants.length}/${selectedActivity.studentQuantity} SV` : `${participants.length} SV`}
                    </span>
                  </div>
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
                <h3 className="participants-title">Student tham gia</h3>
                <p className="participants-subtitle">{participants.length} / {users.length || participants.length} Student</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                {capacityNotice && (
                  <div style={{ color: "#b91c1c", fontSize: 12, fontWeight: 600 }}>
                    {capacityNotice}
                  </div>
                )}
                <button className="btn-primary btn-sm" onClick={openAddParticipantModal}>
                  + Thêm
                </button>
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="no-participants">
                <span className="no-participants-icon">👤</span>
                <p>Chưa có Student nào tham gia</p>
                <button className="btn-primary btn-sm" onClick={openAddParticipantModal}>
                  Thêm Student
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
                      <code>{s.participationRole || s.role || "PARTICIPANT"}</code>
                      {s.participationStatus === "CANCEL_REQUESTED" ? (
                        <span style={{ color: "#b91c1c", fontWeight: 600, fontSize: 12 }}>
                          Đang chờ duyệt hủy{ s.cancelReason ? `: ${s.cancelReason}` : "" }
                        </span>
                      ) : null}
                    </div>
                    {s.participationStatus === "CANCEL_REQUESTED" && s.participationId ? (
                      <>
                        <button
                          className="btn-edit btn-xs"
                          disabled={loading}
                          onClick={() => openCancelReviewModal({ action: "approve", participationId: s.participationId, studentName: s.name, reason: s.cancelReason })}
                          title="Duyệt hủy đăng ký"
                        >
                          Duyệt hủy
                        </button>
                        <button
                          className="btn-delete btn-xs"
                          disabled={loading}
                          onClick={() => openCancelReviewModal({ action: "reject", participationId: s.participationId, studentName: s.name, reason: s.cancelReason })}
                          title="Từ chối yêu cầu hủy"
                        >
                          Từ chối
                        </button>
                      </>
                    ) : null}
                    {s.participationId ? (
                      <button
                        className="btn-edit btn-xs"
                        disabled={loading}
                        onClick={() => toggleLead(s.participationId, (s.participationRole || "").toUpperCase() !== "LEAD")}
                        title="Đổi vai trò LEAD/PARTICIPANT"
                      >
                        {(s.participationRole || "").toUpperCase() === "LEAD" ? "Bỏ LEAD" : "Đặt LEAD"}
                      </button>
                    ) : null}
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
                <h3>➕ Thêm Student tham gia</h3>
                <button className="btn-close" onClick={() => setIsAddParticipantOpen(false)}>&times;</button>
              </div>
              <div className="modal-body" style={{ padding: "12px 24px" }}>
                {isSelectedAtCapacity && capacityNotice && (
                  <p style={{ color: "#b91c1c", textAlign: "center", padding: "12px 0", fontWeight: 600 }}>
                    {capacityNotice}
                  </p>
                )}
                {notJoined.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", padding: "24px 0" }}>
                    Tất cả Student đã tham gia hoạt động này.
                  </p>
                ) : (
                  <div className="add-participant-list">
                    {notJoined.map((s, i) => (
                      <div className="add-participant-item" key={s.id}>
                        <div className="participant-avatar small" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                          {getInitials(s.fullName || s.name || "")}
                        </div>
                        <div className="participant-info">
                          <strong>{s.fullName || s.name}</strong>
                          <span>{s.role ?? s.Role}</span>
                        </div>
                        <button
                          className="btn-add-participant"
                          disabled={isSelectedAtCapacity}
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

        {/* Cancel Review Modal */}
        {cancelReviewModal.open && (
          <div className="modal-overlay" onClick={closeCancelReviewModal}>
            <div className="modal-content cancel-review-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="cancel-review-header">
                  <span className={`cancel-review-badge ${cancelReviewModal.action === "reject" ? "cancel-review-reject" : "cancel-review-approve"}`}>
                    {cancelReviewModal.action === "reject" ? "Từ chối" : "Duyệt hủy"}
                  </span>
                  <h3>{cancelReviewModal.action === "reject" ? "Từ chối yêu cầu hủy" : "Duyệt hủy đăng ký"}</h3>
                </div>
                <button className="btn-close" onClick={closeCancelReviewModal}>&times;</button>
              </div>
              <div className="modal-body cancel-review-body">
                <div className="cancel-review-meta">
                  <div><span className="cancel-review-label">Sinh viên:</span> <strong>{cancelReviewModal.studentName || "—"}</strong></div>
                  <div><span className="cancel-review-label">Lý do SV:</span> <span>{cancelReviewModal.reason || "—"}</span></div>
                </div>
                <div className="form-group">
                  <label>{cancelReviewModal.action === "reject" ? "Lý do từ chối (tuỳ chọn)" : "Ghi chú duyệt (tuỳ chọn)"}</label>
                  <textarea
                    rows={4}
                    value={cancelReviewModal.note}
                    onChange={(e) => setCancelReviewModal((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Nhập ghi chú..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" disabled={loading} onClick={closeCancelReviewModal}>Đóng</button>
                <button
                  className={cancelReviewModal.action === "reject" ? "btn-delete-confirm" : "btn-primary"}
                  disabled={loading}
                  onClick={submitCancelReview}
                >
                  Xác nhận
                </button>
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
        <span className="result-count">{loading ? "Đang tải..." : `${filtered.length} kết quả`}</span>
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
            const cfg = STATUS_CONFIG[activity.status] || STATUS_CONFIG.upcoming;
            const participants = (activity.participations || []).map((p) => {
              const u = usersById.get(p?.userId);
              return { id: p?.userId, name: u?.fullName || p?.userName || `User ${p?.userId}` };
            });
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
                  <span>👥 Số lượng SV: {activity.studentQuantity ?? "Không giới hạn"}</span>
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
                      {participants.length === 0
                        ? "Chưa có ai"
                        : activity.studentQuantity
                          ? `${participants.length}/${activity.studentQuantity} SV`
                          : `${participants.length} SV`}
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
              <label>Số lượng sinh viên (để trống = không giới hạn)</label>
              <input type="number" min="1" step="1" name="studentQuantity" value={formData.studentQuantity} onChange={handleChange} placeholder="Vd: 100" />
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
