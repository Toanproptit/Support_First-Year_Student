import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Club.css";
import "../styles/ScholarshipDetail.css";
import { getAllClubs } from "../service/clubs";

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

function buildFallbackAvatar(name) {
  const safeName = (name || "CLB").trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    safeName.slice(0, 8)
  )}&background=0284c7&color=fff&rounded=true&bold=true`;
}

export default function Club() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const list = await getAllClubs();
        if (!active) return;
        setClubs(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!active) return;
        setError(getErrorMessage(e, "Không tải được danh sách câu lạc bộ."));
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  const viewClubs = useMemo(() => {
    return (clubs || []).map((c) => {
      const name = (c?.name || "CLB").trim();
      const link = c?.linkFacebook || c?.linkWeb || c?.linkYoutube || "";
      const logo = c?.image || buildFallbackAvatar(name);
      return {
        id: c?.id ?? name,
        name,
        leader: c?.head || "",
        link,
        logo,
      };
    });
  }, [clubs]);

  return (
    <div className="article-page">
      <div className="article-container" style={{ maxWidth: "1200px" }}>
        <div className="article-meta">
          <Link to="/cam-nang">Cẩm nang sinh viên</Link> &gt;{" "}
          <span>Câu lạc bộ, Đội, Nhóm</span>
        </div>

        <h1 className="article-title">Danh sách Câu lạc bộ, Đội, Nhóm</h1>

        <div className="article-content">
          {loading && <p style={{ marginTop: 12 }}>Đang tải...</p>}
          {!!error && (
            <p style={{ marginTop: 12, color: "#c8102e" }}>{error}</p>
          )}

          <div className="club-grid-container">
            {viewClubs.map((club) => (
              <div key={club.id} className="club-card">
                <div className="club-logo-wrap">
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="club-logo"
                  />
                </div>

                <div className="club-info">
                  <h3>{club.name}</h3>
                  <p className="club-leader">
                    <strong>Chủ nhiệm:</strong>{" "}
                    {club.leader || "Đang cập nhật"}
                  </p>
                </div>

                <hr className="club-divider" />

                <div className="club-footer">
                  {club.link ? (
                    <a
                      href={club.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="club-link"
                    >
                      {club.link.replace(
                        "https://www.facebook.com/",
                        "fb.com/"
                      )}
                    </a>
                  ) : (
                    <span
                      className="club-link"
                      style={{ cursor: "default" }}
                    >
                      Đang cập nhật
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="article-bottom-nav">
            <Link
              to="/cam-nang"
              className="btn-back"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span>&larr;</span> Quay lại danh sách
            </Link>
            <Link
              to="/cam-nang"
              className="link-all"
              onClick={() => window.scrollTo(0, 0)}
            >
              Xem tất cả cẩm nang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

