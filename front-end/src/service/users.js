import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getUsersPaged({ page = 0, size = 50 } = {}) {
  const res = await api.get("/users", { params: { page, size } });
  return unwrap(res);
}

export async function getAllUsers({ size = 100 } = {}) {
  const first = await getUsersPaged({ page: 0, size });
  if (!first) return [];
  const results = Array.isArray(first.results) ? first.results : [];
  const totalPages = Number(first.totalPages || 0);
  if (totalPages <= 1) return results;

  const all = [...results];
  for (let page = 1; page < totalPages; page++) {
    const next = await getUsersPaged({ page, size });
    if (next?.results?.length) all.push(...next.results);
  }
  return all;
}

export async function createUser({ fullName, username, email, password, role, majorCode }) {
  const res = await api.post("/users", { fullName, username, email, password, role, majorCode });
  return unwrap(res);
}

export async function updateUser(id, { fullName, username, email, password, role, majorCode }) {
  const res = await api.put(`/users/${id}`, { fullName, username, email, password, role, majorCode });
  return unwrap(res);
}

export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return unwrap(res);
}
