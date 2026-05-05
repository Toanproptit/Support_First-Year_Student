import React from "react";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  // Hiển thị tối đa 5 trang xung quanh trang hiện tại
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  if (currentPage <= 2) end = Math.min(totalPages, 5);
  if (currentPage >= totalPages - 1) start = Math.max(1, totalPages - 4);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="Trang đầu"
      >«</button>

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Trang trước"
      >‹</button>

      {start > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="page-ellipsis">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="page-ellipsis">…</span>}
          <button className="page-btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Trang sau"
      >›</button>

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Trang cuối"
      >»</button>

      <span className="page-info">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
}
