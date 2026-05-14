import React from "react";
import "../styles/Club.css";

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
        logo: "https://ui-avatars.com/api/?name=EMA&background=000000&color=fff&rounded=true&bold=true"
    }
];

export default function Club() {
    return (
        <div className="club-page-container">
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-[#1e293b]">
                    Danh sách Câu lạc bộ, Đội, Nhóm
                </h2>
                <div className="club-grid-container">
                    {clubs.map((club) => (
                        <div key={club.id} className="club-card py-6 px-4">
                            {/* Logo Section */}
                            <div className="mb-5">
                                <img
                                    src={club.logo}
                                    alt={club.name}
                                    className="club-logo w-16 h-16 rounded-full object-cover"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1">
                                <h3 className="mb-2">{club.name}</h3>
                                <p className="text-gray-500 text-[14px]">
                                    <span className="font-medium text-gray-700">Chủ nhiệm:</span> {club.leader}
                                </p>
                            </div>

                            <hr className="my-5" />

                            {/* Footer Section */}
                            <div className="mt-auto">
                                <a
                                    href={club.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="club-link"
                                >
                                    {club.link.replace("https://www.facebook.com/", "fb.com/")}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}