import React, { useMemo, useState } from "react";

export default function ActivitiesTab() {
  const [activities] = useState([
    {
      id: 1,
      name: "Ngày hội Tân sinh viên 2025",
      location: "Sân vận động PTIT",
      startTime: "2025-09-15T08:00",
      endTime: "2025-09-15T17:00",
      status: "completed",
      description:
        "Hoạt động chào đón tân sinh viên nhập học năm 2025 với nhiều trò chơi và hoạt động vui vẻ, giao lưu.",
      organizer: "Đoàn Thanh niên PTIT",
      slots: 200,
      registeredCount: 187,
    },
    {
      id: 2,
      name: "Hội thảo Hướng nghiệp CNTT",
      location: "Hội trường A1",
      startTime: "2025-10-20T13:30",
      endTime: "2025-10-20T17:00",
      status: "completed",
      description: "Kết nối sinh viên với doanh nghiệp công nghệ hàng đầu, định hướng nghề nghiệp ngành CNTT.",
      organizer: "Khoa CNTT",
      slots: 150,
      registeredCount: 143,
    },
    {
      id: 3,
      name: "Giải thể thao Xuân 2026",
      location: "Nhà thi đấu PTIT",
      startTime: "2026-01-10T07:30",
      endTime: "2026-01-12T17:00",
      status: "ongoing",
      description: "Giải đấu thể thao truyền thống mừng xuân mới với nhiều bộ môn: bóng đá, cầu lông, bóng bàn.",
      organizer: "Ban Thể thao - Văn hoá",
      slots: 300,
      registeredCount: 256,
    },
    {
      id: 4,
      name: "Workshop Kỹ năng mềm",
      location: "Phòng học B301",
      startTime: "2026-05-20T09:00",
      endTime: "2026-05-20T12:00",
      status: "upcoming",
      description: "Rèn luyện kỹ năng giao tiếp, thuyết trình và làm việc nhóm hiệu quả cho sinh viên năm nhất.",
      organizer: "Phòng Công tác Sinh viên",
      slots: 60,
      registeredCount: 34,
    },
    {
      id: 5,
      name: "Hiến máu nhân đạo",
      location: "Sảnh tòa nhà C",
      startTime: "2026-06-01T07:00",
      endTime: "2026-06-01T11:30",
      status: "upcoming",
      description:
        "Chương trình hiến máu tình nguyện vì cộng đồng, mỗi giọt máu cho đi là một cuộc đời ở lại.",
      organizer: "Hội Chữ thập đỏ PTIT",
      slots: 100,
      registeredCount: 61,
    },
    {
      id: 6,
      name: "Cuộc thi Lập trình ACM/ICPC",
      location: "Phòng máy tính D101",
      startTime: "2026-06-15T08:00",
      endTime: "2026-06-15T17:00",
      status: "upcoming",
      description: "Cuộc thi lập trình thuật toán cấp trường, tuyển chọn đội thi vòng khu vực ACM/ICPC.",
      organizer: "CLB Lập trình PTIT",
      slots: 80,
      registeredCount: 42,
    },
  ]);

  const [registeredIds, setRegisteredIds] = useState([3]);
  const [activityFilter, setActivityFilter] = useState("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityToast, setActivityToast] = useState(null);

  const STATUS_CFG = {
    upcoming: { label: "Sắp diễn ra", cls: "act-badge-blue" },
    ongoing: { label: "Đang diễn ra", cls: "act-badge-green" },
    completed: { label: "Đã kết thúc", cls: "act-badge-gray" },
    cancelled: { label: "Đã hủy", cls: "act-badge-red" },
  };

  const showToast = (msg, type = "info") => {
    setActivityToast({ msg, type });
    setTimeout(() => setActivityToast(null), 2200);
  };

  const handleRegister = (activity) => {
    if (activity.status !== "upcoming") return;
    if (registeredIds.includes(activity.id)) return;
    if (activity.registeredCount >= activity.slots) {
      showToast("Hoạt động đã hết chỗ!", "error");
      return;
    }
    setRegisteredIds((prev) => [...prev, activity.id]);
    showToast(`Đăng ký "${activity.name}" thành công! 🎉`);
    if (selectedActivity?.id === activity.id) {
      setSelectedActivity((prev) => ({ ...prev, registeredCount: prev.registeredCount + 1 }));
    }
  };

  const handleUnregister = (activity) => {
    if (activity.status !== "upcoming") return;
    setRegisteredIds((prev) => prev.filter((id) => id !== activity.id));
    showToast(`Đã hủy đăng ký "${activity.name}".`, "info");
    if (selectedActivity?.id === activity.id) {
      setSelectedActivity((prev) => ({ ...prev, registeredCount: prev.registeredCount - 1 }));
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
      {activityToast && <div className={`act-toast act-toast-${activityToast.type}`}>{activityToast.msg}</div>}

      <div className="act-stats-row">
        <div className="act-stat-chip">
          <span>🎯</span>
          <span>
            <strong>{activities.length}</strong> hoạt động
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
          const cfg = STATUS_CFG[act.status] || STATUS_CFG.upcoming;
          const full = act.registeredCount >= act.slots;

          return (
            <div key={act.id} className="act-card" onClick={() => setSelectedActivity(act)} role="button" tabIndex={0}>
              <div className="act-card-top">
                <span className={`act-badge ${cfg.cls}`}>{cfg.label}</span>
                <span className="act-slots">
                  {act.registeredCount}/{act.slots}
                </span>
              </div>
              <h3 className="act-title">{act.name}</h3>
              <p className="act-meta">📍 {act.location}</p>
              <p className="act-meta">🕒 {formatActivityDate(act.startTime)}</p>
              <div className="act-actions">
                {act.status === "upcoming" ? (
                  isReg ? (
                    <button className="act-btn-unregister" onClick={(e) => { e.stopPropagation(); handleUnregister(act); }}>
                      Hủy đăng ký
                    </button>
                  ) : (
                    <button
                      className="act-btn-register"
                      disabled={full}
                      onClick={(e) => { e.stopPropagation(); handleRegister(act); }}
                    >
                      {full ? "Đã hết chỗ" : "Đăng ký"}
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
        const cfg = STATUS_CFG[act.status] || STATUS_CFG.upcoming;
        const full = act.registeredCount >= act.slots;

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
                <p className="act-meta">👤 {act.organizer}</p>
                <p className="act-desc">{act.description}</p>
              </div>
              <div className="act-modal-actions">
                {act.status === "upcoming" && (
                  isReg ? (
                    <button className="act-btn-unregister" onClick={() => { handleUnregister(act); setSelectedActivity(null); }}>
                      Hủy đăng ký tham gia
                    </button>
                  ) : (
                    <button className="act-btn-register act-btn-lg" disabled={full} onClick={() => handleRegister(act)}>
                      {full ? "Đã hết chỗ" : "🎯 Đăng ký tham gia"}
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

