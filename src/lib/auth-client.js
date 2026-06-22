import { createAuthClient } from "better-auth/react";

function cleanBaseUrl(url) {
  return String(url || "")
    .replace(/^VITE_API_URL=/, "")
    .replace(/\/+$/, "")
    .replace(/\/api\/auth$/, "")
    .replace(/\/api$/, "");
}

const fallbackBase =
  import.meta.env.PROD && typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5000";

const API_BASE = cleanBaseUrl(
  import.meta.env.VITE_API_URL || fallbackBase
);

export const authClient = createAuthClient({
  baseURL: `${API_BASE}/api/auth`
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession
} = authClient;