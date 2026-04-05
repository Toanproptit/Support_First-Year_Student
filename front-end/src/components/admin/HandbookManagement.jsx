import React, { useState } from "react";
import "../../styles/AdminPages.css";
import Pagination from "./Pagination";

const PAGE_SIZE = 5;

const initialMockHandbook = [
  { id: 1,  title: "Chương trình đào tạo Công nghệ Thông tin",      category: "Đào tạo",   updatedAt: "2025-09-01" },
  { id: 2,  title: "Quy định về học phần và tín chỉ",               category: "Quy định",  updatedAt: "2025-08-20" },
  { id: 3,  title: "Hỗ trợ sinh viên khó khăn",                     category: "Hỗ trợ",   updatedAt: "2025-07-15" },
  { id: 4,  title: "Hoạt động ngoại khoá và câu lạc bộ",            category: "Hoạt động", updatedAt: "2025-06-10" },
  { id: 5,  title: "Dịch vụ y tế & sức khoẻ sinh viên",             category: "Dịch vụ",  updatedAt: "2025-05-25" },
  { id: 6,  title: "Hướng dẫn đăng ký học phần trực tuyến",        category: "Đào tạo",   updatedAt: "2025-05-10" },
  { id: 7,  title: "Quy trình xin bảo lưu kết quả học tập",        category: "Quy định",  updatedAt: "2025-04-20" },
  { id: 8,  title: "Thủ tục cấp bằng tốt nghiệp",                   category: "Dịch vụ",  updatedAt: "2025-03-15" },
  { id: 9,  title: "Chính sách học bổng khuyến khích học tập",      category: "Hỗ trợ",   updatedAt: "2025-02-28" },
  { id: 10, title: "Lịch tuần sinh hoạt công dân đầu khoá",         category: "Hoạt động", updatedAt: "2025-02-01" },
  { id: 11, title: "Hướng dẫn sử dụng cổng thông tin QLDT",        category: "Đào tạo",   updatedAt: "2025-01-10" },
  { id: 12, title: "Các câu lạc bộ học thuật & văn nghệ tại PTIT",  category: "Hoạt động", updatedAt: "2024-12-05" },
];

export default function HandbookManagement() {
  const [handbooks, setHandbooks] = useState(initialMockHandbook);
  const [search, setSearch]       = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", category: "Đào tạo" });

  const filtered = handbooks.filter((h) =>
    h.title.toLowerCase().includes(search.toLowerCase()) ||
    h.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => { setSearch(val); setCurrentPage(1); };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá mục này khỏi cẩm nang?")) {
      setHandbooks(prev => prev.filter(item => item.id !== id));
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: "", category: "Đào tạo" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, category: item.category });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    if (editingItem) {
      setHandbooks(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData, updatedAt: today } : item
      ));
    } else {
      const newId = handbooks.length > 0 ? Math.max(...handbooks.map(h => h.id)) + 1 : 1;
      setHandbooks(prev => [{ id: newId, ...formData, updatedAt: today }, ...prev]);
      setCurrentPage(1);
    }
    closeModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Cẩm nang</h2>
          <p className="page-subtitle">Quản lý nội dung cẩm nang dành cho sinh viên mới</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>+ Thêm mục mới</button>
      </div>

      <div className="table-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm theo tiêu đề hoặc danh mục..."
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
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Cập nhật lần cuối</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>
                  Không tìm thấy mục nào.
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td><strong>{item.title}</strong></td>
                  <td><span className="badge badge-blue">{item.category}</span></td>
                  <td>{item.updatedAt}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEditModal(item)}>Sửa</button>
                      <button className="btn-delete" onClick={() => handleDelete(item.id)}>Xoá</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? "Sửa cẩm nang" : "Thêm mục mới"}</h3>
              <button className="btn-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tiêu đề:</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="Nhập tiêu đề..."
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục:</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Đào tạo">Đào tạo</option>
                    <option value="Quy định">Quy định</option>
                    <option value="Hỗ trợ">Hỗ trợ</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Dịch vụ">Dịch vụ</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-primary">{editingItem ? "Lưu thay đổi" : "Thêm mới"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
