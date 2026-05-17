import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getAllTerms() {
  const res = await api.get("/terms");
  return unwrap(res) || [];
}

export async function createTerm({ code, name, startDate, endDate }) {
  const res = await api.post("/terms", {
    code,
    name,
    startDate: startDate || null,
    endDate: endDate || null,
  });
  return unwrap(res);
}

export async function updateTerm(code, { name, startDate, endDate }) {
  const res = await api.put(`/terms/${encodeURIComponent(code)}`, {
    name,
    startDate: startDate || null,
    endDate: endDate || null,
  });
  return unwrap(res);
}

export async function deleteTerm(code) {
  const res = await api.delete(`/terms/${encodeURIComponent(code)}`);
  return unwrap(res);
}

