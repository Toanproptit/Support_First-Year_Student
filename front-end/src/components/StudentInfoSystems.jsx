import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/StudentInfoSystems.css";

export default function StudentInfoSystems() {
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
                <h1 className="article-title">Hệ thống thông tin sinh viên</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">

                    <h3 className="section-heading">Hệ thống thông tin dành cho sinh viên:</h3>

                    <ul className="system-list">
                        <li>
                            <strong>Cổng thông tin chính của Học viện</strong> có địa chỉ <a href="https://ptit.edu.vn" target="_blank" rel="noreferrer">https://ptit.edu.vn</a>. Đây là nơi cung cấp các thông tin: Giới thiệu về Học viện, cơ cấu tổ chức (khoa, viện, phòng ban), thông tin tuyển sinh, tin tức, sự kiện và các thông báo chính thức.
                        </li>

                        <li>
                            <strong>Hệ thống quản lý đào tạo và sinh viên</strong> có địa chỉ <a href="https://qldt.ptit.edu.vn" target="_blank" rel="noreferrer">https://qldt.ptit.edu.vn</a>. Sinh viên có thể sử dụng hệ thống này để đăng ký học phần theo học kỳ, xem thời khóa biểu, tra cứu điểm học tập, xem lịch thi và quản lý thông tin cá nhân. Sinh viên đăng nhập bằng mã số sinh viên và mật khẩu cá nhân.
                        </li>

                        <li>
                            <strong>Hệ thống học tập trực tuyến (LMS)</strong> có địa chỉ <a href="https://lms.ptit.edu.vn" target="_blank" rel="noreferrer">https://lms.ptit.edu.vn</a>. Chức năng chính bao gồm: Học online, nhận tài liệu môn học, nộp bài tập, làm quiz, kiểm tra và tương tác với giảng viên.
                        </li>

                        <li>
                            <strong>Hệ thống email sinh viên</strong> được cung cấp thông qua nền tảng Microsoft (Microsoft Outlook / Office 365). Sinh viên có thể truy cập email tại <a href="https://outlook.office.com" target="_blank" rel="noreferrer">https://outlook.office.com</a> hoặc thông qua ứng dụng Outlook trên máy tính và điện thoại. Tài khoản email có định dạng Mã số sinh viên + @ptit.edu.vn (Ví dụ: B20DCCN001@ptit.edu.vn). Email này được sử dụng để nhận thông báo chính thức từ nhà trường, trao đổi thông tin học tập với giảng viên, đăng nhập các hệ thống liên quan và sử dụng các dịch vụ trong hệ sinh thái Microsoft (OneDrive, Teams, v.v.).
                        </li>


                        <li>
                            <strong>Cổng thông tin tuyển sinh</strong> của trường có địa chỉ tại <a href="https://ptit.edu.vn" target="_blank" rel="noreferrer">https://ptit.edu.vn</a> (mục Tuyển sinh). Đăng tải đầy đủ các thông tin ngành học, chỉ tiêu tuyển sinh, phương thức xét tuyển và hướng dẫn nhập học.
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