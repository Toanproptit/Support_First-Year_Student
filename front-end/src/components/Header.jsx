import React from "react";
import logo from "../assets/logoptit.jpg";

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-inner">
                <img src={logo} alt="PTIT logo" className="logo" />
                <div className="header-text">
                    <h1>Hệ thống Hỗ trợ Sinh viên</h1>
                    <p className="sub">Học viện Công nghệ Bưu chính Viễn thông (PTIT)</p>
                </div>
                <a className="guide-btn" href="#" aria-label="Tài liệu hướng dẫn">Tài liệu hướng dẫn</a>
            </div>
        </header>
    );
}
