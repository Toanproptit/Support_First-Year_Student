import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getAllMajors({ facultyCode } = {}) {
  const res = await api.get("/majors", {
    params: facultyCode ? { facultyCode } : undefined,
  });
  return unwrap(res) || [];
}

export async function createMajor({ code, name, facultyCode }) {
  const res = await api.post("/majors", { code, name, facultyCode });
  return unwrap(res);
}

export async function updateMajor(code, { name, facultyCode }) {
  const body = { name };
  if (facultyCode) body.facultyCode = facultyCode;
  const res = await api.put(`/majors/${encodeURIComponent(code)}`, body);
  return unwrap(res);
}

export async function deleteMajor(code) {
  const res = await api.delete(`/majors/${encodeURIComponent(code)}`);
  return unwrap(res);
}

