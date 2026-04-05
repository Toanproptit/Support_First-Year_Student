import React from "react";
import { Link } from "react-router-dom";
import "../styles/ScholarshipDetail.css";

export default function ScholarshipDetail() {
    return (
        <div className="article-page">
            <div className="article-container">

                {/* Thanh điều hướng & Thời gian đọc */}
                <div className="article-meta">
                    <Link to="/cam-nang">Cẩm nang sinh viên</Link> &gt; <span>Học phí - học bổng</span>
                    <span className="read-time">• 3 phút đọc</span>
                </div>

                <h1 className="article-title">Học bổng khuyến khích học tập</h1>

                <div className="article-content">
                    <p>
                        Học bổng khuyến khích học tập được cấp cho sinh viên có kết quả học tập xuất sắc,
                        dựa trên kết quả học tập của học kỳ trước. Học bổng này tuân theo Quy định xét,
                        cấp học bổng cho người học của Học viện Công nghệ Bưu chính Viễn thông.
                    </p>

                    <h3 className="section-heading">Tiêu chuẩn xét học bổng:</h3>
                    <ul>
                        <li>Điểm rèn luyện đạt loại khá trở lên (từ 70/100 điểm)</li>
                        <li>Không có học phần nào bị điểm F trong học kỳ xét học bổng</li>
                        <li>Đăng ký đủ số tín chỉ tối thiểu theo quy định (15 tín chỉ/học kỳ)</li>
                    </ul>

                    <h3 className="section-heading">Mức học bổng:</h3>
                    <div className="table-responsive">
                        <table className="scholarship-table">
                            <thead>
                                <tr>
                                    <th>Loại học bổng</th>
                                    <th>Điều kiện</th>
                                    <th>Mức học bổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Xuất sắc</td>
                                    <td>GPA từ 3.6 đến 4.0, Rèn luyện Xuất sắc</td>
                                    <td>Bằng 130% mức học phí</td>
                                </tr>
                                <tr>
                                    <td>Giỏi</td>
                                    <td>GPA từ 3.2 đến cận 3.6, Rèn luyện từ loại Tốt trở lên</td>
                                    <td>Bằng 110% mức học phí</td>
                                </tr>
                                <tr>
                                    <td>Khá</td>
                                    <td>GPA từ 2.5 trở lên, Rèn luyện từ loại khá trở lên</td>
                                    <td>Bằng 100% mức học phí</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        Danh sách sinh viên nhận học bổng sẽ được công bố vào đầu mỗi học kỳ,
                        dựa trên kết quả học tập của học kỳ trước.
                    </p>

                    <h3 className="section-heading">Quy trình xét học bổng:</h3>
                    <ol>
                        <li>Phòng Công tác sinh viên tổng hợp kết quả học tập, rèn luyện</li>
                        <li>Hội đồng xét học bổng họp và quyết định danh sách</li>
                        <li>Công bố danh sách trên website trường và Khoa</li>
                        <li>Sinh viên nhận học bổng theo thông báo cụ thể</li>
                    </ol>

                    <h3 className="section-heading">Điểm cộng từ nghiên cứu khoa học:</h3>
                    <p>Sinh viên có đề tài nghiên cứu khoa học đạt giải sẽ được cộng điểm rèn luyện và điểm học tập như sau:</p>
                    <ul>
                        <li>Giải nhất, nhì cấp Bộ hoặc giải Euréka: Cộng 10 điểm cho 1 học phần hoặc 1 điểm vào khóa luận tốt nghiệp</li>
                        <li>Giải ba, khuyến khích cấp Bộ hoặc giải Euréka: Cộng 7 điểm vào 1 học phần hoặc 0,5 điểm vào khóa luận tốt nghiệp</li>
                        <li>Giải nhất cấp Trường: Cộng 3 điểm vào 1 học phần hoặc 0,3 điểm vào khóa luận tốt nghiệp</li>
                    </ul>
                    <div className="article-bottom-nav">
                        <Link
                            to="/cam-nang"
                            className="btn-back"
                            onClick={() => window.scrollTo(0, 0)} /* <-- THÊM DÒNG NÀY */
                        >
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
        </div>
    );
}