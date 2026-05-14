import api from "./api";

export async function getMe() {
  const res = await api.get("/users/me");
  return res?.data?.result ?? null;
}
