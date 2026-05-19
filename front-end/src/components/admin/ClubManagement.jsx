import React, { useEffect, useMemo, useState } from "react";
import "../../styles/AdminPages.css";
import "../../styles/FacultyManagement.css";
import Pagination from "./Pagination";
import { createClub, deleteClub, getAllClubs, updateClub } from "../../service/clubs";
import { uploadClubImage } from "../../service/upload";
import { useToast } from "../ToastProvider";

const PAGE_SIZE = 6;

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

function normalizeUrl(value) {
  const v = (value || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

export default function ClubManagement() {
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    image: "",
    description: "",
    linkFacebook: "",
    linkYoutube: "",
    linkWeb: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = async () => {
    const list = await getAllClubs();
    setClubs(list || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const list = await getAllClubs();
        if (cancelled) return;
        setClubs(list || []);
      } catch (e) {
        alert(getErrorMessage(e, "Không tải được danh sách CLB."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (clubs || []).filter((c) => {
      const name = String(c?.name || "").toLowerCase();
      const head = String(c?.head || "").toLowerCase();
      return name.includes(q) || head.includes(q);
    });
  }, [clubs, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingClub(null);
    setImageFile(null);
    setImagePreviewUrl("");
    setFormData({
      name: "",
      head: "",
      image: "",
      description: "",
      linkFacebook: "",
      linkYoutube: "",
      linkWeb: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (club) => {
    setEditingClub(club);
    setImageFile(null);
    setImagePreviewUrl("");
    setFormData({
      name: club?.name || "",
      head: club?.head || "",
      image: club?.image || "",
      description: club?.description || "",
      linkFacebook: club?.linkFacebook || "",
      linkYoutube: club?.linkYoutube || "",
      linkWeb: club?.linkWeb || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setImagePreviewUrl("");
    setSubmitting(false);
  };

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setImageFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    let imageUrl = (formData.image || "").trim();
    if (imageFile) {
      try {
        const uploaded = await uploadClubImage(imageFile);
        imageUrl = uploaded?.url || "";
      } catch (err) {
        setSubmitting(false);
        toast.show({
          type: "error",
          title: "Upload thất bại",
          message: getErrorMessage(err, "Upload ảnh thất bại."),
        });
        return;
      }
    }

    const payload = {
      name: (formData.name || "").trim(),
      head: (formData.head || "").trim(),
      image: imageUrl,
      description: (formData.description || "").trim(),
      linkFacebook: normalizeUrl(formData.linkFacebook),
      linkYoutube: normalizeUrl(formData.linkYoutube) || null,
      linkWeb: normalizeUrl(formData.linkWeb) || null,
    };

    if (!payload.name || !payload.head || !payload.image || !payload.description) {
      setSubmitting(false);
      return;
    }
    if (!payload.linkFacebook) {
      setSubmitting(false);
      return;
    }

    try {
      if (editingClub) {
        await updateClub(editingClub.id, payload);
      } else {
        await createClub(payload);
        setCurrentPage(1);
      }
      await refresh();
      closeModal();
      setSubmitting(false);
      toast.show({
        type: "success",
        title: "Thành công",
        message: editingClub ? "Cập nhật CLB thành công." : "Thêm CLB thành công.",
      });
    } catch (err) {
      setSubmitting(false);
      toast.show({ type: "error", title: "Thất bại", message: getErrorMessage(err, "Lưu CLB thất bại.") });
    }
  };

  const confirmDelete = (club) => setDeleteTarget(club);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClub(deleteTarget.id);
      setDeleteTarget(null);
      await refresh();
      if (paginated.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      alert(getErrorMessage(err, "Xoá CLB thất bại."));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Club</h2>
          <p className="page-subtitle">Tạo / sửa / xoá câu lạc bộ</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Thêm CLB
        </button>
      </div>

      <div className="table-toolbar" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tên CLB hoặc chủ nhiệm..."
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
              <th>Ảnh</th>
              <th>Tên CLB</th>
              <th>Chủ nhiệm</th>
              <th>Facebook</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Đang tải...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Không có CLB nào.
                </td>
              </tr>
            ) : (
              paginated.map((club, idx) => (
                <tr key={club.id}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    {club?.image ? (
                      <img
                        src={club.image}
                        alt={club.name}
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <strong>{club.name}</strong>
                  </td>
                  <td>{club.head || "—"}</td>
                  <td className="desc-cell" style={{ maxWidth: 260 }}>
                    {club?.linkFacebook ? (
                      <a href={club.linkFacebook} target="_blank" rel="noopener noreferrer">
                        {club.linkFacebook}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEditModal(club)}>
                        Sửa
                      </button>
                      <button className="btn-delete" onClick={() => confirmDelete(club)}>
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingClub ? "Cập nhật CLB" : "Thêm CLB"}</h3>
              <button className="btn-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    Tên CLB <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="VD: CLB Lập trình"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Chủ nhiệm <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="head"
                    value={formData.head}
                    onChange={handleChange}
                    required
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Link ảnh <span className="required">*</span>
                  </label>
                  <input type="file" accept="image/*" onChange={handleImageFileChange} />
                  {(imagePreviewUrl || formData.image) && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={imagePreviewUrl || formData.image}
                        alt="Preview"
                        style={{ width: 120, height: 120, borderRadius: 10, objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: 10 }}>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Dan link anh (tuy chon, se bi ghi de neu ban chon file)"
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Mô tả <span className="required">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Giới thiệu CLB..."
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Facebook <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="linkFacebook"
                    value={formData.linkFacebook}
                    onChange={handleChange}
                    required
                    placeholder="https://www.facebook.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Youtube</label>
                  <input
                    type="text"
                    name="linkYoutube"
                    value={formData.linkYoutube}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="text"
                    name="linkWeb"
                    value={formData.linkWeb}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {editingClub ? "Lưu" : "Thêm CLB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Xác nhận xoá</h3>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Bạn có chắc muốn xoá CLB <strong>"{deleteTarget.name}"</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Huỷ
              </button>
              <button className="btn-delete-confirm" onClick={handleDelete}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
