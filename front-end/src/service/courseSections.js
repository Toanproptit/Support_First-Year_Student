import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getAllCourseSections({ termCode, majorCode, subjectCode } = {}) {
  const params = {};
  if (termCode) params.termCode = termCode;
  if (majorCode) params.majorCode = majorCode;
  if (subjectCode) params.subjectCode = subjectCode;
  const res = await api.get("/course-sections", {
    params: Object.keys(params).length ? params : undefined,
  });
  return unwrap(res) || [];
}

export async function getCourseSectionByCode(code) {
  const res = await api.get(`/course-sections/${encodeURIComponent(code)}`);
  return unwrap(res);
}

export async function createCourseSection(payload) {
  const res = await api.post("/course-sections", payload);
  return unwrap(res);
}

export async function updateCourseSection(code, payload) {
  const res = await api.put(`/course-sections/${encodeURIComponent(code)}`, payload);
  return unwrap(res);
}

export async function deleteCourseSection(code) {
  const res = await api.delete(`/course-sections/${encodeURIComponent(code)}`);
  return unwrap(res);
}

