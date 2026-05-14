import React, { useState } from "react";

export default function ProfileTab({ userInfo, setUserInfo }) {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ phone: "", personalEmail: "" });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const openEditProfileModal = () => {
    setEditFormData({
      phone: userInfo.phone,
      personalEmail: userInfo.personalEmail,
    });
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserInfo({
      ...userInfo,
      phone: editFormData.phone,
      personalEmail: editFormData.personalEmail,
    });
    setIsEditProfileModalOpen(false);
    alert("Cập nhật thông tin liên lạc thành công!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("Lỗi: Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      alert("Lỗi: Mật khẩu mới phải bao gồm ít nhất 1 chữ IN HOA, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Lỗi: Mật khẩu mới và Nhập lại mật khẩu không khớp nhau!");
      return;
    }

    alert("Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  };

  return (
    <>
      <div className="profile-container">
        <div className="feature-card-ui profile-card">
          <div className="profile-header-box">
            <div className="avatar-huge">VT</div>
            <div className="profile-titles">
              <h2>{userInfo.name}</h2>
              <p className="student-badge">Sinh viên Đại học Chính quy</p>
            </div>
            <button className="edit-profile-btn" onClick={openEditProfileModal}>
              Chỉnh sửa
            </button>
          </div>

          <div className="profile-details-grid">
            <div className="detail-box">
              <span className="detail-label">Mã sinh viên</span>
              <strong className="detail-value">{userInfo.studentId}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Lớp</span>
              <strong className="detail-value">{userInfo.class}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Chuyên ngành</span>
              <strong className="detail-value">{userInfo.major}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Khoa / Viện</span>
              <strong className="detail-value">{userInfo.department}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Email trường cấp</span>
              <strong className="detail-value">{userInfo.schoolEmail}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Email cá nhân</span>
              <strong className="detail-value">{userInfo.personalEmail}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Số điện thoại liên hệ</span>
              <strong className="detail-value">{userInfo.phone}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Niên khóa</span>
              <strong className="detail-value">{userInfo.batch}</strong>
            </div>
            <div className="detail-box">
              <span className="detail-label">Trạng thái học tập</span>
              <strong className="detail-value status-active">{userInfo.status}</strong>
            </div>
          </div>
        </div>

        <div className="feature-card-ui security-card" style={{ marginTop: "20px" }}>
          <h3>Bảo mật tài khoản</h3>

          {!isChangingPassword ? (
            <div className="security-status">
              <p>Mật khẩu của bạn đã được bảo vệ. Bạn nên đổi mật khẩu định kỳ để đảm bảo an toàn.</p>
              <button className="open-pw-btn" onClick={() => setIsChangingPassword(true)}>
                Đổi mật khẩu
              </button>
            </div>
          ) : (
            <form className="change-pw-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>
                  Mật khẩu hiện tại <span className="required">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>
                    Mật khẩu mới <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="In hoa, in thường, số, ký tự đặc biệt..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Nhập lại mật khẩu mới <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pw-form-actions">
                <button type="submit" className="submit-btn-primary">
                  Lưu mật khẩu mới
                </button>
                <button type="button" className="cancel-pw-btn" onClick={() => setIsChangingPassword(false)}>
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {isEditProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cập nhật thông tin liên lạc</h3>
            <p>
              Bạn chỉ có thể thay đổi các thông tin liên hệ. Các thông tin học vụ khác vui lòng liên hệ phòng giáo vụ.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email cá nhân</label>
                <input
                  type="email"
                  value={editFormData.personalEmail}
                  onChange={(e) => setEditFormData({ ...editFormData, personalEmail: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditProfileModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
