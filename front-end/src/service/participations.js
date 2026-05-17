import api from "./api";

export async function createParticipation({ userId, activityId, role } = {}) {
  const res = await api.post("/participations", { userId, activityId, role });
  return res?.data?.result ?? null;
}

export async function getParticipationsByUserId(userId) {
  const res = await api.get(`/participations/user/${userId}`);
  return res?.data?.result ?? [];
}

export async function getParticipationsByActivityId(activityId) {
  const res = await api.get(`/participations/activity/${activityId}`);
  return res?.data?.result ?? [];
}

export async function deleteParticipation({ userId, activityId } = {}) {
  const res = await api.delete("/participations", { params: { userId, activityId } });
  return res?.data ?? null;
}

export async function requestCancelParticipation(participationId, { reason } = {}) {
  const res = await api.post(`/participations/${participationId}/cancel-request`, { reason });
  return res?.data?.result ?? null;
}

export async function approveCancelParticipation(participationId, { note } = {}) {
  const res = await api.put(`/participations/${participationId}/cancel-approve`, { note });
  return res?.data?.result ?? null;
}

export async function rejectCancelParticipation(participationId, { note } = {}) {
  const res = await api.put(`/participations/${participationId}/cancel-reject`, { note });
  return res?.data?.result ?? null;
}

export async function setParticipationLead(participationId) {
  const res = await api.put(`/participations/${participationId}/lead`);
  return res?.data?.result ?? null;
}

export async function unsetParticipationLead(participationId) {
  const res = await api.delete(`/participations/${participationId}/lead`);
  return res?.data?.result ?? null;
}
