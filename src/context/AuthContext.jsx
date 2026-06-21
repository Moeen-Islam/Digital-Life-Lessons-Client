import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "../lib/auth-client";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const session = useSession();
  const [appUser, setAppUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const authUser = session?.data?.user || null;
  const authLoading = Boolean(session?.isPending);

  async function refreshUser() {
    if (!authUser) {
      setAppUser(null);
      return null;
    }
    setProfileLoading(true);
    try {
      const { data } = await api.get("/users/me");
      setAppUser(data.user);
      return data.user;
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    refreshUser().catch(() => setAppUser(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.email]);

  const value = useMemo(
    () => ({
      session,
      authUser,
      user: appUser,
      refreshUser,
      loading: authLoading || profileLoading,
      isLoggedIn: Boolean(authUser),
      isPremium: Boolean(appUser?.isPremium),
      isAdmin: appUser?.role === "admin"
    }),
    [session, authUser, appUser, authLoading, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
