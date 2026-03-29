import React, { useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 5;

// Tạo 12 user giả để có nhiều trang
const mockUsers = [
  { id: 1,  name: "Nguyễn Văn An",    email: "an.nv@ptit.edu.vn",    mssv: "B21DCCN001", status: "Đang học" },
  { id: 2,  name: "Trần Thị Bình",    email: "binh.tt@ptit.edu.vn",  mssv: "B21DCCN002", status: "Đang học" },
  { id: 3,  name: "Lê Minh Cường",    email: "cuong.lm@ptit.edu.vn", mssv: "B21DCCN003", status: "Bảo lưu"  },
  { id: 4,  name: "Phạm Thu Hà",      email: "ha.pt@ptit.edu.vn",    mssv: "B21DCCN004", status: "Đang học" },
  { id: 5,  name: "Hoàng Đức Long",   email: "long.hd@ptit.edu.vn",  mssv: "B21DCCN005", status: "Đang học" },
  { id: 6,  name: "Đỗ Thanh Mai",     email: "mai.dt@ptit.edu.vn",   mssv: "B21DCCN006", status: "Đang học" },
  { id: 7,  name: "Vũ Quốc Nam",      email: "nam.vq@ptit.edu.vn",   mssv: "B21DCCN007", status: "Bảo lưu"  },
  { id: 8,  name: "Bùi Thị Oanh",     email: "oanh.bt@ptit.edu.vn",  mssv: "B21DCCN008", status: "Đang học" },
  { id: 9,  name: "Ngô Văn Phú",      email: "phu.nv@ptit.edu.vn",   mssv: "B21DCCN009", status: "Đang học" },
  { id: 10, name: "Lý Thị Quỳnh",     email: "quynh.lt@ptit.edu.vn", mssv: "B21DCCN010", status: "Đang học" },
  { id: 11, name: "Đinh Văn Sơn",     email: "son.dv@ptit.edu.vn",   mssv: "B21DCCN011", status: "Bảo lưu"  },
  { id: 12, name: "Cao Thị Tuyết",    email: "tuyet.ct@ptit.edu.vn", mssv: "B21DCCN012", status: "Đang học" },
];

export default function UserManagement() {
  const [search, setSearch]       = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mssv.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1); // reset về trang 1 khi tìm kiếm
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Sinh viên</h2>
          <p className="page-subtitle">Danh sách tài khoản sinh viên trong hệ thống</p>
        </div>
        <button className="btn-primary">+ Thêm sinh viên</button>
      </div>

      <div className="table-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm theo tên hoặc MSSV..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>MSSV</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>
                  Không tìm thấy sinh viên nào.
                </td>
              </tr>
            ) : (
              paginated.map((user, idx) => (
                <tr key={user.id}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td><strong>{user.name}</strong></td>
                  <td><code>{user.mssv}</code></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.status === "Đang học" ? "badge-green" : "badge-yellow"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit">Sửa</button>
                      <button className="btn-delete">Xoá</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
