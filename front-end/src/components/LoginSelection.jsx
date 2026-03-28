import React from "react";
import FeaturedFeature from "./FeaturedFeature";
import { Link } from "react-router-dom";

const studentDesc =
    "Truy cập thông tin học tập, đăng ký môn học, xem điểm số và các dịch vụ dành cho sinh viên";
const adminDesc =
    "Quản lý hệ thống, quản lý sinh viên, chương trình đào tạo và các chức năng quản trị";

export default function LoginSelection() {
    return (
        <section className="login-selection">
            {/* Tách tiêu đề thành 2 dòng để xuống dòng y hệt mẫu */}
            <header className="welcome-block">
                <h2 className="welcome-line1">Chào mừng đến với</h2>
                <h3 className="welcome-line2">
                    Hệ thống Hỗ trợ Sinh viên Khoa Công nghệ Thông tin
                </h3>
                <p className="lead">
                    Vui lòng chọn phương thức đăng nhập phù hợp với vai trò của bạn trong
                    hệ thống
                </p>
            </header>

            <div className="cards-row">
                {/* Wrapper .group để hover toàn khối ra bàn tay và lift */}
                <div className="group">

                    <article className="role-card centered" aria-labelledby="role-student">
                        <div className="role-icon" aria-hidden="true">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 2L1 7l11 5 9-4.09V17h2V7z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        <h3 id="role-student">Sinh viên</h3>
                        <p className="role-desc">{studentDesc}</p>

                        <Link to="/login/student" className="role-cta" aria-label="Đăng nhập Sinh viên">
                            <span className="cta-text">Đăng nhập dành cho Sinh viên</span>
                            <span className="cta-arrow" aria-hidden="true">→</span>
                        </Link>
                    </article>
                </div>

                <div className="group">
                    <article className="role-card centered" aria-labelledby="role-admin">
                        <div className="role-icon" aria-hidden="true">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        <h3 id="role-admin">Quản trị viên</h3>
                        <p className="role-desc">{adminDesc}</p>

                        <Link to="/login/admin" className="role-cta" aria-label="Đăng nhập Quản trị viên">
                            <span className="cta-text">Đăng nhập dành cho Quản trị viên</span>
                            <span className="cta-arrow" aria-hidden="true">→</span>
                        </Link>
                    </article>
                </div>
            </div>

            <FeaturedFeature />
        </section>
    );
}
