import { createAuthClient } from "better-auth/react";

function cleanBaseUrl(url) {
  return String(url || "")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
}

const API_BASE = cleanBaseUrl(
  import.meta.env.VITE_API_URL || "http://localhost:5000"
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