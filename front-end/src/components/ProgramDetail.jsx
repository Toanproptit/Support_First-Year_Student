import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ProgramDetail.css";

export default function ProgramDetail() {
    const { id } = useParams();
    const [activeSection, setActiveSection] = useState("tong-quan");
    const [activeSpecialty, setActiveSpecialty] = useState("Công nghệ phần mềm");
    const [showScrollTop, setShowScrollTop] = useState(false);

    // ========================================================
    // ĐỊNH NGHĨA MÀU SẮC CHUẨN THEO ẢNH
    // ========================================================
    const COLORS = {
        batBuocChung: "#85afee",
        boTroNganh: "#fcdada",
        chuyenNganh: "#fbce6f",
        giaoDucChuyenNghiep: "#d2a4e4",
        batBuocChungNhomNganh: "#70e0d6",
        coSoNganh: "#e64343",
        thucTap: "#3b58b4",
        luanVan: "#42b285"
    };

    // ========================================================
    // MOCK DATA ĐÃ ĐƯỢC CHUẨN HÓA
    // ========================================================
    const programData = {
        title: "Chương trình Công nghệ thông tin (định hướng ứng dụng)",
        code: "7480201_UDU",
        duration: "4 năm",
        term: "Mùa thu",
        location: "Hà Nội",
        overview: "Chương trình đào tạo Công nghệ thông tin định hướng ứng dụng được xây dựng nhằm đào tạo và cung ứng nguồn nhân lực có kỹ năng nghề nghiệp cao đáp ứng yêu cầu của tổ chức, doanh nghiệp và xã hội ngay khi tốt nghiệp. Sinh viên có bản lĩnh chính trị vững vàng, đạo đức nghề nghiệp; có khả năng phân tích yêu cầu, quy trình nghiệp vụ, thiết kế và triển khai phần mềm...",
        outcomes: [
            "1. Chuẩn về kiến thức",
            "LO1: Hiểu biết và nắm vững kiến thức về Lý luận chính trị, có hiểu biết về Pháp luật...",
            "LO2: Hiểu biết và nắm vững các kiến thức khoa học công nghệ cơ bản, chuyên ngành, tiếp cận các định hướng ứng dụng...",
            "LO3: Áp dụng tốt kiến thức cơ bản và chuyên sâu về công nghệ phần mềm, hệ thống thông tin...",
            "LO4: Áp dụng được kiến thức chuyên môn về công nghệ thông tin như phân tích, thiết kế và quản lý các dự án phần mềm..."
        ],
        career: "Với những kiến thức nền tảng toàn diện, hiện đại và thực tiễn liên quan đến Công nghệ thông tin định hướng ứng dụng của Học viện, sau khi tốt nghiệp, sinh viên sẽ có nhiều cơ hội việc làm hấp dẫn tại các doanh nghiệp trong nước và nước ngoài. Các vị trí việc làm cụ thể mà sinh viên ngành Công nghệ thông tin định hướng ứng dụng của Học viên có thể đảm nhận tốt sau khi ra trường là: \n- Lập trình viên website (Website Developer)\n- Lập trình viên ứng dụng di động (Mobile Developer)\n- Chuyên viên kiểm thử phần mềm (Tester)\n- Chuyên viên phân tích nghiệp vụ (Business Analyst)\n- Lập trình viên cơ sở dữ liệu (Database Developer)\n- Quản trị viên mạng máy tính (Network Administrator)\n- Cán bộ kỹ thuật, quản lý, điều hành trong lĩnh vực Công nghệ thông tin",
        tuition: "900.000 VNĐ / 1 tín chỉ",
        curriculum: {
            "Công nghệ phần mềm": [
                {
                    semester: "Học kỳ 1",
                    courses: [
                        { id: '1-1', name: "Đại số", credits: 3, color: COLORS.batBuocChungNhomNganh },
                        { id: '1-2', name: "Giải tích 1", credits: 3, color: COLORS.batBuocChungNhomNganh },
                        { id: '1-3', name: "Pháp luật đại cương", credits: 2, color: COLORS.batBuocChung },
                        { id: '1-4', name: "Nhập môn lập trình với Python", credits: 3, color: COLORS.coSoNganh }
                    ]
                },
                {
                    semester: "Học kỳ 2",
                    courses: [
                        { id: '2-1', name: "Xác suất thống kê", credits: 2, color: COLORS.batBuocChungNhomNganh },
                        { id: '2-2', name: "Giải tích", credits: 3, color: COLORS.batBuocChungNhomNganh },
                        { id: '2-3', name: "Tiếng Anh (Course 1)", credits: 4, color: COLORS.batBuocChung },
                        { id: '2-4', name: "Lập trình với ngôn ngữ Script", credits: 3, color: COLORS.coSoNganh },
                        { id: '2-5', name: "Cơ sở dữ liệu", credits: 3, color: COLORS.coSoNganh }
                    ]
                },
                {
                    semester: "Học kỳ 3",
                    courses: [
                        { id: '3-1', name: "Triết học Mác-Lênin", credits: 3, color: COLORS.batBuocChung },
                        { id: '3-2', name: "Tiếng Anh (Course 2)", credits: 4, color: COLORS.batBuocChung },
                        { id: '3-3', name: "Lập trình hướng đối tượng", credits: 3, color: COLORS.coSoNganh },
                        { id: '3-4', name: "Toán rời rạc 1", credits: 3, color: COLORS.coSoNganh },
                        { id: '3-5', name: "Lập trình web", credits: 3, color: COLORS.coSoNganh }
                    ]
                },
                {
                    semester: "Học kỳ 4",
                    courses: [
                        { id: '4-1', name: "Kinh tế chính trị Mác-Lênin", credits: 2, color: COLORS.batBuocChung },
                        { id: '4-2', name: "Tiếng Anh (Course 3)", credits: 4, color: COLORS.batBuocChung },
                        { id: '4-3', name: "An toàn và bảo mật hệ thống thông tin", credits: 3, color: COLORS.coSoNganh },
                        { id: '4-4', name: "Quản lý dự án phần mềm", credits: 2, color: COLORS.coSoNganh },
                        { id: '4-5', name: "Thực hành lập trình web", credits: 3, color: COLORS.coSoNganh },
                        { id: '4-6', name: "Học phần doanh nghiệp 1", credits: 3, color: COLORS.coSoNganh }
                    ]
                },
                {
                    semester: "Học kỳ 5",
                    courses: [
                        { id: '5-1', name: "Chủ nghĩa xã hội khoa học", credits: 2, color: COLORS.batBuocChung },
                        { id: '5-2', name: "Tiếng Anh (Course 3 Plus)", credits: 2, color: COLORS.batBuocChung },
                        { id: '5-3', name: "Phát triển ứng dụng cho các thiết bị di động", credits: 3, color: COLORS.coSoNganh },
                        { id: '5-4', name: "Cấu trúc dữ liệu và giải thuật", credits: 3, color: COLORS.coSoNganh },
                        { id: '5-5', name: "Nhập môn công nghệ nền tảng", credits: 3, color: COLORS.coSoNganh },
                        { id: '5-6', name: "Nhập môn tích hợp hệ thống", credits: 3, color: COLORS.coSoNganh }
                    ]
                },
                {
                    semester: "Học kỳ 6",
                    courses: [
                        { id: '6-1', name: "Tư tưởng Hồ Chí Minh", credits: 2, color: COLORS.batBuocChung },
                        { id: '6-2', name: "Mạng máy tính theo CCNA", credits: 4, color: COLORS.coSoNganh },
                        { id: '6-3', name: "Học phần doanh nghiệp 2", credits: 3, color: COLORS.coSoNganh },
                        { id: '6-4', name: "Nhập môn công nghệ phần mềm", credits: 3, color: COLORS.chuyenNganh }
                    ]
                },
                {
                    semester: "Học kỳ 7",
                    courses: [
                        { id: '7-1', name: "Kiến trúc và thiết kế phần mềm", credits: 3, color: COLORS.chuyenNganh },
                        { id: '7-2', name: "Thiết kế giao diện người dùng", credits: 3, color: COLORS.chuyenNganh },
                        { id: '7-3', name: "Lịch sử Đảng cộng sản VN", credits: 2, color: COLORS.batBuocChung },
                        { id: '7-4', name: "Lập trình web nâng cao", credits: 3, color: COLORS.chuyenNganh },
                        { id: '7-5', name: "Đảm bảo chất lượng phần mềm", credits: 3, color: COLORS.chuyenNganh },
                        { id: '7-6', name: "Phân tích nghiệp vụ", credits: 3, color: COLORS.chuyenNganh },
                        { id: '7-7', name: "Phát triển ứng dụng di động đa nền tảng", credits: 3, color: COLORS.chuyenNganh },
                        { id: '7-8', name: "Học phần tự chọn", credits: 3, color: COLORS.chuyenNganh }
                    ]
                },
                {
                    semester: "Học kỳ 8",
                    courses: [
                        { id: '8-1', name: "Thực tập và tốt nghiệp", credits: 12, color: COLORS.thucTap }
                    ]
                }
            ],
            "Hệ thống thông tin": [
                {
                    semester: "Học kỳ 1",
                    courses: [
                        { id: 'ht1', name: "Toán rời rạc", credits: 3, color: COLORS.batBuocChungNhomNganh }
                    ]
                }
            ]
        }
    };

    const menuItems = [
        { id: "tong-quan", label: "Tổng quan" },
        { id: "chuan-dau-ra", label: "Chuẩn đầu ra" },
        { id: "cau-truc", label: "Cấu trúc chương trình" },
        { id: "nghe-nghiep", label: "Nghề nghiệp" },
        { id: "hoc-phi", label: "Học phí" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = menuItems.map(item => document.getElementById(item.id));
            let currentActiveId = "tong-quan";
            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                if (section && section.getBoundingClientRect().top <= 150) {
                    currentActiveId = menuItems[i].id;
                    break;
                }
            }
            setActiveSection(currentActiveId);

            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="program-detail-page">
            <div className="pd-banner">
                <div className="pd-banner-content">
                    <h1>{programData.title}</h1>
                    <div className="pd-summary-cards">
                        <div className="summary-card"><span>Mã ngành</span><strong>{programData.code}</strong></div>
                        <div className="summary-card"><span>Thời gian</span><strong>{programData.duration}</strong></div>
                        <div className="summary-card"><span>Kỳ nhập học</span><strong>{programData.term}</strong></div>
                        <div className="summary-card"><span>Cơ sở</span><strong>{programData.location}</strong></div>
                    </div>
                </div>
            </div>

            <div className="pd-main-container">

                <aside className="pd-sidebar">
                    <ul className="pd-nav-list">
                        {menuItems.map((item) => (
                            <li
                                key={item.id}
                                className={activeSection === item.id ? "active" : ""}
                                onClick={() => scrollToSection(item.id)}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="pd-content">

                    <div id="tong-quan" className="content-section">
                        <h2 className="section-title">Tổng quan</h2>
                        <p className="section-text">{programData.overview}</p>
                        {/* Đã xóa banner thông tin tuyển sinh ở đây */}
                    </div>

                    <div id="chuan-dau-ra" className="content-section">
                        <h2 className="section-title">Chuẩn đầu ra</h2>
                        <div className="lo-list">
                            {programData.outcomes.map((lo, index) => (
                                <p key={index} className={lo.match(/^[0-9]\./) ? "lo-item lo-heading" : "lo-item"}>{lo}</p>
                            ))}
                        </div>
                    </div>

                    <div id="cau-truc" className="content-section">
                        <h2 className="section-title">Cấu trúc chương trình các chuyên ngành (Tiến trình học tập theo học chế tín chỉ)</h2>

                        <div className="specialty-tabs">
                            {Object.keys(programData.curriculum).map(spec => (
                                <button
                                    key={spec}
                                    className={`tab-btn ${activeSpecialty === spec ? "active" : ""}`}
                                    onClick={() => setActiveSpecialty(spec)}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>

                        <div className="curriculum-container">
                            {programData.curriculum[activeSpecialty].map((semData, index) => (
                                <div className="semester-row" key={index}>
                                    <div className="semester-label-wrapper">
                                        <span className="semester-vertical-text">{semData.semester}</span>
                                    </div>
                                    <div className="course-grid">
                                        {semData.courses.map(course => (
                                            <div className="course-card" key={course.id} style={{ borderLeftColor: course.color }}>
                                                <span className="course-credits">
                                                    {course.credits} tín chỉ
                                                </span>
                                                <h5 className="course-name">{course.name}</h5>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="curriculum-legend">
                            <div className="legend-row">
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.batBuocChung }}></span> Bắt buộc chung</div>
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.boTroNganh }}></span> Bổ trợ ngành</div>
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.chuyenNganh }}></span> Chuyên ngành</div>
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.giaoDucChuyenNghiep }}></span> Giáo dục chuyên nghiệp</div>
                            </div>
                            <div className="legend-row">
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.batBuocChungNhomNganh }}></span> Bắt buộc chung nhóm ngành</div>
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.coSoNganh }}></span> Cơ sở ngành</div>
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.thucTap }}></span> Thực tập</div>
                                <div className="legend-item"><span className="color-box" style={{ background: COLORS.luanVan }}></span> Luận văn tốt nghiệp</div>
                            </div>
                        </div>
                    </div>

                    <div id="nghe-nghiep" className="content-section">
                        <h2 className="section-title">Nghề nghiệp</h2>
                        <p className="section-text" style={{ whiteSpace: 'pre-line' }}>{programData.career}</p>
                    </div>

                    <div id="hoc-phi" className="content-section">
                        <h2 className="section-title">Học phí</h2>
                        <p className="section-text" style={{ fontSize: '18px', fontWeight: 'bold' }}>{programData.tuition}</p>
                    </div>
                    <div className="pd-bottom-nav">
                        <Link
                            to="/cam-nang/1"
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
                </main>
            </div>

            {showScrollTop && (
                <button className="btn-scroll-top" onClick={scrollToTop}>
                    &uarr;
                </button>
            )}
        </div>
    );
}