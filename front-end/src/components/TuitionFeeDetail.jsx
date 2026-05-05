import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/TuitionFeeDetail.css";



export default function TuitionFeeDetail() {
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info Breadcrumb */}
                <div className="article-meta">
                    Học phí - học bổng <span className="dot">•</span> 1 phút đọc
                </div>

                {/* Tiêu đề chính */}
                <h1 className="article-title">Thông báo quyết định ban hành mức thu học phí năm học 2025-2026</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">

                    {/* Thanh Meta Info (Giáo vụ, Ngày tháng, Người đăng) */}

                    <p className="main-text">
                        Ngày 30/6/2025, Học viện Công nghệ Bưu chính Viễn thông đã ban hành Quyết định số 1120/QĐ-HV về việc ban hành mức thu học phí năm học 2025-2026.
                    </p>

                    <p className="main-text">
                        Xem thông tin tại đây: <a href="https://ptit.edu.vn/wp-content/uploads/2025/07/Quyet-dinh-vv-ban-hanh-muc-thu-hoc-phi-nam-hoc-2025-2026.pdf" target="_blank" rel="noreferrer" className="pdf-link">
                            Quyết định vv ban hành mức thu học phí năm học 2025-2026
                        </a>
                    </p>

                    {/* ========================================= */}
                    {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
                    {/* ========================================= */}
                    <div className="article-bottom-nav">
                        <Link to="/cam-nang/2" className="btn-back" onClick={() => window.scrollTo(0, 0)}>
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