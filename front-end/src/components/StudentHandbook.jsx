import React from "react";
import { Link } from "react-router-dom";
import "../styles/StudentHandbook.css";

export default function StudentHandbook() {
    // Dữ liệu của 6 thẻ cẩm nang
    const handbookData = [
        { id: 1, title: "Chương trình đào tạo", desc: "Thông tin về Chương trình đào tạo" },
        { id: 2, title: "Học phí - học bổng", desc: "Thông tin về Học phí - học bổng" },
        { id: 3, title: "Hướng dẫn học vụ", desc: "Thông tin về Hướng dẫn học vụ" },
        { id: 4, title: "Kế hoạch học tập năm học", desc: "Thông tin về Kế hoạch học tập năm học" },
        { id: 5, title: "Lộ trình học", desc: "Thông tin về Lộ trình học" },
        { id: 6, title: "Nghiên cứu khoa học", desc: "Thông tin về Nghiên cứu khoa học" }
    ];

    return (
        <div className="handbook-page">
            <main className="handbook-container">
                <div className="handbook-header-title">
                    <h2>Nội Dung Chính</h2>
                    <p>
                        Cẩm nang sinh viên Khoa CNTT - PTIT bao gồm những nội dung thiết yếu sau đây,
                        giúp bạn dễ dàng tiếp cận và tham khảo mọi thông tin cần thiết.
                    </p>
                </div>

                <div className="handbook-grid">
                    {handbookData.map((item) => (
                        <div className="handbook-card" key={item.id}>
                            <div className="hb-icon">
                                {/* Icon cuốn sổ chung cho các thẻ */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>

                            {/* Nút Xem chi tiết */}
                            <Link to={`/cam-nang/${item.id}`} className="hb-link">
                                Xem chi tiết &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}