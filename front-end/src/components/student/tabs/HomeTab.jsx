import React from "react";

export default function HomeTab({ userInfo }) {
  return (
    <>
      <div className="welcome-card">
        <div className="user-info">
          <div className="avatar-large">VT</div>
          <div>
            <p className="greeting">Xin chào</p>
            <h3 className="user-name">{userInfo?.name}</h3>
          </div>
        </div>
      </div>

      <div className="info-cards-row">
        <div className="info-card">
          <h4>Chương trình đào tạo</h4>
          <p>
            Tên chương trình: <strong>Cử nhân</strong>
          </p>
          <p>
            Mã chương trình: <strong>CN</strong>
          </p>
        </div>
        <div className="info-card">
          <h4>Kỳ học hiện tại</h4>
          <p>
            Kỳ học: <strong>Học kỳ 1 Năm Học 2025-2026</strong>
          </p>
          <p>
            Năm học: <strong>2025</strong>
          </p>
        </div>
      </div>
    </>
  );
}

