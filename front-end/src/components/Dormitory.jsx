import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dormitory.css'; // Đảm bảo đường dẫn import đúng

export default function Dormitory() {
    return (
        <div className="dormitory-container">
            {/* Thanh điều hướng (Breadcrumb) theo phong cách ẩn màu xám, hover chuyển đỏ */}
            <div className="dorm-breadcrumb">
                <Link to="/cam-nang" className="dorm-breadcrumb-link">Cẩm nang sinh viên</Link>
                <span className="dorm-breadcrumb-separator"> &gt; </span>
                <span className="dorm-breadcrumb-current">Ký túc xá</span>
            </div>

            <h1 className="dormitory-title">Ký túc xá</h1>
            <p className="dormitory-intro">
                Học viện Công nghệ Bưu chính Viễn thông xin thông báo về việc bố trí sinh viên khóa 2025 ở nội trú tại các Ký túc xá (KTX) của Học viện, cụ thể như sau:
            </p>

            <h3 className="section-title">1. Đối tượng</h3>
            <p>Là sinh viên hệ đại học chính quy khóa 2025, có hộ khẩu thường trú tại các địa phương không thuộc Thành phố Hà Nội và có nguyện vọng đăng ký ở nội trú KTX.</p>

            <h3 className="section-title">2. Địa điểm, điều kiện cơ sở vật chất (CSVC) và số chỗ ở nội trú</h3>
            <div className="dorm-cards">
                <div className="dorm-card">
                    <h4>2.1. KTX B1 (CSĐT Hà Đông)</h4>
                    <ul>
                        <li><strong>Số chỗ ở:</strong> 40 chỗ.</li>
                        <li><strong>Điều kiện CSVC:</strong> Phòng 04 người có khu vệ sinh khép kín, khang trang, sạch sẽ, đảm bảo an ninh trật tự (có giường, ga đệm, tủ, bàn ghế, quạt, điều hòa, bình nước nóng).</li>
                        <li><strong>Mức thu:</strong> 1.800.000 VNĐ/SV/tháng (miễn phí 100 số điện/phòng/tháng).</li>
                    </ul>
                </div>

                <div className="dorm-card">
                    <h4>2.2. KTX B2 (CSĐT Hà Đông)</h4>
                    <ul>
                        <li><strong>Số chỗ ở:</strong> 460 chỗ.</li>
                        <li><strong>Điều kiện CSVC:</strong> Phòng 08 người có khu vệ sinh khép kín, khang trang, sạch sẽ, đảm bảo an ninh trật tự (có giường tầng, quạt, bình nước nóng).</li>
                        <li><strong>Mức thu:</strong> 250.000 VNĐ/SV/tháng (miễn phí 100 số điện/phòng/tháng).</li>
                    </ul>
                </div>

                <div className="dorm-card">
                    <h4>2.3. KTX CSĐT Ngọc Trục</h4>
                    <ul>
                        <li><strong>Số chỗ ở:</strong> 340 chỗ.</li>
                        <li><strong>Điều kiện CSVC:</strong> Phòng 04 người có khu vệ sinh khép kín, khang trang, sạch sẽ, đảm bảo an ninh trật tự (có giường, ga đệm, tủ, bàn ghế, quạt, điều hòa, bình nước nóng).</li>
                        <li><strong>Mức thu:</strong> 1.500.000 VNĐ/SV/tháng (miễn phí 100 số điện/phòng/tháng).</li>
                    </ul>
                </div>
            </div>

            <div className="note-box">
                <p><strong>* Ghi chú:</strong> Sinh viên khóa 2025 sẽ nộp lệ phí KTX trong 04 tháng, vì có 01 tháng sinh viên đi học giáo dục quốc phòng, không ở Học viện.</p>
                <p>– Trường hợp sinh viên ở KTX Cơ sở đào tạo Ngọc Trục nhưng học tại Cơ sở Đào tạo Hà Đông, được Học viện hỗ trợ chi phí đi lại <strong>150.000 đồng/người/tháng</strong>, thanh toán vào cuối học kỳ.</p>
            </div>

            <h3 className="section-title">3. Đối tượng được xét ưu tiên ở nội trú tại KTX</h3>
            <p><em>(Xét theo thứ tự ưu tiên từ 1 đến 6)</em></p>
            <ul className="dormitory-list">
                <li><strong>3.1.</strong> Sinh viên thuộc đối tượng được hưởng ưu đãi theo quy định tại Pháp lệnh Ưu đãi người có công với cách mạng.</li>
                <li><strong>3.2.</strong> Người có cha hoặc mẹ là người dân tộc thiểu số.</li>
                <li><strong>3.3.</strong> Sinh viên thuộc đối tượng bảo trợ xã hội; có hoàn cảnh đặc biệt.</li>
                <li><strong>3.4.</strong> Sinh viên có hộ khẩu thường trú tại vùng có điều kiện kinh tế, xã hội đặc biệt khó khăn.</li>
                <li><strong>3.5.</strong> Sinh viên thuộc diện gia đình hộ nghèo, hộ cận nghèo theo quy định hiện hành của Nhà nước.</li>
                <li><strong>3.6.</strong> Sinh viên nữ, sinh viên tích cực tham gia các hoạt động do Học viện, Đoàn Thanh niên Cộng sản Hồ Chí Minh Học viện và các tổ chức xã hội phát động.</li>
            </ul>

            <h3 className="section-title">4. Nguyên tắc bố trí vào ở nội trú</h3>
            <ul className="dormitory-list">
                <li><strong>4.1.</strong> Xét bố trí ở KTX trước đối với sinh viên thuộc diện đối tượng ưu tiên sau khi nộp hồ sơ theo mục 3 nêu trên.</li>
                <li>
                    <strong>4.2.</strong> Sau khi đã xét hết đối tượng ưu tiên, số chỗ ở còn lại sẽ phân bổ theo tỷ lệ chung cho tất cả các ngành học tuyển sinh trong năm 2025, theo công thức:
                    <div className="formula-box">
                        Tỷ lệ bố trí SV nội trú của 1 ngành = (Số chỗ ở nội trú còn lại / Tổng số SV trúng tuyển khóa 2025 khu vực phía Bắc) × Số sinh viên trúng tuyển của ngành học.
                    </div>
                </li>
                <li><strong>4.3. Thời gian đăng ký:</strong> Sinh viên đăng ký ở nội trú theo từng học kỳ (không tiếp nhận ở theo ngày và tháng).</li>
            </ul>

            <h3 className="section-title">5. Thời gian và địa điểm tiếp nhận hồ sơ đăng ký</h3>
            <ul className="dormitory-list">
                <li><strong>5.1. Thời gian:</strong> Từ 07h30, thứ Tư, ngày 03/9/2025 đến 17h00, thứ Năm, ngày 04/9/2025 <em>(Vào thời gian nộp hồ sơ nhập học trực tiếp đối với sinh viên khóa 2025 theo kế hoạch)</em>.</li>
                <li><strong>5.2. Địa điểm:</strong> Hội trường số 1 và Hội trường A2, Cơ sở Đào tạo Hà Đông.</li>
                <li><strong>5.3. Hồ sơ đăng ký bao gồm:</strong> Bản sao CCCD; Giấy báo trúng tuyển; Các giấy tờ chứng minh diện ưu tiên (bản sao công chứng kèm bản chính đối chiếu); Phiếu đăng ký ở nội trú (nhận tại bàn trực).</li>
            </ul>

            <h3 className="section-title">6. Quy trình đăng ký ở nội trú</h3>
            <ul className="dormitory-list">
                <li><strong>6.1.</strong> Sau khi hoàn thành thủ tục nhập học, sinh viên liên hệ tại bàn trực đăng ký ở nội trú hoặc theo SĐT Tổ Quản lý KTX: <span className="contact-highlight">Anh Nguyễn Quang Khải - 0914.186.266</span>.</li>
                <li><strong>6.2.</strong> Sinh viên xuất trình nộp đủ Hồ sơ (mục 5.3) để được hướng dẫn.</li>
                <li><strong>6.3. Thông báo kết quả:</strong> Học viện sẽ tổ chức xét và công bố kết quả đối với sinh viên đủ điều kiện sau khi kết thúc nhận hồ sơ.</li>
                <li><strong>6.4. Nộp lệ phí:</strong> Sinh viên nộp lệ phí KTX bằng hình thức chuyển khoản qua Ngân hàng.</li>
                <li><strong>6.5. Tiếp nhận:</strong> Những SV đủ điều kiện sẽ được bố trí vào ở tại KTX B2 ngay trong thời gian nhập học.</li>
            </ul>

            <div className="note-box">
                <p><strong>* Ghi chú:</strong> Sau khi kết thúc thời gian tiếp nhận, Học viện sẽ công khai danh sách sinh viên khóa 2025 được bố trí ở nội trú trên website Học viện.</p>
            </div>
            <div className="dorm-bottom-nav">
                <Link to="/cam-nang" className="dorm-btn-back">
                    <span>&larr;</span> Quay lại danh sách
                </Link>
                <Link to="/cam-nang" className="dorm-link-all">
                    Xem tất cả cẩm nang
                </Link>
            </div>
        </div>
    );
}