import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function createFeedback({ subject, title, content, userId } = {}) {
  const res = await api.post("/feedbacks", { subject, title, content, userId });
  return unwrap(res);
}

export async function getFeedbackById(id) {
  const res = await api.get(`/feedbacks/${id}`);
  return unwrap(res);
}

export async function getAllFeedbacks() {
  const res = await api.get("/feedbacks");
  return unwrap(res) ?? [];
}

export async function getMyFeedbacks() {
  const res = await api.get("/feedbacks/me");
  return unwrap(res) ?? [];
}

export async function updateFeedback(id, { status } = {}) {
  const res = await api.put(`/feedbacks/${id}`, { status });
  return unwrap(res);
}

export async function deleteFeedback(id) {
  const res = await api.delete(`/feedbacks/${id}`);
  return unwrap(res);
}
