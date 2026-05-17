import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getAllFaculties() {
  const res = await api.get("/faculties");
  return unwrap(res) || [];
}

export async function createFaculty({ code, name }) {
  const res = await api.post("/faculties", { code, name });
  return unwrap(res);
}

export async function updateFaculty(code, { name }) {
  const res = await api.put(`/faculties/${encodeURIComponent(code)}`, { name });
  return unwrap(res);
}

export async function deleteFaculty(code) {
  const res = await api.delete(`/faculties/${encodeURIComponent(code)}`);
  return unwrap(res);
}

export async function getMajorsByFaculty(code) {
  const res = await api.get(`/faculties/${encodeURIComponent(code)}/majors`);
  return unwrap(res) || [];
}

