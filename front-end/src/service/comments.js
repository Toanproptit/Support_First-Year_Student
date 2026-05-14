import api from "./api";

export async function createComment({ content, postId, userId }) {
  const res = await api.post("/comments", { content, postId, userId });
  return res?.data?.result ?? null;
}

export async function createReply({ content, postId, userId, parentId }) {
  const res = await api.post("/comments", { content, postId, userId, parentId });
  return res?.data?.result ?? null;
}

export async function getCommentById(id) {
  const res = await api.get(`/comments/${id}`);
  return res?.data?.result ?? null;
}

export async function getAllComments() {
  const res = await api.get("/comments");
  return res?.data?.result ?? [];
}

export async function getAllCommentsPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/comments/page", { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function getCommentsByPostId(postId) {
  const res = await api.get(`/comments/post/${postId}`);
  return res?.data?.result ?? [];
}

export async function getCommentsTreeByPostId(postId) {
  const res = await api.get(`/comments/post/${postId}/tree`);
  return res?.data?.result ?? [];
}

export async function getCommentsByPostIdPaged(postId, { page = 0, size = 10 } = {}) {
  const res = await api.get(`/comments/post/${postId}/page`, { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function getCommentsByUserId(userId) {
  const res = await api.get(`/comments/user/${userId}`);
  return res?.data?.result ?? [];
}

export async function getCommentsByUserIdPaged(userId, { page = 0, size = 10 } = {}) {
  const res = await api.get(`/comments/user/${userId}/page`, { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function countCommentsByPostId(postId) {
  const res = await api.get(`/comments/post/${postId}/count`);
  return res?.data?.result ?? 0;
}

export async function updateComment(id, { content }) {
  const res = await api.put(`/comments/${id}`, { content });
  return res?.data?.result ?? null;
}

export async function deleteComment(id) {
  const res = await api.delete(`/comments/${id}`);
  return res?.data ?? null;
}
