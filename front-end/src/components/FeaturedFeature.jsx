import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedFeature() {
    return (
        <aside className="featured" aria-labelledby="featured-title">
            <h4 id="featured-title">Tính năng nổi bật</h4>

            <article className="feature-card interactive" role="region" aria-labelledby="feature-heading">
                <div className="feature-icon" aria-hidden="true">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18v2H3zM3 10h18v2H3zM3 14h12v2H3z" fill="currentColor" />
                    </svg>
                </div>

                <div className="feature-body">
                    <strong id="feature-heading">Cẩm nang sinh viên</strong>
                    <p className="feature-desc">Tổng hợp hướng dẫn học tập, thủ tục và các thông tin cần biết cho sinh viên</p>

                    {/* SỬA Ở ĐÂY: Đổi thẻ <a> thành <Link>, đổi href thành to */}
                    <Link className="link-btn cta" to="/cam-nang" aria-label="Xem cẩm nang sinh viên">
                        <span className="cta-text">Xem ngay</span>
                        <span className="cta-arrow" aria-hidden="true">→</span>
                    </Link>
                </div>
            </article>
        </aside>
    );
}