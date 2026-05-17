import api from "./api";

export async function createActivity({ name, startDate, endDate, address, status, description, studentQuantity } = {}) {
  const res = await api.post("/activities", { name, startDate, endDate, address, status, description, studentQuantity });
  return res?.data?.result ?? null;
}

export async function getActivityById(id) {
  const res = await api.get(`/activities/${id}`);
  return res?.data?.result ?? null;
}

export async function getAllActivities() {
  const res = await api.get("/activities");
  return res?.data?.result ?? [];
}

export async function getAllActivitiesPaged({ page = 0, size = 10 } = {}) {
  const res = await api.get("/activities/page", { params: { page, size } });
  return res?.data?.result ?? null;
}

export async function updateActivity(id, { name, startDate, endDate, address, status, description, studentQuantity } = {}) {
  const res = await api.put(`/activities/${id}`, { name, startDate, endDate, address, status, description, studentQuantity });
  return res?.data?.result ?? null;
}

export async function deleteActivity(id) {
  const res = await api.delete(`/activities/${id}`);
  return res?.data ?? null;
}
