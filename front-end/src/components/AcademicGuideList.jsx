import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/AcademicGuideList.css";

export default function AcademicGuideList() {
    // Tự động cuộn lên đầu trang khi vào trang này
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Dữ liệu giả lập (Mock data) từ hình ảnh
    // Dữ liệu đã được cập nhật chuẩn xác theo nội dung của PTIT
    // Dữ liệu đã được cập nhật chuẩn xác, trích xuất y nguyên dòng đầu của bài viết
    const guides = [
        {
            id: 1,
            title: "Các địa điểm học tập",
            time: "1 phút đọc",
            excerpt: "1. Cơ sở đào tạo chính (Hà Đông) Địa chỉ: Km10, đường Nguyễn Trãi / 96A Trần Phú, Hà Đông, Hà Nội Đây là nơi học tập chính của sinh viên PTIT Hà Nội (BVH) Các khu học tập bên trong: Giảng đường..."
        },
        {
            id: 2,
            title: "Khung thời gian ra vào lớp",
            time: "2 phút đọc",
            excerpt: "1. HỆ THỐNG TIẾT HỌC Mỗi ngày học tại PTIT được chia thành 13 tiết, mỗi tiết kéo dài khoảng 50 phút, giữa các tiết có thời gian nghỉ ngắn từ 5–10 phút. Bảng thời gian chi tiết: Tiết 1..."
        },
        {
            id: 3,
            title: "Hệ thống thông tin sinh viên",
            time: "3 phút đọc",
            excerpt: "Hệ thống thông tin dành cho sinh viên: Cổng thông tin chính của Học viện có địa chỉ https://ptit.edu.vn. Đây là nơi cung cấp các thông tin: Giới thiệu về Học viện, cơ cấu tổ chức (khoa, viện..."
        },
        {
            id: 4,
            title: "Danh hiệu và khen thưởng",
            time: "5 phút đọc",
            excerpt: "1. Khen thưởng sinh viên Học viện Công nghệ Bưu chính Viễn thông thực hiện công tác khen thưởng sinh viên nhằm khuyến khích, động viên kịp thời các cá nhân và tập thể đạt thành tích xuất sắc..."
        }
    ];

    return (
        <div className="guide-page">
            <div className="guide-container">

                {/* Thanh điều hướng Breadcrumb */}
                <div className="guide-breadcrumb">
                    <Link to="/cam-nang">Cẩm nang sinh viên</Link> &gt; <span>Hướng dẫn học vụ</span>
                </div>

                <h1 className="guide-page-title">Hướng dẫn học vụ</h1>

                {/* Lưới danh sách bài viết */}
                <div className="guide-grid">
                    {guides.map((guide) => (
                        <div className="guide-card" key={guide.id}>
                            <div className="guide-meta">
                                Hướng dẫn học vụ • {guide.time}
                            </div>
                            <h2 className="guide-title">{guide.title}</h2>
                            <p className="guide-excerpt">{guide.excerpt}</p>

                            {/* Link giả định trỏ vào chi tiết bài viết */}
                            <Link to={`/cam-nang/3/bai-viet/${guide.id}`} className="guide-link">
                                Xem chi tiết &rarr;
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Thanh điều hướng dưới cùng (đồng bộ với các trang trước) */}
                <div className="guide-bottom-nav">
                    <Link to="/cam-nang" className="btn-back">
                        <span>&larr;</span> Quay lại danh sách
                    </Link>
                    <Link
                        to="/cam-nang"
                        className="link-all"
                        onClick={() => window.scrollTo(0, 0)} /* <-- THÊM DÒNG NÀY */
                    >
                        Xem tất cả cẩm nang
                    </Link>
                </div>

            </div>
        </div>
    );
}