import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/TrainingPrograms.css";

export default function TrainingPrograms() {
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="article-container">

                {/* Meta info & Breadcrumb */}
                <div className="article-meta">
                    <Link to="/cam-nang" className="breadcrumb-link">Cẩm nang sinh viên</Link>
                    <span className="dot">&gt;</span> Chương trình đào tạo
                </div>

                {/* Tiêu đề chính */}
                <h1 className="article-title">Chương trình đào tạo đại học</h1>

                {/* Nội dung bài viết */}
                <div className="article-content">

                    <p className="intro-text">
                        Học viện Công nghệ Bưu chính Viễn thông (PTIT) hiện đang đào tạo đa dạng các ngành nghề thuộc nhiều lĩnh vực khác nhau, đáp ứng nhu cầu nguồn nhân lực chất lượng cao thời kỳ chuyển đổi số.
                    </p>

                    <h3 className="section-heading">Các khối ngành đào tạo tiêu biểu:</h3>

                    <div className="majors-grid">
                        <div className="major-card">
                            <div className="major-icon">💻</div>
                            <h4 className="major-name">Khối Công nghệ - Kỹ thuật</h4>
                            <p>Công nghệ thông tin, An toàn thông tin, Khoa học máy tính, Kỹ thuật Điện tử Viễn thông, Trí tuệ nhân tạo vạn vật (AIoT)...</p>
                        </div>

                        <div className="major-card">
                            <div className="major-icon">📊</div>
                            <h4 className="major-name">Khối Kinh tế - Quản trị</h4>
                            <p>Quản trị kinh doanh, Kế toán, Thương mại điện tử, Marketing, Công nghệ tài chính (Fintech)...</p>
                        </div>

                        <div className="major-card">
                            <div className="major-icon">🎨</div>
                            <h4 className="major-name">Khối Truyền thông - Thiết kế</h4>
                            <p>Công nghệ đa phương tiện, Truyền thông đa phương tiện, Báo chí...</p>
                        </div>
                    </div>

                    <h3 className="section-heading">Tra cứu chi tiết Chương trình đào tạo</h3>
                    <p>
                        Để xem chi tiết lộ trình học tập, danh sách các môn học (ma trận môn học), số tín chỉ và chuẩn đầu ra của từng chuyên ngành cụ thể, sinh viên vui lòng tra cứu trực tiếp tại Cổng thông tin đào tạo chính thức của Học viện.
                    </p>

                    {/* NÚT BẤM DẪN SANG LINK BẠN GỬI */}
                    <div className="cta-container">
                        <a
                            href="https://daotao.ptit.edu.vn/chuong-trinh-dao-tao/"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-cta-red"
                        >
                            Tra cứu CTĐT trên Cổng Đào Tạo &rarr;
                        </a>
                    </div>

                    {/* ========================================= */}
                    {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
                    {/* ========================================= */}
                    <div className="article-bottom-nav">
                        <Link to="/cam-nang" className="btn-back" onClick={() => window.scrollTo(0, 0)}>
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