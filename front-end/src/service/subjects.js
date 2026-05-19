import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getAllSubjects() {
  const res = await api.get("/subjects");
  return unwrap(res) || [];
}

export async function getSubjectsPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/subjects/page", { params: { page, size } });
  return unwrap(res);
}

export async function getSubjectByCode(code) {
  const res = await api.get(`/subjects/${encodeURIComponent(code)}`);
  return unwrap(res);
}

export async function createSubject({ code, name, finalExamWeight, midtermWeight, attendanceWeight }) {
  const res = await api.post("/subjects", {
    code,
    name,
    finalExamWeight: finalExamWeight ?? null,
    midtermWeight: midtermWeight ?? null,
    attendanceWeight: attendanceWeight ?? null,
  });
  return unwrap(res);
}

export async function updateSubject(code, { name, finalExamWeight, midtermWeight, attendanceWeight }) {
  const res = await api.put(`/subjects/${encodeURIComponent(code)}`, {
    name,
    finalExamWeight: finalExamWeight ?? null,
    midtermWeight: midtermWeight ?? null,
    attendanceWeight: attendanceWeight ?? null,
  });
  return unwrap(res);
}

export async function deleteSubject(code) {
  const res = await api.delete(`/subjects/${encodeURIComponent(code)}`);
  return unwrap(res);
}
