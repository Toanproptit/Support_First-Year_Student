import React, { useEffect, useMemo, useState } from "react";
import "../../styles/StudentCourseSections.css";
import { getAllTerms } from "../../service/terms";
import { getAllSubjects } from "../../service/subjects";
import { getMe } from "../../service/me";
import { getMyCourseSections, unregisterCourseSection } from "../../service/courseSectionRegistrations";
import { createCourseSectionReview, getReviewsByCourseSection } from "../../service/courseSectionReviews";

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

function statusLabel(status) {
  if (status === "upcoming") return "Sắp diễn ra";
  if (status === "done") return "Hoàn thành";
  return "Đang học";
}

function statusClass(status) {
  if (status === "upcoming") return "cs-badge-upcoming";
  if (status === "done") return "cs-badge-done";
  return "cs-badge-muted";
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function computeProgressPercent(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const now = new Date();
  if (now <= start) return 0;
  if (now >= end) return 100;
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 0;
  const done = now.getTime() - start.getTime();
  return clamp(Math.round((done / total) * 100), 0, 100);
}

function computeStatus(startDate, endDate) {
  if (!startDate || !endDate) return "muted";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  if (now < start) return "upcoming";
  if (now > end) return "done";
  return "muted";
}

function colorForSubject(subjectCode) {
  const s = String(subjectCode || "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  const palette = [
    { color: "#4f46e5", bg: "linear-gradient(135deg, rgba(14,165,233,.25), rgba(99,102,241,.25))" },
    { color: "#059669", bg: "linear-gradient(135deg, rgba(34,197,94,.25), rgba(16,185,129,.25))" },
    { color: "#c8102e", bg: "linear-gradient(135deg, rgba(200,16,46,.2), rgba(251,113,133,.2))" },
    { color: "#ea580c", bg: "linear-gradient(135deg, rgba(234,88,12,.18), rgba(251,191,36,.18))" },
  ];
  return palette[hash % palette.length];
}

export default function StudentCourseSections() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [me, setMe] = useState(null);
  const [terms, setTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courseSections, setCourseSections] = useState([]);

  const [query, setQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", content: "" });

  const currentTerm = (terms || [])[0]?.code || "";

  const subjectByCode = useMemo(() => {
    const map = new Map();
    (subjects || []).forEach((s) => map.set(s.code, s));
    return map;
  }, [subjects]);

  const termByCode = useMemo(() => {
    const map = new Map();
    (terms || []).forEach((t) => map.set(t.code, t));
    return map;
  }, [terms]);

  const refreshMyCourseSections = async () => {
    const list = await getMyCourseSections();
    setCourseSections(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [meRes, termList, subjectList, myList] = await Promise.all([
          getMe(),
          getAllTerms(),
          getAllSubjects(),
          getMyCourseSections(),
        ]);
        if (cancelled) return;
        setMe(meRes);
        setTerms(termList || []);
        setSubjects(subjectList || []);
        setCourseSections(myList || []);

        const defaultTerm = (termList || [])[0]?.code || "";
        setSelectedTerm((prev) => prev || defaultTerm);
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e, "Không tải được lớp tín chỉ của bạn."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadReviews() {
      if (!selectedClass?.code) return;
      setReviewsLoading(true);
      setReviewsError("");
      try {
        const list = await getReviewsByCourseSection(selectedClass.code);
        if (cancelled) return;
        setReviews(list || []);
      } catch (e) {
        if (!cancelled) setReviewsError(getErrorMessage(e, "Không tải được đánh giá."));
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [selectedClass?.code]);

  useEffect(() => {
    setReviewSubmitError("");
    setReviewSubmitting(false);
    setReviewForm({ rating: 5, title: "", content: "" });
  }, [selectedClass?.code]);

  const myReview = useMemo(() => {
    if (!me?.id) return null;
    return (reviews || []).find((r) => r && r.userId === me.id) || null;
  }, [reviews, me?.id]);

  const canReviewNow = useMemo(() => {
    if (!selectedClass?.startDate || !selectedClass?.endDate) return false;
    return computeStatus(selectedClass.startDate, selectedClass.endDate) === "muted";
  }, [selectedClass?.startDate, selectedClass?.endDate]);

  const submitMyReview = async () => {
    if (!selectedClass?.code) return;
    const rating = clamp(Number(reviewForm.rating || 0), 1, 5);
    const title = String(reviewForm.title || "").trim();
    const content = String(reviewForm.content || "").trim();
    if (!title || !content) {
      setReviewSubmitError("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setReviewSubmitError("");
    setReviewSubmitting(true);
    try {
      await createCourseSectionReview({ courseSectionCode: selectedClass.code, rating, title, content });
      const list = await getReviewsByCourseSection(selectedClass.code);
      setReviews(list || []);
      setReviewForm({ rating: 5, title: "", content: "" });
    } catch (e) {
      setReviewSubmitError(getErrorMessage(e, "Gửi đánh giá thất bại."));
    } finally {
      setReviewSubmitting(false);
    }
  };

  const viewCourseSections = useMemo(() => {
    return (courseSections || []).map((cs, idx) => {
      const subject = subjectByCode.get(cs.subjectCode);
      const { color, bg } = colorForSubject(cs.subjectCode);
      const progress = computeProgressPercent(cs.startDate, cs.endDate);
      const status = computeStatus(cs.startDate, cs.endDate);
      return {
        id: cs.code || idx + 1,
        code: cs.code,
        name: cs.name || cs.code,
        teacher: cs.teacherName || (cs.teacherId ? `#${cs.teacherId}` : "—"),
        room: subject ? `${subject.code} — ${subject.name}` : cs.subjectCode || "—",
        progress,
        status,
        termCode: cs.termCode || "",
        startDate: cs.startDate || "",
        endDate: cs.endDate || "",
        details:
          subject
            ? `Môn: ${subject.name} (${subject.code}).`
            : "Chưa có mô tả chi tiết cho lớp học này.",
        bg,
        color,
      };
    });
  }, [courseSections, subjectByCode]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return viewCourseSections.filter((c) => {
      if (selectedTerm && c.termCode !== selectedTerm) return false;
      if (!normalized) return true;
      const haystack = `${c.code} ${c.name} ${c.teacher} ${c.room}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, selectedTerm, viewCourseSections]);

  const semesterOptions = useMemo(() => {
    if (!terms?.length) return [];
    return terms;
  }, [terms]);

  const selectedTermLabel = termByCode.get(selectedTerm)?.name || selectedTerm || "";

  const handleUnregister = async () => {
    if (!selectedClass?.code) return;
    if (!window.confirm(`Bạn có chắc muốn huỷ đăng ký lớp ${selectedClass.code} không?`)) return;
    try {
      await unregisterCourseSection(selectedClass.code);
      setSelectedClass(null);
      await refreshMyCourseSections();
    } catch (e) {
      alert(getErrorMessage(e, "Huỷ đăng ký thất bại."));
    }
  };

  return (
    <div className="cs-page">
      <div className="cs-toolbar">
        <div>
          <div className="cs-subtitle">Danh sách lớp tín chỉ của bạn</div>
          {selectedTermLabel ? (
            <div style={{ marginTop: 4, fontSize: 12, color: "#94a3b8" }}>
              Kỳ: <strong style={{ color: "#334155" }}>{selectedTermLabel}</strong>
            </div>
          ) : null}
        </div>
        <div className="cs-toolbar-actions">
          <div className="cs-select-wrapper">
            <select className="cs-filter" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
              {semesterOptions.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.code} — {t.name}
                </option>
              ))}
            </select>
            <svg className="cs-select-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="cs-search-wrapper">
            <svg className="cs-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input className="cs-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo mã, tên, giảng viên..." />
          </div>
        </div>
      </div>

      {loading ? <div style={{ color: "#64748b" }}>Đang tải...</div> : null}
      {!!error ? <div style={{ color: "#c8102e" }}>{error}</div> : null}

      <div className="cs-grid">
        {filtered.map((c, index) => (
          <article key={c.id} className="cs-card" onClick={() => setSelectedClass(c)} style={{ backgroundImage: c.bg }}>
            <div className="cs-card-top">
              <div className="cs-id" style={{ background: "rgba(255,255,255,.7)", color: c.color }}>
                {index + 1}
              </div>
              <span className={`cs-badge ${statusClass(c.status)}`}>{statusLabel(c.status)}</span>
            </div>

            <div className="cs-card-body">
              <div className="cs-code">{c.code}</div>
              <div className="cs-name">{c.name}</div>
            </div>

            <div className="cs-meta-row">
              <div className="cs-meta">
                <div className="cs-meta-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M4 21v-2a4 4 0 0 1 4-4h4" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="cs-meta-info">
                  <div className="cs-meta-label">Giảng viên</div>
                  <div className="cs-meta-value">{c.teacher}</div>
                </div>
              </div>

              <div className="cs-meta">
                <div className="cs-meta-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 4v16" />
                    <path d="M16 4v16" />
                  </svg>
                </div>
                <div className="cs-meta-info">
                  <div className="cs-meta-label">Môn học</div>
                  <div className="cs-meta-value">{c.room}</div>
                </div>
              </div>
            </div>

            <div className="cs-progress">
              <div className="cs-progress-bar">
                <div className={`cs-progress-fill ${c.progress >= 100 ? "done" : ""}`} style={{ width: `${clamp(c.progress, 0, 100)}%` }} />
              </div>
              <div className="cs-progress-text">{c.progress}%</div>
            </div>
          </article>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="cs-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p>Không tìm thấy lớp tín chỉ nào.</p>
          </div>
        )}
      </div>

      {selectedClass && (
        <div className="cs-modal-overlay" onClick={() => setSelectedClass(null)}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <div>
                <div className="cs-modal-title">{selectedClass.name}</div>
                <div className="cs-modal-subtitle">
                  <span className="cs-tag">{selectedClass.code}</span>
                  <span>•</span>
                  <span>{selectedClass.teacher}</span>
                  <span>•</span>
                  <span>{selectedTermLabel || selectedClass.termCode}</span>
                </div>
              </div>
              <button className="cs-modal-close" onClick={() => setSelectedClass(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="cs-modal-body">
              <div className="cs-modal-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Thông tin lớp học
              </div>
              <div className="cs-modal-desc">
                {selectedClass.details}
                <div style={{ marginTop: 10, fontSize: 13, color: "#64748b" }}>
                  Thời gian: <strong>{selectedClass.startDate || "?"}</strong> → <strong>{selectedClass.endDate || "?"}</strong>
                </div>
              </div>

              <div className="cs-modal-section-title" style={{ marginTop: 24 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Tiến độ ({selectedClass.progress}%)
              </div>
              <div className="cs-progress" style={{ marginTop: 12 }}>
                <div className="cs-progress-bar" style={{ height: 10 }}>
                  <div className={`cs-progress-fill ${selectedClass.progress >= 100 ? "done" : ""}`} style={{ width: `${clamp(selectedClass.progress, 0, 100)}%` }} />
                </div>
              </div>

              <div className="cs-modal-section-title" style={{ marginTop: 24 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Đánh giá từ sinh viên
              </div>

              {reviewsLoading ? <div style={{ color: "#64748b" }}>Đang tải đánh giá...</div> : null}
              {!!reviewsError ? <div style={{ color: "#c8102e" }}>{reviewsError}</div> : null}

              {reviews && reviews.length > 0 ? (
                <div className="cs-review-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="cs-review-item">
                      <div className="cs-review-header">
                        <span className="cs-review-user">
                          {me?.id && review.userId === me.id ? (me.fullName || "Bạn") : `User #${review.userId}`}
                        </span>
                        <span className="cs-review-rating">
                          {"★".repeat(clamp(Number(review.rating || 0), 0, 5))}
                          <span style={{ color: "#e5e7eb" }}>{"★".repeat(5 - clamp(Number(review.rating || 0), 0, 5))}</span>
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: "#0f172a" }}>{review.title || "—"}</div>
                      <div className="cs-review-comment">{review.content || "—"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cs-no-reviews">Chưa có đánh giá nào cho lớp học này.</div>
              )}

              <div className="cs-modal-section-title" style={{ marginTop: 24 }}>
                Đánh giá của bạn
              </div>

              {!canReviewNow ? (
                <div style={{ color: "#64748b", marginTop: 8 }}>
                  Bạn chỉ có thể gửi đánh giá khi lớp đang diễn ra.
                </div>
              ) : myReview ? (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: "#0f172a" }}>Bạn đã gửi đánh giá.</div>
                  <div className="cs-review-rating">
                    {"★".repeat(clamp(Number(myReview.rating || 0), 0, 5))}
                    <span style={{ color: "#e5e7eb" }}>{"★".repeat(5 - clamp(Number(myReview.rating || 0), 0, 5))}</span>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 10 }}>
                  {!!reviewSubmitError ? <div style={{ color: "#c8102e", marginBottom: 8 }}>{reviewSubmitError}</div> : null}

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Số sao:</div>
                    <div className="cs-review-rating" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewForm((p) => ({ ...(p || {}), rating: n }))}
                          disabled={reviewSubmitting}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: reviewSubmitting ? "not-allowed" : "pointer",
                            padding: 0,
                            fontSize: 18,
                            color: n <= Number(reviewForm.rating || 0) ? "#f59e0b" : "#e5e7eb",
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label>Tiêu đề *</label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm((p) => ({ ...(p || {}), title: e.target.value }))}
                      placeholder="VD: Lớp học hữu ích"
                      disabled={reviewSubmitting}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label>Nội dung *</label>
                    <textarea
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm((p) => ({ ...(p || {}), content: e.target.value }))}
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      disabled={reviewSubmitting}
                      rows={4}
                      style={{ width: "100%", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={submitMyReview}
                      disabled={reviewSubmitting}
                      style={{
                        border: "none",
                        background: reviewSubmitting ? "#94a3b8" : "#4f46e5",
                        color: "#fff",
                        fontWeight: 700,
                        padding: "10px 14px",
                        borderRadius: 10,
                        cursor: reviewSubmitting ? "not-allowed" : "pointer",
                      }}
                    >
                      {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </div>
                </div>
              )}

              {selectedClass.termCode === currentTerm ? (
                <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleUnregister}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      fontWeight: 700,
                      padding: "10px 14px",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                  >
                    Huỷ đăng ký lớp
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
