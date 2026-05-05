import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/StudyLocations.css";

export default function StudyLocations() {
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info */}
                <div className="article-meta">
                    Hướng dẫn học vụ <span className="dot">•</span> 2 phút đọc
                </div>

                {/* Tiêu đề */}
                <h1 className="article-title">Các địa điểm học tập</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">

                    {/* Phần 1 */}
                    <h3 className="section-heading">1. Cơ sở đào tạo chính (Hà Đông)</h3>
                    <ul className="custom-list">
                        <li> <strong>Địa chỉ:</strong> Km10, đường Nguyễn Trãi / 96A Trần Phú, Hà Đông, Hà Nội</li>
                        <li> Đây là nơi học tập chính của sinh viên PTIT Hà Nội (BVH)</li>
                        <li> <strong>Các khu học tập bên trong:</strong>
                            <ul className="nested-list">
                                <li>
                                    <strong>Giảng đường (A1, A2, A3,…)</strong><br />
                                    Học lý thuyết, học đại cương, chuyên ngành
                                </li>
                                <li>
                                    <strong>Phòng máy (lab)</strong><br />
                                    Lập trình, mạng máy tính, AI, an toàn thông tin
                                </li>
                                <li>
                                    <strong>Thư viện</strong><br />
                                    Không gian tự học + tài liệu chuyên ngành
                                </li>
                                <li>
                                    <strong>Khu tự học / hành lang / sân trường</strong><br />
                                    Sinh viên thường ngồi học nhóm
                                </li>
                            </ul>
                        </li>

                    </ul>

                    {/* Phần 2 */}
                    <h3 className="section-heading"> 2. Trụ sở chính (Cầu Giấy)</h3>
                    <ul className="custom-list">
                        <li> <strong>Địa chỉ:</strong> 122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</li>
                        <li> <strong>Vai trò:</strong>
                            <ul className="nested-list">
                                <li>Không phải nơi học chính của sinh viên</li>
                                <li>Chủ yếu: Làm việc hành chính</li>
                                <li>Một số lớp đặc biệt / sau đại học</li>
                            </ul>
                        </li>
                    </ul>

                    {/* Phần 3 */}
                    <h3 className="section-heading"> 3. Các khu học tập chức năng trong cơ sở Hà Đông</h3>

                    <h4 className="sub-heading"> Phòng thí nghiệm & lab chuyên ngành</h4>
                    <ul className="nested-list">
                        <li>Lab mạng (CCNA, hệ thống mạng)</li>
                        <li>Lab lập trình / AI / dữ liệu</li>
                        <li>Lab viễn thông</li>
                    </ul>


                    <h4 className="sub-heading"> Thư viện PTIT</h4>
                    <ul className="nested-list">
                        <li>Không gian học yên tĩnh</li>
                        <li>Có máy tính + wifi</li>
                        <li>Tài liệu chuyên ngành CNTT, điện tử</li>
                    </ul>


                    <h4 className="sub-heading"> Khu tự học & học nhóm</h4>
                    <ul className="nested-list">
                        <li>Hành lang các tòa nhà</li>
                        <li>Ghế đá sân trường</li>
                        <li>Căn tin</li>
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