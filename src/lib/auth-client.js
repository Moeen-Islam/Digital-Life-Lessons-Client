import { createAuthClient } from "better-auth/react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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