import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function getReviewsByCourseSection(courseSectionCode) {
  const res = await api.get("/course-section-reviews", { params: { courseSectionCode } });
  return unwrap(res) || [];
}

export async function getMyCourseSectionReviews() {
  const res = await api.get("/course-section-reviews/me");
  return unwrap(res) || [];
}

export async function createCourseSectionReview({ courseSectionCode, rating, title, content }) {
  const res = await api.post("/course-section-reviews", { courseSectionCode, rating, title, content });
  return unwrap(res);
}

export async function updateCourseSectionReview(id, { rating, title, content }) {
  const res = await api.put(`/course-section-reviews/${encodeURIComponent(id)}`, { rating, title, content });
  return unwrap(res);
}

export async function deleteCourseSectionReview(id) {
  const res = await api.delete(`/course-section-reviews/${encodeURIComponent(id)}`);
  return unwrap(res);
}

