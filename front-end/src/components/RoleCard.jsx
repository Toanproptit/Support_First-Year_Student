// src/components/RoleCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function RoleCard({ title, description, to, icon }) {
    return (
        <article className="role-card centered" aria-labelledby={`role-${title}`}>
            <div className="role-icon" aria-hidden="true">{icon}</div>
            <h3 id={`role-${title}`}>{title}</h3>
            <p className="role-desc">{description}</p>

            <Link to={to} className="role-cta" aria-label={`Đăng nhập dành cho ${title}`}>
                <span className="cta-text">Đăng nhập dành cho {title}</span>
                <span className="cta-arrow" aria-hidden="true">→</span>
            </Link>
        </article>
    );
}
