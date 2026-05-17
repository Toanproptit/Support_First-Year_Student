import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Club.css";
// Tận dụng lại CSS form chuẩn của bạn cho phần Breadcrumb và Nút quay lại
import "../styles/ScholarshipDetail.css";

const clubs = [
    {
        id: 1,
        name: "CLB Văn hóa nghệ thuật",
        leader: "Nguyễn Hoàng Nghĩa",
        link: "https://www.facebook.com/Vhnt.ptit.hn",
        logo: "https://ui-avatars.com/api/?name=VH&background=0284c7&color=fff&rounded=true&bold=true"
    },
    {
        id: 2,
        name: "Đội Thanh niên vận động hiến máu Học viện Công nghệ Bưu chính Viễn thông",
        leader: "Nguyễn Thị Kim Nguyên",
        link: "https://www.facebook.com/PtitQuayTitDaQuayLaTit/",
        logo: "https://ui-avatars.com/api/?name=HM&background=dc2626&color=fff&rounded=true&bold=true"
    },
    {
        id: 3,
        name: "CLB Guitar Học viện Công nghệ Bưu chính Viễn thông - PGC",
        leader: "Nguyễn Thị Thu Hoài",
        link: "https://www.facebook.com/PGC.Guitar/",
        logo: "https://ui-avatars.com/api/?name=PGC&background=ea580c&color=fff&rounded=true&bold=true"
    },
    {
        id: 4,
        name: "CLB Taekwondo PTIT",
        leader: "Nguyễn Đình Khánh Linh",
        link: "https://www.facebook.com/taekwondo.ptit/",
        logo: "https://ui-avatars.com/api/?name=TKD&background=000000&color=fff&rounded=true&bold=true"
    },
    {
        id: 5,
        name: "Đội cờ đỏ PTIT",
        leader: "Trần Thị Linh",
        link: "https://www.facebook.com/dcdptit",
        logo: "https://ui-avatars.com/api/?name=CD&background=b91c1c&color=fff&rounded=true&bold=true"
    },
    {
        id: 6,
        name: "CLB Lập trình PTIT",
        leader: "Đặng Trung Hiếu",
        link: "https://www.facebook.com/clubproptit",
        logo: "https://ui-avatars.com/api/?name=PRO&background=2563eb&color=fff&rounded=true&bold=true"
    },
    {
        id: 7,
        name: "CLB Multimedia PTIT",
        leader: "Hồ Hoàng Long",
        link: "https://www.facebook.com/clbmultimediaptit",
        logo: "https://ui-avatars.com/api/?name=MUL&background=22d3ee&color=fff&rounded=true&bold=true"
    },
    {
        id: 8,
        name: "CLB EMA",
        leader: "Hoàng Đình Phú",
        link: "https://www.facebook.com/EMAPTIT",
        logo: "https://ui-avatars.com/api/?name=EMA&background=000000&color=fff&rounded=true&bold=true"
    },
    {
        id: 9,
        name: "Liên Chi Đoàn Khoa CNTT1",
        leader: "Nguyễn Mạnh Dũng",
        link: "https://www.facebook.com/CNTT1",
        logo: "https://ui-avatars.com/api/?name=LCD&background=16a34a&color=fff&rounded=true&bold=true"
    }
];

export default function Club() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            {/* Mình nới rộng max-width một chút để hiển thị đẹp 4 cột */}
            <div className="article-container" style={{ maxWidth: '1200px' }}>

                {/* 1. ĐIỀU HƯỚNG TRÊN CÙNG (Form chuẩn) */}
                <div className="article-meta">
                    <Link to="/cam-nang">Cẩm nang sinh viên</Link> &gt; <span>Câu lạc bộ, Đội, Nhóm</span>
                </div>

                {/* 2. TIÊU ĐỀ CHÍNH */}
                <h1 className="article-title">Danh sách Câu lạc bộ, Đội, Nhóm</h1>

                <div className="article-content">
                    {/* 3. LƯỚI DANH SÁCH CLB */}
                    <div className="club-grid-container">
                        {clubs.map((club) => (
                            <div key={club.id} className="club-card">

                                <div className="club-logo-wrap">
                                    <img src={club.logo} alt={club.name} className="club-logo" />
                                </div>

                                <div className="club-info">
                                    <h3>{club.name}</h3>
                                    <p className="club-leader">
                                        <strong>Chủ nhiệm:</strong> {club.leader}
                                    </p>
                                </div>

                                <hr className="club-divider" />

                                <div className="club-footer">
                                    <a href={club.link} target="_blank" rel="noopener noreferrer" className="club-link">
                                        {club.link.replace("https://www.facebook.com/", "fb.com/")}
                                    </a>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* 4. ĐIỀU HƯỚNG DƯỚI CÙNG (Form chuẩn) */}
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