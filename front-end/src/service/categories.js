import api from "./api";

export async function getAllCategories() {
  const res = await api.get("/categories");
  return res?.data?.result ?? [];
}

export async function getAllCategoriesPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/categories/page", { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function createCategory({ name, slug }) {
  const res = await api.post("/categories", { name, slug });
  return res?.data?.result ?? null;
}

export async function updateCategory(id, { name, slug }) {
  const res = await api.put(`/categories/${id}`, { name, slug });
  return res?.data?.result ?? null;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/categories/${id}`);
  return res?.data ?? null;
}
