import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/TuitionAndScholarshipList.css";

export default function TuitionAndScholarshipList() {
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Dữ liệu các bài viết 
    const articles = [
        {
            id: 1,
            title: "Mức học phí các ngành đào tạo",
            time: "1 phút đọc",
            excerpt: "Ngày 30/6/2025, Học viện Công nghệ Bưu chính Viễn thông đã ban hành Quyết định số 1120/QĐ-HV về việc ban hành mức thu học phí năm học 2025-2026..."
        },
        {
            id: 2,
            title: "Học bổng khuyến khích học tập",
            time: "4 phút đọc",
            excerpt: "Học bổng khuyến khích học tập (KKHT) được cấp cho sinh viên hệ chính quy dài hạn (các khóa từ 2021 khối kỹ thuật đến 2024) có kết quả học tập xuất sắc..."
        },
        {
            id: 3,
            title: "Miễn giảm học phí",
            time: "1 phút đọc",
            excerpt: "Học viện Công nghệ Bưu chính Viễn thông thông báo triển khai thu hồ sơ xét miễn, giảm học phí và hỗ trợ chi phí học tập cho sinh viên hệ Đại học chính quy..."
        }
    ];

    return (
        <div className="ts-page">
            <div className="ts-container">

                {/* Thanh điều hướng Breadcrumb */}
                <div className="ts-breadcrumb">
                    <Link to="/cam-nang">Cẩm nang sinh viên</Link> &gt; <span>Học phí - học bổng</span>
                </div>

                <h1 className="ts-page-title">Học phí - học bổng</h1>

                {/* Lưới danh sách bài viết */}
                <div className="ts-grid">
                    {articles.map((article) => (
                        <div className="ts-card" key={article.id}>
                            <div className="ts-meta">
                                Học phí - học bổng • {article.time}
                            </div>
                            <h2 className="ts-title">{article.title}</h2>
                            <p className="ts-excerpt">{article.excerpt}</p>

                            {/* Link trỏ vào chi tiết từng bài viết */}
                            <Link to={`/cam-nang/2/bai-viet/${article.id}`} className="ts-link">
                                Xem chi tiết &rarr;
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Thanh điều hướng dưới cùng */}
                <div className="ts-bottom-nav">
                    <Link to="/cam-nang" className="btn-back" onClick={() => window.scrollTo(0, 0)}>
                        <span>&larr;</span> Quay lại danh sách
                    </Link>
                    <Link to="/cam-nang" className="link-all" onClick={() => window.scrollTo(0, 0)}>
                        Xem tất cả cẩm nang
                    </Link>
                </div>

            </div>
        </div>
    );
}