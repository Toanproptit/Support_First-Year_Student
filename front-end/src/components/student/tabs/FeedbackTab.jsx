import React, { useEffect, useState } from "react";
import { useToast } from "../../ToastProvider";
import { getMe } from "../../../service/me";
import { createFeedback } from "../../../service/feedbacks";

export default function FeedbackTab() {
  const [feedbackType, setFeedbackType] = useState("Lỗi kỹ thuật / Bug");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const meRes = await getMe();
        if (!cancelled) setMe(meRes);
      } catch {
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackContent.trim()) return;

    try {
      setLoading(true);
      await createFeedback({
        subject: feedbackType,
        title: feedbackTitle.trim(),
        content: feedbackContent.trim(),
        userId: me?.id,
      });

      toast.show({
        type: "success",
        title: "Đã gửi phản hồi",
        message: "Cảm ơn bạn! Phản hồi của bạn đã được gửi đến Ban quản trị hệ thống.",
        durationMs: 2500,
      });

      setFeedbackTitle("");
      setFeedbackContent("");
      setFeedbackType("Lỗi kỹ thuật / Bug");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gửi phản hồi thất bại.";
      toast.show({ type: "error", title: "Không gửi được", message: msg });
    } finally {
      setLoading(false);
    }
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
            <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} disabled={loading}>
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
              disabled={loading}
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
              disabled={loading}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn-primary" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi Phản Hồi"}
          </button>
        </form>
      </div>
    </div>
  );
}
