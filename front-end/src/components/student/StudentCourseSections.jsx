import React, { useMemo, useState } from "react";
import "../../styles/StudentCourseSections.css";

const semesters = ["HK2 (2023-2024)", "HK1 (2023-2024)", "HK2 (2022-2023)"];
const currentSemester = "HK2 (2023-2024)";

const seedCourseSections = [
  {
    id: 1,
    code: "INT1234",
    name: "Nhập môn Lập trình",
    teacher: "GV A",
    room: "A101",
    progress: 35,
    status: "upcoming",
    semester: "HK2 (2023-2024)",
    details: "Môn học giới thiệu về lập trình cơ bản với C++. Cung cấp kiến thức nền tảng vững chắc cho sinh viên CNTT.",
    reviews: [],
    bg: "linear-gradient(135deg, rgba(14,165,233,.25), rgba(99,102,241,.25))",
    color: "#4f46e5",
  },
  {
    id: 2,
    code: "MAT1010",
    name: "Toán cao cấp",
    teacher: "GV B",
    room: "B203",
    progress: 70,
    status: "muted",
    semester: "HK2 (2023-2024)",
    details: "Môn học về giải tích và đại số tuyến tính.",
    reviews: [],
    bg: "linear-gradient(135deg, rgba(34,197,94,.25), rgba(16,185,129,.25))",
    color: "#059669",
  },
  {
    id: 3,
    code: "ENG1001",
    name: "Tiếng Anh 1",
    teacher: "GV C",
    room: "C305",
    progress: 100,
    status: "done",
    semester: "HK1 (2023-2024)",
    details: "Tiếng Anh cơ bản cho sinh viên năm nhất.",
    reviews: [
      { id: 1, user: "Nguyễn Văn A", rating: 5, comment: "Giảng viên siêu nhiệt tình, bài tập vừa phải, dễ hiểu!" },
      { id: 2, user: "Trần Thị B", rating: 4, comment: "Lớp học tương tác nhiều, rất vui. Khuyên các bạn nên học." }
    ],
    bg: "linear-gradient(135deg, rgba(200,16,46,.2), rgba(251,113,133,.2))",
    color: "#c8102e",
  },
  {
    id: 4,
    code: "PHY101",
    name: "Vật lý đại cương",
    teacher: "GV D",
    room: "D402",
    progress: 100,
    status: "done",
    semester: "HK1 (2023-2024)",
    details: "Vật lý cơ bản.",
    reviews: [
      { id: 1, user: "Lê Văn C", rating: 3, comment: "Nội dung hơi khó hiểu so với mình." }
    ],
    bg: "linear-gradient(135deg, rgba(14,165,233,.25), rgba(99,102,241,.25))",
    color: "#4f46e5",
  }
];

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

export default function StudentCourseSections() {
  const [query, setQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);
  const [selectedClass, setSelectedClass] = useState(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return seedCourseSections.filter((c) => {
      if (c.semester !== selectedSemester) return false;
      if (!normalized) return true;
      const haystack = `${c.code} ${c.name} ${c.teacher} ${c.room}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, selectedSemester]);

  return (
    <div className="cs-page">
      <div className="cs-toolbar">
        <div>
          <div className="cs-subtitle">Danh sách lớp tín chỉ của bạn</div>
        </div>
        <div className="cs-toolbar-actions">
          <div className="cs-select-wrapper">
            <select
              className="cs-filter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
            <svg className="cs-select-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="cs-search-wrapper">
            <svg className="cs-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              className="cs-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo mã, tên môn, GV..."
            />
          </div>
        </div>
      </div>

      <div className="cs-grid">
        {filtered.map((c) => (
          <article
            key={c.id}
            className="cs-card"
            onClick={() => setSelectedClass(c)}
          >
            <div className="cs-card-top">
              <div className="cs-id" style={{ background: c.bg, color: c.color }}>
                {c.id}
              </div>
              <div className={`cs-badge ${statusClass(c.status)}`}>{statusLabel(c.status)}</div>
            </div>

            <div className="cs-card-body">
              <div className="cs-code">{c.code}</div>
              <div className="cs-name">{c.name}</div>
            </div>

            <div className="cs-meta-row">
              <div className="cs-meta">
                <div className="cs-meta-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="cs-meta-info">
                  <div className="cs-meta-label">Giảng viên</div>
                  <div className="cs-meta-value">{c.teacher}</div>
                </div>
              </div>
              <div className="cs-meta">
                <div className="cs-meta-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div className="cs-meta-info">
                  <div className="cs-meta-label">Phòng</div>
                  <div className="cs-meta-value">{c.room}</div>
                </div>
              </div>
            </div>

            <div className="cs-progress">
              <div className="cs-progress-bar">
                <div
                  className={`cs-progress-fill ${c.progress >= 100 ? "done" : ""}`}
                  style={{ width: `${Math.max(0, Math.min(100, c.progress))}%` }}
                />
              </div>
              <div className="cs-progress-text">{c.progress}%</div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="cs-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p>Không tìm thấy lớp tín chỉ nào.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedClass && (
        <div className="cs-modal-overlay" onClick={() => setSelectedClass(null)}>
          <div className="cs-modal" onClick={e => e.stopPropagation()}>
            <div className="cs-modal-header">
              <div>
                <div className="cs-modal-title">{selectedClass.name}</div>
                <div className="cs-modal-subtitle">
                  <span className="cs-tag">{selectedClass.code}</span>
                  <span>•</span>
                  <span>{selectedClass.teacher}</span>
                  <span>•</span>
                  <span>Phòng {selectedClass.room}</span>
                </div>
              </div>
              <button className="cs-modal-close" onClick={() => setSelectedClass(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="cs-modal-body">
              {selectedSemester === currentSemester ? (
                <>
                  <div className="cs-modal-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Thông tin lớp học
                  </div>
                  <div className="cs-modal-desc">{selectedClass.details || "Chưa có thông tin chi tiết cho lớp học này."}</div>

                  <div className="cs-modal-section-title" style={{ marginTop: 24 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Tiến độ học tập ({selectedClass.progress}%)
                  </div>
                  <div className="cs-progress" style={{ marginTop: 12 }}>
                    <div className="cs-progress-bar" style={{ height: 10 }}>
                      <div
                        className={`cs-progress-fill ${selectedClass.progress >= 100 ? "done" : ""}`}
                        style={{ width: `${Math.max(0, Math.min(100, selectedClass.progress))}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="cs-modal-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Đánh giá từ sinh viên
                  </div>

                  {selectedClass.reviews && selectedClass.reviews.length > 0 ? (
                    <div className="cs-review-list">
                      {selectedClass.reviews.map(review => (
                        <div key={review.id} className="cs-review-item">
                          <div className="cs-review-header">
                            <span className="cs-review-user">{review.user}</span>
                            <span className="cs-review-rating">
                              {"★".repeat(review.rating)}
                              <span style={{ color: "#e5e7eb" }}>{"★".repeat(5 - review.rating)}</span>
                            </span>
                          </div>
                          <div className="cs-review-comment">{review.comment}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="cs-no-reviews">Chưa có đánh giá nào cho lớp học này.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}