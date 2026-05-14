import React, { useState } from "react";

export default function FeedbackTab() {
  const [feedbackType, setFeedbackType] = useState("Lỗi kỹ thuật / Bug");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackContent.trim()) return;
    alert("Cảm ơn bạn! Phản hồi của bạn đã được gửi đến Ban quản trị hệ thống.");
    setFeedbackTitle("");
    setFeedbackContent("");
    setFeedbackType("Lỗi kỹ thuật / Bug");
  };

  return (
    <div className="feedback-container">
      <div className="feature-card-ui">
        <h3>Gửi phản hồi / Báo lỗi</h3>
        <p className="subtitle">
          Nếu bạn gặp vấn đề trong quá trình sử dụng hệ thống, vui lòng gửi phản hồi để Ban quản trị hỗ trợ khắc phục.
        </p>

        <form className="feedback-form" onSubmit={handleSubmitFeedback}>
          <div className="form-group">
            <label>
              Loại vấn đề <span className="required">*</span>
            </label>
            <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
              <option>Lỗi kỹ thuật / Bug (Không tải được trang, lỗi đăng nhập...)</option>
              <option>Thắc mắc về Dữ liệu (Sai điểm, thiếu môn học...)</option>
              <option>Góp ý cải thiện tính năng</option>
              <option>Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Tiêu đề <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Tóm tắt ngắn gọn vấn đề..."
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Nội dung chi tiết <span className="required">*</span>
            </label>
            <textarea
              rows="6"
              placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn-primary">
            Gửi Phản Hồi
          </button>
        </form>
      </div>
    </div>
  );
}

