import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ClassSchedule.css";

export default function ClassSchedule() {
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info */}
                <div className="article-meta">
                    Hướng dẫn học vụ <span className="dot">•</span> 3 phút đọc
                </div>

                {/* Tiêu đề chính */}
                <h1 className="article-title">Khung thời gian ra vào lớp</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">

                    {/* --- PHẦN 2 --- */}
                    <h3 className="section-heading text-uppercase">1. HỆ THỐNG TIẾT HỌC</h3>
                    <p>
                        Mỗi ngày học tại PTIT được chia thành 13 tiết, mỗi tiết kéo dài khoảng 50 phút,
                        giữa các tiết có thời gian nghỉ ngắn từ 5–10 phút.
                    </p>

                    <p><strong>Bảng thời gian chi tiết:</strong></p>
                    <ul className="custom-list">
                        <li>Tiết 1: 07:00 – 07:50</li>
                        <li>Tiết 2: 08:00 – 08:50</li>
                        <li>Tiết 3: 09:00 – 09:50</li>
                        <li>Tiết 4: 10:00 – 10:50</li>
                        <li>Tiết 5: 11:00 – 11:50</li>
                        <li>Tiết 6: 12:00 – 12:50</li>
                        <li>Tiết 7: 13:00 – 13:50</li>
                        <li>Tiết 8: 14:00 – 14:50</li>
                        <li>Tiết 9: 15:00 – 15:50</li>
                        <li>Tiết 10: 16:00 – 16:50</li>
                        <li>Tiết 11: 17:00 – 17:50</li>
                        <li>Tiết 12: 18:00 – 18:50</li>
                        <li>Tiết 13: 19:00 – 19:50</li>
                    </ul>

                    {/* --- PHẦN 3 --- */}
                    <h3 className="section-heading text-uppercase">2. PHÂN CHIA CA HỌC TRONG NGÀY</h3>
                    <p>Dựa trên hệ thống tiết học, thời gian học được chia thành 3 ca chính:</p>

                    <p><strong>2.1. Ca sáng:</strong></p>
                    <ul className="custom-list">
                        <li>Thời gian: 07:00 – 11:50</li>
                        <li>Bao gồm: Tiết 1 đến Tiết 5</li>
                        <li>Đặc điểm: Chủ yếu học các môn lý thuyết. Sinh viên tập trung đông.</li>
                    </ul>

                    <p><strong>2.2. Ca chiều:</strong></p>
                    <ul className="custom-list">
                        <li>Thời gian: 13:00 – 17:50</li>
                        <li>Bao gồm: Tiết 6 đến Tiết 10</li>
                        <li>Đặc điểm: Kết hợp học lý thuyết và thực hành. Nhiều lớp học chuyên ngành.</li>
                    </ul>

                    <p><strong>2.3. Ca tối:</strong></p>
                    <ul className="custom-list">
                        <li>Thời gian: 6:00 – 20:50</li>
                        <li>Bao gồm: Tiết 11 đến Tiết 13</li>
                        <li>Đặc điểm: Chủ yếu dành cho: Lớp học bù, Lớp thực hành, Một số môn học đặc thù.</li>
                    </ul>

                    {/* --- PHẦN 4 --- */}
                    <h3 className="section-heading text-uppercase">3. QUY ĐỊNH RA VÀO LỚP</h3>

                    <p><strong>3.1. Thời gian vào lớp:</strong></p>
                    <ul className="custom-list">
                        <li>Sinh viên cần có mặt tại lớp trước giờ học từ 5–10 phút.</li>
                        <li>Giảng viên thường tiến hành: Điểm danh đầu giờ hoặc kiểm tra giữa buổi.</li>
                    </ul>

                    <p><strong>3.2. Quy định đi muộn:</strong></p>
                    <ul className="custom-list">
                        <li>Sinh viên đến muộn sau 10–15 phút có thể không được tính điểm danh.</li>
                        <li>Một số giảng viên có thể không cho vào lớp.</li>
                    </ul>

                    <p><strong>3.3. Quy định ra khỏi lớp:</strong></p>
                    <ul className="custom-list">
                        <li>Sinh viên không được tự ý rời lớp khi chưa kết thúc tiết học.</li>
                        <li>Trường hợp đặc biệt cần xin phép giảng viên.</li>
                    </ul>

                    {/* --- PHẦN 5 --- */}
                    <h3 className="section-heading text-uppercase">4. HÌNH THỨC TỔ CHỨC HỌC</h3>
                    <ul className="custom-list">
                        <li>Một buổi học thường kéo dài: 2 đến 4 tiết liên tiếp.</li>
                        <li>Các tiết học được xếp theo block: Ví dụ: Tiết 1–3, Tiết 6–9,…</li>
                        <li>Thời khóa biểu được xây dựng theo: Tuần học và Học kỳ.</li>
                    </ul>

                    {/* ========================================= */}
                    {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
                    {/* ========================================= */}
                    <div className="article-bottom-nav">
                        <Link to="/cam-nang/3" className="btn-back" onClick={() => window.scrollTo(0, 0)}>
                            <span>&larr;</span> Quay lại danh sách
                        </Link>
                        <Link to="/cam-nang" className="link-all" onClick={() => window.scrollTo(0, 0)}>
                            Xem tất cả cẩm nang
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}