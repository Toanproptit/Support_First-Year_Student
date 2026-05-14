function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const decoded = atob(padded);
  try {
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return decoded;
  }
}

export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;
  return payload.scope ?? null;
}

export function isTokenExpired(token, nowMs = Date.now()) {
  const payload = decodeJwt(token);
  const expSeconds = payload?.exp;
  // If token has no exp claim, treat as not expired (backend may not include exp)
  if (typeof expSeconds !== "number") return false;
  return expSeconds * 1000 <= nowMs;
}
