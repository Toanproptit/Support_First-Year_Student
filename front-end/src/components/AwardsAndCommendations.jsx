import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/AwardsAndCommendations.css";

export default function AwardsAndCommendations() {
    // Tự động cuộn lên đầu trang khi chuyển trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info */}
                <div className="article-meta">
                    Hướng dẫn học vụ <span className="dot">•</span> 5 phút đọc
                </div>

                {/* Tiêu đề chính */}
                <h1 className="article-title">Danh hiệu và khen thưởng</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">

                    <h3 className="section-heading">1. Khen thưởng sinh viên</h3>
                    <p>
                        Học viện Công nghệ Bưu chính Viễn thông thực hiện công tác khen thưởng sinh viên nhằm khuyến khích, động viên kịp thời các cá nhân và tập thể đạt thành tích xuất sắc trong học tập, rèn luyện và các hoạt động phong trào.
                    </p>
                    <p>
                        Việc khen thưởng được tiến hành thường xuyên, công khai, minh bạch, đảm bảo công bằng và đúng quy định.
                    </p>

                    <p><strong>2. Các thành tích đạt được bao gồm:</strong></p>
                    <ul className="custom-list">
                        <li><strong>Đạt giải trong các cuộc thi:</strong> Olympic các môn học, Nghiên cứu khoa học, Sáng tạo kỹ thuật, Văn hóa, văn nghệ, thể thao.</li>
                        <li><strong>Có đóng góp tích cực trong:</strong> Công tác Đảng, Đoàn Thanh niên, Hội Sinh viên, Hoạt động tình nguyện, phong trào thanh niên, Hoạt động tập thể tại lớp, khoa, ký túc xá.</li>
                        <li><strong>Tham gia và có thành tích trong:</strong> Giữ gìn an ninh trật tự, Phòng chống tệ nạn xã hội, Bảo vệ an ninh Tổ quốc.</li>
                        <li><strong>Có hành động tiêu biểu:</strong> Dũng cảm cứu người, Đấu tranh chống tiêu cực, tham nhũng và các thành tích đặc biệt khác.</li>
                    </ul>

                    <h3 className="section-heading">3. Danh hiệu cá nhân</h3>
                    <p><strong>3.1. Các loại danh hiệu:</strong> Sinh viên được xét 3 danh hiệu cá nhân gồm: Sinh viên Khá, Sinh viên Giỏi, Sinh viên Xuất sắc.</p>

                    <p><strong>3.2. Tiêu chuẩn xét danh hiệu:</strong></p>
                    <ul className="custom-list">
                        <li><strong>Sinh viên Khá:</strong> Kết quả học tập đạt loại Khá trở lên và Điểm rèn luyện đạt Khá trở lên.</li>
                        <li><strong>Sinh viên Giỏi:</strong> Kết quả học tập đạt Giỏi trở lên và Điểm rèn luyện đạt Tốt trở lên.</li>
                        <li><strong>Sinh viên Xuất sắc:</strong> Điểm trung bình học tập đạt từ 3,6/4 trở lên và Điểm rèn luyện đạt Xuất sắc.</li>
                    </ul>

                    <p><strong>3.3. Điều kiện xét khen thưởng:</strong></p>
                    <ul className="custom-list">
                        <li>Danh hiệu được lưu vào hồ sơ sinh viên.</li>
                        <li><strong>Không xét khen thưởng đối với sinh viên:</strong> Bị kỷ luật trong năm học hoặc có học phần bị điểm dưới trung bình.</li>
                    </ul>

                    <h3 className="section-heading">4. Danh hiệu tập thể</h3>
                    <p><strong>4.1. Các loại danh hiệu:</strong> Đối với tập thể lớp sinh viên gồm Lớp sinh viên Tiên tiến và Lớp sinh viên Xuất sắc.</p>
                    <p><strong>4.2. Hình thức khen thưởng:</strong> Giấy khen của Hiệu trưởng và các hình thức khen thưởng khác theo quy định.</p>

                    <p><strong>4.3. Tiêu chuẩn xét danh hiệu:</strong></p>
                    <ul className="custom-list">
                        <li><strong>a. Lớp sinh viên Tiên tiến:</strong>
                            <ul className="nested-list">
                                <li>Có từ 25% sinh viên đạt danh hiệu Khá trở lên và có ít nhất 01 sinh viên đạt danh hiệu Giỏi trở lên.</li>
                                <li>Không có sinh viên: Học lực kém, rèn luyện kém, hoặc bị kỷ luật từ mức khiển trách trở lên.</li>
                                <li>Tập thể: Đoàn kết, hỗ trợ nhau trong học tập, tích cực tham gia phong trào thi đua.</li>
                            </ul>
                        </li>
                        <li><strong>b. Lớp sinh viên Xuất sắc:</strong>
                            <ul className="nested-list">
                                <li>Đạt đầy đủ các tiêu chuẩn của lớp Tiên tiến.</li>
                                <li>Có từ 10% sinh viên đạt danh hiệu Giỏi trở lên và có ít nhất 01 sinh viên đạt danh hiệu Xuất sắc.</li>
                            </ul>
                        </li>
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