import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getAllClubs() {
  const res = await api.get("/clubs");
  return unwrap(res) || [];
}

export async function getAllClubsPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/clubs/page", { params: { page, size } });
  return unwrap(res);
}

export async function getClubById(id) {
  const res = await api.get(`/clubs/${encodeURIComponent(id)}`);
  return unwrap(res);
}

export async function createClub(payload) {
  const res = await api.post("/clubs", payload);
  return unwrap(res);
}

export async function updateClub(id, payload) {
  const res = await api.put(`/clubs/${encodeURIComponent(id)}`, payload);
  return unwrap(res);
}

export async function deleteClub(id) {
  const res = await api.delete(`/clubs/${encodeURIComponent(id)}`);
  return unwrap(res);
}

