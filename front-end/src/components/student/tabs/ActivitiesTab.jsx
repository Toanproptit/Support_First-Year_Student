import React, { useEffect, useMemo, useState } from "react";
import { getAllActivities } from "../../../service/activities";
import { createParticipation, getParticipationsByUserId, requestCancelParticipation } from "../../../service/participations";
import { getMe } from "../../../service/me";
import { useToast } from "../../ToastProvider";
import "../../../styles/ActivitiesTab.css";

export default function ActivitiesTab() {
  const [activities, setActivities] = useState([]);

  const [registeredIds, setRegisteredIds] = useState([]);
  const [myParticipationsByActivityId, setMyParticipationsByActivityId] = useState({});
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, activity: null, reason: "" });
  const toast = useToast();

  const STATUS_CFG = {
    upcoming: { label: "Sắp diễn ra", cls: "act-badge-blue" },
    ongoing: { label: "Đang diễn ra", cls: "act-badge-green" },
    completed: { label: "Đã kết thúc", cls: "act-badge-gray" },
    cancelled: { label: "Đã hủy", cls: "act-badge-red" },
  };

  const toUiActivity = (a) => {
    const participations = Array.isArray(a?.participations) ? a.participations : [];
    return {
      id: a?.id,
      name: a?.name || "",
      location: a?.address || "",
      startTime: a?.startDate,
      endTime: a?.endDate,
      status: String(a?.status || "UPCOMING").toLowerCase(),
      description: a?.description || "",
      registeredCount: a?.participantCount ?? participations.length,
    };
  };

  const refresh = async (userId) => {
    const acts = await getAllActivities();
    setActivities((acts || []).map(toUiActivity));
    if (userId != null) {
      const parts = await getParticipationsByUserId(userId);
      const map = {};
      (parts || []).forEach((p) => {
        if (p?.activityId != null) map[p.activityId] = p;
      });
      setMyParticipationsByActivityId(map);

      const activeIds = (parts || [])
        .filter((p) => String(p?.status || "ACTIVE").toUpperCase() !== "CANCELLED")
        .map((p) => p?.activityId)
        .filter((v) => v != null);
      setRegisteredIds(activeIds);
    } else {
      setRegisteredIds([]);
      setMyParticipationsByActivityId({});
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const meRes = await getMe();
        if (cancelled) return;
        setMe(meRes);
        await refresh(meRes?.id);
      } catch (e) {
        if (!cancelled) {
          showToast(e?.response?.data?.message || e?.message || "Không tải được danh sách hoạt động.", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message, type = "info") => {
    const title =
      type === "success" ? "Thành công" :
        type === "error" ? "Thất bại" :
          type === "warning" ? "Cảnh báo" : "Thông báo";
    toast.show({ type, title, message, durationMs: 2200 });
  };

  const handleRegister = async (activity) => {
    if (activity.status !== "upcoming") return;
    if (!me?.id) return;

    try {
      setLoading(true);
      const created = await createParticipation({ userId: me.id, activityId: activity.id, role: "PARTICIPANT" });
      setMyParticipationsByActivityId((prev) => ({ ...(prev || {}), [activity.id]: created }));
      setRegisteredIds((prev) => [...prev, activity.id]);
      setActivities((prev) =>
        (prev || []).map((a) => (a.id === activity.id ? { ...a, registeredCount: Number(a.registeredCount || 0) + 1 } : a))
      );
      if (selectedActivity?.id === activity.id) {
        setSelectedActivity((prev) => ({ ...prev, registeredCount: Number(prev.registeredCount || 0) + 1 }));
      }
      showToast(`Đăng ký "${activity.name}" thành công.`, "success");
    } catch (e) {
      showToast(e?.response?.data?.message || e?.message || "Đăng ký thất bại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (activity) => {
    if (activity.status !== "upcoming") return;
    if (!me?.id) return;

    const p = myParticipationsByActivityId?.[activity.id];
    const participationId = p?.id;
    const st = String(p?.status || "ACTIVE").toUpperCase();
    if (!participationId) return;
    if (st === "CANCEL_REQUESTED") {
      showToast("Bạn đã gửi yêu cầu hủy. Vui lòng chờ Admin duyệt.", "info");
      return;
    }

    setCancelModal({ open: true, activity, reason: "" });
  };

  const submitCancelRequest = async () => {
    const activity = cancelModal.activity;
    if (!activity?.id) return;
    const p = myParticipationsByActivityId?.[activity.id];
    const participationId = p?.id;
    if (!participationId) return;

    try {
      setLoading(true);
      const updated = await requestCancelParticipation(participationId, { reason: cancelModal.reason });
      setMyParticipationsByActivityId((prev) => ({ ...(prev || {}), [activity.id]: updated || p }));
      showToast("Đã gửi yêu cầu hủy đăng ký. Chờ Admin duyệt.", "info");
      setCancelModal({ open: false, activity: null, reason: "" });
    } catch (e) {
      showToast(e?.response?.data?.message || e?.message || "Gửi yêu cầu hủy thất bại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatActivityDate = (dt) => {
    if (!dt) return "—";
    return new Date(dt).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredActivities = useMemo(() => {
    const q = activitySearch.toLowerCase();
    return (activities || []).filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
      const matchFilter = activityFilter === "all" || a.status === activityFilter;
      return matchSearch && matchFilter;
    });
  }, [activities, activitySearch, activityFilter]);

  return (
    <div className="act-page">
      {cancelModal.open && (
        <div className="act-modal-overlay" onClick={() => setCancelModal({ open: false, activity: null, reason: "" })}>
          <div className="act-modal act-cancel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="act-modal-header">
              <span className="act-badge act-badge-gray">Yêu cầu hủy</span>
              <h3>Hủy đăng ký</h3>
              <button className="act-btn-close" onClick={() => setCancelModal({ open: false, activity: null, reason: "" })}>
                ✖
              </button>
            </div>
            <div className="act-modal-body">
              <p className="act-cancel-activity">
                Hoạt động: <strong>{cancelModal.activity?.name}</strong>
              </p>
              <label className="act-cancel-label">Lý do (tuỳ chọn)</label>
              <textarea
                rows={4}
                value={cancelModal.reason}
                onChange={(e) => setCancelModal((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Nhập lý do muốn hủy đăng ký..."
                className="act-cancel-textarea"
              />
            </div>
            <div className="act-modal-actions">
              <button className="act-btn-close-modal" disabled={loading} onClick={() => setCancelModal({ open: false, activity: null, reason: "" })}>
                Đóng
              </button>
              <button className="act-btn-unregister" disabled={loading} onClick={submitCancelRequest}>
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="act-stats-row">
        <div className="act-stat-chip">
          <span>🎯</span>
          <span>
            <strong>{loading ? "…" : activities.length}</strong> hoạt động
          </span>
        </div>
        <div className="act-stat-chip">
          <span>✅</span>
          <span>
            <strong>{registeredIds.length}</strong> đã đăng ký
          </span>
        </div>
        <div className="act-stat-chip">
          <span>⏳</span>
          <span>
            <strong>{activities.filter((a) => a.status === "upcoming").length}</strong> sắp diễn ra
          </span>
        </div>
      </div>

      <div className="act-toolbar">
        <input
          className="act-search"
          type="text"
          placeholder="Tìm hoạt động theo tên hoặc địa điểm..."
          value={activitySearch}
          onChange={(e) => setActivitySearch(e.target.value)}
        />
        <div className="act-filter-chips">
          {["all", "upcoming", "ongoing", "completed"].map((key) => (
            <button
              key={key}
              className={`act-chip ${activityFilter === key ? "act-chip-active" : ""}`}
              onClick={() => setActivityFilter(key)}
            >
              {key === "all" ? "Tất cả" : STATUS_CFG[key]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="act-grid">
        {filteredActivities.map((act) => {
          const isReg = registeredIds.includes(act.id);
          const myStatus = String(myParticipationsByActivityId?.[act.id]?.status || (isReg ? "ACTIVE" : "")).toUpperCase();
          const isCancelRequested = myStatus === "CANCEL_REQUESTED";
          const cfg = STATUS_CFG[act.status] || STATUS_CFG.upcoming;

          return (
            <div key={act.id} className="act-card" onClick={() => setSelectedActivity(act)} role="button" tabIndex={0}>
              <div className="act-card-top">
                <span className={`act-badge ${cfg.cls}`}>{cfg.label}</span>
                <span className="act-slots">
                  {act.registeredCount} người tham gia
                </span>
              </div>
              <h3 className="act-title">{act.name}</h3>
              <p className="act-meta">📍 {act.location}</p>
              <p className="act-meta">🕒 {formatActivityDate(act.startTime)}</p>
              <div className="act-actions">
                {act.status === "upcoming" ? (
                  isReg ? (
                    isCancelRequested ? (
                      <button className="act-btn-unregister" disabled>
                        Đang chờ duyệt hủy
                      </button>
                    ) : (
                      <button className="act-btn-unregister" disabled={loading} onClick={(e) => { e.stopPropagation(); openCancelModal(act); }}>
                        Yêu cầu hủy
                      </button>
                    )
                  ) : (
                    <button
                      className="act-btn-register"
                      disabled={loading}
                      onClick={(e) => { e.stopPropagation(); handleRegister(act); }}
                    >
                      Đăng ký
                    </button>
                  )
                ) : (
                  <span className="act-note">Chỉ xem</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedActivity && (() => {
        const act = selectedActivity;
        const isReg = registeredIds.includes(act.id);
        const myStatus = String(myParticipationsByActivityId?.[act.id]?.status || (isReg ? "ACTIVE" : "")).toUpperCase();
        const isCancelRequested = myStatus === "CANCEL_REQUESTED";
        const cfg = STATUS_CFG[act.status] || STATUS_CFG.upcoming;

        return (
          <div className="act-modal-overlay" onClick={() => setSelectedActivity(null)}>
            <div className="act-modal" onClick={(e) => e.stopPropagation()}>
              <div className="act-modal-header">
                <span className={`act-badge ${cfg.cls}`}>{cfg.label}</span>
                <h3>{act.name}</h3>
                <button className="act-btn-close" onClick={() => setSelectedActivity(null)}>
                  ✕
                </button>
              </div>
              <div className="act-modal-body">
                <p className="act-meta">📍 {act.location}</p>
                <p className="act-meta">🕒 {formatActivityDate(act.startTime)} - {formatActivityDate(act.endTime)}</p>
                <p className="act-meta">👥 {act.registeredCount} người tham gia</p>
                <p className="act-desc">{act.description}</p>
              </div>
              <div className="act-modal-actions">
                {act.status === "upcoming" && (
                  isReg ? (
                    isCancelRequested ? (
                      <button className="act-btn-unregister" disabled>
                        Đang chờ duyệt hủy
                      </button>
                    ) : (
                      <button className="act-btn-unregister" disabled={loading} onClick={() => { openCancelModal(act); setSelectedActivity(null); }}>
                        Yêu cầu hủy đăng ký
                      </button>
                    )
                  ) : (
                    <button className="act-btn-register act-btn-lg" disabled={loading} onClick={() => handleRegister(act)}>
                      🎯 Đăng ký tham gia
                    </button>
                  )
                )}
                <button className="act-btn-close-modal" onClick={() => setSelectedActivity(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
