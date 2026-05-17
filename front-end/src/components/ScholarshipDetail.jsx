import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ScholarshipDetail.css";

export default function ScholarshipDetail() {
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info chuẩn */}
                <div className="article-meta">
                    Học phí - học bổng <span className="dot">•</span> 4 phút đọc
                </div>

                {/* Tiêu đề chính */}
                <h1 className="article-title">Học bổng khuyến khích học tập</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">
                    <p>
                        Học bổng khuyến khích học tập (KKHT) được cấp cho sinh viên hệ chính quy dài hạn (các khóa từ 2021 khối kỹ thuật đến 2024) có kết quả học tập xuất sắc. Học bổng tuân theo Quy chế của Bộ GD&ĐT và của Học viện Công nghệ Bưu chính Viễn thông.
                    </p>

                    <h3 className="section-heading">1. Điều kiện xét duyệt chung</h3>
                    <ul className="custom-list">
                        <li>
                            <strong>Số tín chỉ tối thiểu:</strong> Hoàn thành ít nhất <strong>15 tín chỉ</strong> (đối với khối kinh tế, báo chí) hoặc <strong>16 tín chỉ</strong> (đối với khối kỹ thuật).<br />
                            <em style={{ color: "#666", fontSize: "15px" }}>* Trường hợp đặc biệt do đặc thù tiến trình đào tạo, miễn học miễn thi khiến số tín chỉ bắt buộc ít hơn quy định sẽ do Giám đốc Học viện quyết định.</em>
                        </li>
                        <li><strong>Kết quả học tập:</strong> Từ loại Khá trở lên, <strong>không có học phần không đạt</strong> (sau lần thi 1).</li>
                        <li><strong>Kỷ luật:</strong> Không bị kỷ luật từ mức khiển trách trở lên trong kỳ học xét học bổng.</li>
                    </ul>

                    <h3 className="section-heading">2. Tiêu chuẩn và Mức học bổng</h3>
                    <p>
                        <em>Lưu ý: TBCMR (Trung bình chung mở rộng) = Điểm TBC học tập + điểm thưởng (nếu có).</em>
                    </p>

                    <div className="table-responsive">
                        <table className="scholarship-table">
                            <thead>
                                <tr>
                                    <th>Loại học bổng</th>
                                    <th>Tiêu chuẩn mức sàn</th>
                                    <th>Mức học bổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-bold">Xuất sắc</td>
                                    <td>TBCMR ≥ 3.60 và Rèn luyện ≥ 90</td>
                                    <td>Bằng <strong className="highlight-red">120%</strong> mức học bổng loại Khá</td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">Giỏi</td>
                                    <td>TBCMR ≥ 3.20 và Rèn luyện ≥ 80</td>
                                    <td>Bằng <strong className="highlight-red">110%</strong> mức học bổng loại Khá</td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">Khá</td>
                                    <td>TBCMR ≥ 2.50 và Rèn luyện ≥ 65</td>
                                    <td>Bằng <strong className="highlight-red">100%</strong> mức học phí của các học phần tính GPA theo tiến trình chuẩn</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="section-heading">3. Quy trình và Điểm chuẩn xét duyệt</h3>
                    <ul className="custom-list">
                        <li>Học bổng được xét chung trong toàn Học viện, cấp theo khóa/ngành và ưu tiên xét từ loại <strong>Xuất sắc &rarr; Giỏi &rarr; Khá</strong>.</li>
                        <li>Trường hợp cùng loại học bổng, ưu tiên sinh viên có TBCMR cao hơn; nếu TBCMR bằng nhau sẽ ưu tiên sinh viên có Điểm rèn luyện cao hơn.</li>
                        <li>
                            <strong>Lưu ý về Điểm chuẩn:</strong> Do chỉ tiêu có hạn, Học viện sẽ có một "mức điểm chuẩn TBCMR" cho từng loại.
                            <ul className="nested-list">
                                <li>Sinh viên phải có <strong>TBCMR &gt; Mức điểm chuẩn</strong> để được nhận.</li>
                                <li>Trường hợp <strong>TBCMR = Mức điểm chuẩn</strong>, Điểm rèn luyện của sinh viên phải <strong>&ge;</strong> mức điểm rèn luyện do Hội đồng kết luận.</li>
                            </ul>
                        </li>
                    </ul>

                    <h3 className="section-heading">4. Danh sách và Hình thức chi trả</h3>
                    <ul className="custom-list">
                        <li><strong>Thông báo:</strong> Danh sách sinh viên nhận học bổng sẽ được gửi trực tiếp tới <strong>Email sinh viên</strong> do Học viện cấp.</li>
                        <li><strong>Thắc mắc, khiếu nại:</strong> Sinh viên dùng email trường gửi về địa chỉ Cô Chu Phương Hiền (cphien@ptit.edu.vn).</li>
                        <li><strong>Chi trả:</strong> Học bổng dự kiến chi trả từ ngày qua tài khoản ngân hàng sinh viên đã đăng ký với trường.</li>
                        <li><em style={{ color: "#c8102e" }}>* Lưu ý: Đối với các sinh viên của Cơ sở Học viện tại TP. Hồ Chí Minh sẽ có thông báo xét duyệt riêng.</em></li>
                    </ul>

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