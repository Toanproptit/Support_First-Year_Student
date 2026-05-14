import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/TuitionExemptionDetail.css";

export default function TuitionExemptionDetail() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info */}
                <div className="article-meta">
                    Học phí - học bổng <span className="dot">•</span> 1 phút đọc
                </div>

                {/* Tiêu đề chính */}
                <h1 className="article-title">
                    Thông báo thu hồ sơ xét miễn giảm học phí và hỗ trợ chi phí học tập HK2 (2024-2025)
                </h1>

                <div className="article-content">
                    <p className="intro-text">
                        Học viện Công nghệ Bưu chính Viễn thông thông báo triển khai thu hồ sơ xét miễn, giảm học phí và hỗ trợ chi phí học tập cho sinh viên hệ Đại học chính quy trong Học kỳ 2 năm học 2024-2025.
                    </p>

                    <h3 className="section-heading">Thông tin cần lưu ý:</h3>
                    <ul className="custom-list">
                        <li><strong>Đối tượng:</strong> Sinh viên thuộc các diện chính sách theo quy định tại Nghị định 81/2021/NĐ-CP.</li>
                        <li><strong>Hình thức:</strong> Sinh viên chuẩn bị hồ sơ minh chứng và nộp về Văn phòng một cửa theo đúng thời hạn.</li>
                        <li><strong>Chi tiết:</strong> Các mẫu đơn và hướng dẫn kê khai hồ sơ chi tiết được đăng tải tại website chính thức.</li>
                    </ul>

                    {/* NÚT BẤM DẪN THẲNG ĐẾN LINK BẠN GỬI */}
                    <div className="cta-wrapper">
                        <a
                            href="https://ptit.edu.vn/thong-bao-sinh-vien/thong-bao-ve-viec-thu-ho-so-xet-mien-giam-hoc-phi-va-ho-tro-chi-phi-hoc-tap-hoc-ky-2-nam-hoc-2024-2025"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-redirect"
                        >
                            Xem chi tiết thông báo và tải mẫu đơn &rarr;
                        </a>
                    </div>

                    {/* Điều hướng quay lại */}
                    <div className="article-bottom-nav">
                        <Link to="/cam-nang/2" className="btn-back">
                            <span>&larr;</span> Quay lại danh sách
                        </Link>
                        <Link to="/cam-nang" className="link-all">
                            Xem tất cả cẩm nang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}