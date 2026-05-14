import React, { useEffect, useMemo, useState } from "react";
import "../../styles/Category.css";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../service/categories";

export default function CategoryManagement() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [createName, setCreateName] = useState("");
  const [createSlug, setCreateSlug] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    return (categories || []).filter((c) => {
      return (
        String(c?.name || "").toLowerCase().includes(q) ||
        String(c?.slug || "").toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      setCategories(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.name || "");
    setEditSlug(c.slug || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createName.trim() || !createSlug.trim()) return;
    try {
      await createCategory({ name: createName.trim(), slug: createSlug.trim() });
      setCreateName("");
      setCreateSlug("");
      await refresh();
    } catch (err) {
      alert(err?.message || "Tạo category thất bại.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!editName.trim() || !editSlug.trim()) return;
    try {
      await updateCategory(editingId, { name: editName.trim(), slug: editSlug.trim() });
      cancelEdit();
      await refresh();
    } catch (err) {
      alert(err?.message || "Cập nhật category thất bại.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá category này không?")) return;
    try {
      await deleteCategory(id);
      await refresh();
    } catch (err) {
      alert(err?.message || "Xóa category thất bại.");
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Category</h2>
          <p className="page-subtitle">Tạo / sửa / xoá danh mục cho bài viết</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Thêm category</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="form-input"
              placeholder="Name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Slug"
              value={createSlug}
              onChange={(e) => setCreateSlug(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              Tạo mới
            </button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h3>Danh sách category</h3>
          <input
            className="form-input"
            style={{ maxWidth: 320 }}
            placeholder="Tìm theo name/slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card-body">
          {loading ? <div>Đang tải...</div> : null}

          <div style={{ width: "100%", overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th style={{ width: 220 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const isEditing = editingId === c.id;
                  return (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>
                        {isEditing ? (
                          <input className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        ) : (
                          c.name
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input className="form-input" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} />
                        ) : (
                          c.slug
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-primary" type="button" onClick={handleSaveEdit}>
                              Lưu
                            </button>
                            <button className="btn-secondary" type="button" onClick={cancelEdit}>
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-secondary" type="button" onClick={() => startEdit(c)}>
                              Sửa
                            </button>
                            <button className="btn-danger" type="button" onClick={() => handleDelete(c.id)}>
                              Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 16 }}>
                      Không có category nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

