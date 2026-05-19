import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getMyCourseSections() {
  const res = await api.get("/course-section-registrations/me");
  return unwrap(res) || [];
}

export async function registerCourseSection({ courseSectionCode, userId } = {}) {
  const body = { courseSectionCode };
  if (userId != null) body.userId = userId;
  const res = await api.post("/course-section-registrations", body);
  return unwrap(res);
}

export async function unregisterCourseSection(courseSectionCode) {
  const res = await api.delete(`/course-section-registrations/${encodeURIComponent(courseSectionCode)}`);
  return unwrap(res);
}

export async function getStudentsByCourseSection(courseSectionCode) {
  const res = await api.get("/course-section-registrations", { params: { courseSectionCode } });
  return unwrap(res) || [];
}

export async function unregisterStudentFromCourseSection(courseSectionCode, userId) {
  const res = await api.delete(
    `/course-section-registrations/${encodeURIComponent(courseSectionCode)}/users/${encodeURIComponent(userId)}`
  );
  return unwrap(res);
}
