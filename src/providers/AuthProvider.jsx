import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "../api/authClient";

export const AuthContext = createContext(null);

const formatUser = (sessionUser) => {
  if (!sessionUser) return null;

  return {
    ...sessionUser,
    uid: sessionUser.id,
    displayName: sessionUser.name || "",
    photoURL: sessionUser.avatar || sessionUser.image || "",
  };
};

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await authClient.getSession();

      if (error) {
        setSession(null);
        setUser(null);
        setDbUser(null);
        return null;
      }

      const sessionUser = data?.user || null;
      const formattedUser = formatUser(sessionUser);

      setSession(data || null);
      setUser(formattedUser);
      setDbUser(formattedUser);

      return data || null;
    } catch {
      setSession(null);
      setUser(null);
      setDbUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const createUser = async (email, password, extraData = {}) => {
    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: extraData.name || extraData.displayName || "",
        image: extraData.avatar || extraData.photoURL || "",
        avatar: extraData.avatar || extraData.photoURL || "",
        bloodGroup: extraData.bloodGroup || "",
        district: extraData.district || "",
        upazila: extraData.upazila || "",
      });

      if (error) {
        throw new Error(error.message || "Registration failed.");
      }

      await refreshSession();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Login failed.");
      }

      await refreshSession();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);

    try {
      await authClient.signOut();

      setSession(null);
      setUser(null);
      setDbUser(null);

      toast.success("Logged out successfully.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profile) => {
    const { data, error } = await authClient.updateUser({
      name: profile.name || profile.displayName || user?.name || "",
      image: profile.avatar || profile.photoURL || user?.photoURL || "",
      avatar: profile.avatar || profile.photoURL || user?.photoURL || "",
      bloodGroup: profile.bloodGroup || dbUser?.bloodGroup || "",
      district: profile.district || dbUser?.district || "",
      upazila: profile.upazila || dbUser?.upazila || "",
    });

    if (error) {
      throw new Error(error.message || "Profile update failed.");
    }

    await refreshSession();
    return data;
  };

  const fetchDbUser = async () => {
    return refreshSession();
  };

  const authInfo = useMemo(
    () => ({
      session,
      user,
      dbUser,
      loading,
      createUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      fetchDbUser,
      refreshSession,
      isAdmin: dbUser?.role === "admin",
      isVolunteer: dbUser?.role === "volunteer",
      isDonor: !dbUser?.role || dbUser?.role === "donor",
      isBlocked: dbUser?.status === "blocked",
    }),
    [session, user, dbUser, loading, refreshSession]
  );

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;