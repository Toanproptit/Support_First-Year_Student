import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import { useToast } from "../ToastProvider";
import { getAllFeedbacks, updateFeedback } from "../../service/feedbacks";
import { getAllUsers } from "../../service/users";

function formatDateTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status) {
  const st = String(status || "VIEW").toUpperCase();
  if (st === "REVIEWED") return { text: "Đã xử lý", cls: "badge badge-green" };
  return { text: "Chưa xử lý", cls: "badge badge-yellow" };
}

export default function AdminFeedBack() {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const toast = useToast();

  const usersById = useMemo(() => {
    const map = new Map();
    (users || []).forEach((u) => {
      if (u?.id != null) map.set(u.id, u);
    });
    return map;
  }, [users]);

  const refresh = async () => {
    const [fbRes, usersRes] = await Promise.all([getAllFeedbacks(), getAllUsers({ size: 500 })]);
    setFeedbacks(Array.isArray(fbRes) ? fbRes : []);
    setUsers(Array.isArray(usersRes) ? usersRes : []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        await refresh();
      } catch (e) {
        if (!cancelled) {
          toast.show({
            type: "error",
            title: "Không tải được phản hồi",
            message: e?.response?.data?.message || e?.message || "Vui lòng thử lại.",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    return (feedbacks || [])
      .filter((f) => {
        const st = String(f?.status || "VIEW").toUpperCase();
        if (filterStatus !== "ALL" && st !== filterStatus) return false;

        const u = f?.userId != null ? usersById.get(f.userId) : null;
        const userText = `${u?.fullName || u?.userName || ""} ${u?.email || ""}`.toLowerCase();
        const bodyText = `${f?.subject || ""} ${f?.title || ""} ${f?.content || ""}`.toLowerCase();
        return userText.includes(q) || bodyText.includes(q);
      })
      .sort((a, b) => {
        const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
  }, [feedbacks, filterStatus, search, usersById]);

  const handleMarkReviewed = async (fb) => {
    if (!fb?.id) return;
    const st = String(fb?.status || "VIEW").toUpperCase();
    if (st === "REVIEWED") return;

    try {
      setLoading(true);
      const updated = await updateFeedback(fb.id, { status: "REVIEWED" });
      setFeedbacks((prev) => (prev || []).map((x) => (x.id === fb.id ? (updated || x) : x)));
      toast.show({ type: "success", title: "Thành công", message: "Đã đánh dấu phản hồi là đã xử lý." });
    } catch (e) {
      toast.show({
        type: "error",
        title: "Thao tác thất bại",
        message: e?.response?.data?.message || e?.message || "Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Phản hồi</h2>
          <p className="page-subtitle">Danh sách phản hồi / báo lỗi do sinh viên gửi.</p>
        </div>
      </div>

      <div className="table-toolbar" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tiêu đề, nội dung, người gửi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          disabled={loading}
        >
          <option value="ALL">Tất cả</option>
          <option value="VIEW">Chưa xử lý</option>
          <option value="REVIEWED">Đã xử lý</option>
        </select>

        <span className="result-count">{filtered.length} phản hồi</span>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Người gửi</th>
              <th>Loại</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Nội dung</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>
                  {loading ? "Đang tải..." : "Không có phản hồi nào."}
                </td>
              </tr>
            ) : (
              filtered.map((f, idx) => {
                const u = f?.userId != null ? usersById.get(f.userId) : null;
                const sender = u?.fullName || u?.userName || (f?.userId != null ? `User #${f.userId}` : "—");
                const senderEmail = u?.email || "";
                const st = statusBadge(f?.status);
                return (
                  <tr key={f.id ?? idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong>{sender}</strong>
                        <span style={{ color: "#64748b", fontSize: 12 }}>{senderEmail}</span>
                      </div>
                    </td>
                    <td>{f?.subject || ""}</td>
                    <td>{f?.title || ""}</td>
                    <td>
                      <span className={st.cls}>{st.text}</span>
                    </td>
                    <td>{formatDateTime(f?.createdAt)}</td>
                    <td style={{ maxWidth: 360, whiteSpace: "normal" }}>{f?.content || ""}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() => handleMarkReviewed(f)}
                          disabled={loading || String(f?.status || "VIEW").toUpperCase() === "REVIEWED"}
                          title="Đánh dấu đã xử lý"
                        >
                          Xử lý
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
    </div>
  );
}
