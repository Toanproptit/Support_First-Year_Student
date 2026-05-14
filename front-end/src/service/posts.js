import api from "./api";

export async function createPost({ title, content, userId, categoryIds = [] }) {
  const res = await api.post("/posts", { title, content, userId, categoryIds });
  return res?.data?.result ?? null;
}

export async function getPostById(id) {
  const res = await api.get(`/posts/${id}`);
  return res?.data?.result ?? null;
}

export async function getAllPosts() {
  const res = await api.get("/posts");
  return res?.data?.result ?? [];
}

export async function getAllPostsPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/posts/page", { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function getPendingPosts() {
  const res = await api.get("/posts/pending");
  return res?.data?.result ?? [];
}

export async function getPendingPostsPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/posts/pending/page", { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function approvePost(id) {
  const res = await api.put(`/posts/${id}/approve`);
  return res?.data?.result ?? null;
}

export async function rejectPost(id) {
  const res = await api.put(`/posts/${id}/reject`);
  return res?.data?.result ?? null;
}

export async function getPostsByUserId(userId) {
  const res = await api.get(`/posts/user/${userId}`);
  return res?.data?.result ?? [];
}

export async function getPostsByUserIdPaged(userId, { page = 0, size = 10 } = {}) {
  const res = await api.get(`/posts/user/${userId}/page`, { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function countPostsByUserId(userId) {
  const res = await api.get(`/posts/user/${userId}/count`);
  return res?.data?.result ?? 0;
}

export async function updatePost(id, { title, content, status } = {}) {
  const payload = { title, content };
  if (status != null) payload.status = status;
  const res = await api.put(`/posts/${id}`, payload);
  return res?.data?.result ?? null;
}

export async function deletePost(id) {
  const res = await api.delete(`/posts/${id}`);
  return res?.data ?? null;
}

