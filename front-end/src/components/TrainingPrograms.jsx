import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/TrainingPrograms.css";

// ========================================================
// ĐỊNH NGHĨA CÁC ICON SVG CHO TỪNG NHÓM NGÀNH
// ========================================================
const programIcons = {
    // 1. Nhóm Kế toán, Fintech, Tài chính
    accounting: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
    ),
    // 2. Nhóm Công nghệ thông tin, Khoa học máy tính, Game
    it: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
            <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>
    ),
    // 3. Nhóm Mạng, IoT, AI, Dữ liệu, An toàn thông tin
    network: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
    ),
    // 4. Nhóm Marketing, Truyền thông, Thương mại điện tử, Báo chí
    marketing: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    // 5. Nhóm Quản trị, Logistics
    management: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
    ),
    // 6. Nhóm Điện, Tự động hóa
    electric: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
    )
};

// Hàm hỗ trợ để lấy icon dựa trên tiêu đề ngành
const getIconForProgram = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("kế toán") || lowerTitle.includes("tài chính")) return programIcons.accounting;
    if (lowerTitle.includes("công nghệ thông tin") || lowerTitle.includes("khoa học máy tính") || lowerTitle.includes("game")) return programIcons.it;
    if (lowerTitle.includes("mạng máy tính") || lowerTitle.includes("internet vạn vật") || lowerTitle.includes("iot") || lowerTitle.includes("an toàn thông tin") || lowerTitle.includes("trí tuệ nhân tạo") || lowerTitle.includes("ai") || lowerTitle.includes("dữ liệu")) return programIcons.network;
    if (lowerTitle.includes("marketing") || lowerTitle.includes("truyền thông") || lowerTitle.includes("thương mại điện tử") || lowerTitle.includes("báo chí") || lowerTitle.includes("quan hệ công chúng")) return programIcons.marketing;
    if (lowerTitle.includes("quản trị kinh doanh") || lowerTitle.includes("logistics")) return programIcons.management;
    if (lowerTitle.includes("điện") || lowerTitle.includes("tự động hóa")) return programIcons.electric;

    // Icon mặc định (dùng lại icon mạng/đám mây cho các ngành khác)
    return programIcons.network;
};

export default function TrainingPrograms() {
    // DỮ LIỆU ĐẦY ĐỦ 28 NGÀNH
    const programsData = [
        { id: 1, title: "Chương trình Kỹ thuật dữ liệu (ngành Mạng máy tính và truyền thông dữ liệu)", date: "12/08/2024" },
        { id: 2, title: "Ngành Công nghệ tài chính - Fintech", date: "12/08/2024" },
        { id: 3, title: "Ngành Báo chí (Journalism)", date: "12/08/2024" },
        { id: 4, title: "Ngành Kế toán (2022)", date: "12/08/2024" },
        { id: 5, title: "Ngành Kỹ thuật Điều khiển và Tự động hóa", date: "12/08/2024" },
        { id: 6, title: "Ngành Công nghệ thông tin Hệ CLC", date: "12/08/2024" },
        { id: 7, title: "Ngành Quản trị kinh doanh", date: "12/08/2024" },
        { id: 8, title: "Ngành Thương mại điện tử", date: "12/08/2024" },
        { id: 9, title: "Ngành Marketing", date: "12/08/2024" },
        { id: 10, title: "Ngành Truyền thông đa phương tiện", date: "12/08/2024" },
        { id: 11, title: "Ngành Công nghệ đa phương tiện", date: "12/08/2024" },
        { id: 12, title: "Chương trình Công nghệ thông tin (định hướng ứng dụng)", date: "07/03/2026" },
        { id: 13, title: "Trí tuệ nhân tạo vạn vật (AIoT)", date: "07/03/2026" },
        { id: 14, title: "Phân tích dữ liệu trong tài chính, kinh doanh", date: "14/01/2026" },
        { id: 15, title: "Chương trình An toàn thông tin - Chất lượng cao", date: "25/04/2025" },
        { id: 16, title: "Chương trình Logistics và quản trị chuỗi cung ứng", date: "02/04/2025" },
        { id: 17, title: "Ngành Trí tuệ nhân tạo", date: "27/03/2025" },
        { id: 18, title: "Chương trình Công nghệ thông tin Việt - Nhật", date: "12/08/2024" },
        { id: 19, title: "Chương trình Thiết kế và Phát triển Game", date: "12/08/2024" },
        { id: 20, title: "Chương trình Quan hệ công chúng (Ngành Marketing)", date: "12/08/2024" },
        { id: 21, title: "Ngành Kế toán - Chất lượng cao chuẩn quốc tế - ACCA", date: "12/08/2024" },
        { id: 22, title: "Ngành Công nghệ Internet vạn vật (IoT)", date: "12/08/2024" },
        { id: 23, title: "Ngành Marketing hệ CLC", date: "12/08/2024" },
        { id: 24, title: "Ngành Công nghệ kỹ thuật Điện, điện tử", date: "12/08/2024" },
        { id: 25, title: "Ngành Kỹ thuật Điện tử viễn thông", date: "12/08/2024" },
        { id: 26, title: "Ngành An toàn thông tin", date: "12/08/2024" },
        { id: 27, title: "Ngành Công nghệ thông tin", date: "12/08/2024" },
        { id: 28, title: "Ngành Khoa học máy tính", date: "12/08/2024" }
    ];

    // ========================================================
    // LOGIC TÌM KIẾM (SEARCH)
    // ========================================================
    const [searchTerm, setSearchTerm] = useState("");

    // Hàm xử lý khi thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
    };

    // Lọc danh sách chương trình dựa trên từ khóa
    const filteredPrograms = programsData.filter((program) =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ========================================================
    // LOGIC PHÂN TRANG (PAGINATION) - CHẠY TRÊN DANH SÁCH ĐÃ LỌC
    // ========================================================
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPrograms = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="programs-page">
            <div className="programs-container">

                {/* THANH ĐIỀU HƯỚNG & THANH TÌM KIẾM */}
                <div className="programs-header-row">
                    <div className="breadcrumb">
                        <Link to="/cam-nang">Cẩm nang sinh viên</Link> &gt; <span>Chương trình đào tạo</span>
                    </div>

                    {/* THANH TÌM KIẾM MỚI THÊM VÀO ĐÂY */}
                    <div className="search-bar-container">
                        <span className="search-icon" aria-hidden="true">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm chuyên ngành..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* DANH SÁCH CÁC NGÀNH (GRID) */}
                <div className="programs-grid">
                    {currentPrograms.length > 0 ? (
                        currentPrograms.map((program) => (
                            <div className="program-card" key={program.id}>
                                <div className="program-icon-wrapper">
                                    {/* SỬ DỤNG HÀM ĐỂ LẤY ICON TƯƠNG ỨNG VỚI NGÀNH */}
                                    <div className="program-icon">
                                        {getIconForProgram(program.title)}
                                    </div>
                                </div>

                                <div className="program-info">
                                    <div className="program-date">
                                        <span aria-hidden="true">📅</span> {program.date}
                                    </div>
                                    <h3 className="program-title">{program.title}</h3>

                                    <Link to={`/chuong-trinh/${program.id}`} className="program-link">
                                        Xem chi tiết &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Hiển thị khi không tìm thấy kết quả
                        <div className="no-results">
                            Không tìm thấy chương trình đào tạo nào phù hợp với từ khóa "<strong>{searchTerm}</strong>".
                        </div>
                    )}
                </div>

                {/* THANH PHÂN TRANG (Chỉ hiện khi có nhiều hơn 1 trang kết quả) */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}