import api from "./api";

export async function createReaction({ userId, postId, reactionType = "LIKE" }) {
  const res = await api.post("/reactions", { userId, postId, reactionType });
  return res?.data ?? null;
}

export async function deleteReaction({ userId, postId }) {
  const res = await api.delete("/reactions", { params: { userId, postId } });
  return res?.data ?? null;
}

