import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosPublic from "../api/axiosPublic";
import { authClient } from "../api/authClient";

export const AuthContext = createContext(null);

const formatUser = (sessionUser, fallbackEmail = "") => {
  if (!sessionUser && !fallbackEmail) return null;

  return {
    ...(sessionUser || {}),
    uid: sessionUser?.id || sessionUser?._id || fallbackEmail,
    id: sessionUser?.id || sessionUser?._id || fallbackEmail,
    name: sessionUser?.name || "",
    email: sessionUser?.email || fallbackEmail,
    displayName: sessionUser?.name || "",
    photoURL: sessionUser?.avatar || sessionUser?.image || "",
    avatar: sessionUser?.avatar || sessionUser?.image || "",
    bloodGroup: sessionUser?.bloodGroup || "",
    district: sessionUser?.district || "",
    upazila: sessionUser?.upazila || "",
    role: sessionUser?.role || "donor",
    status: sessionUser?.status || "active",
  };
};

const getUserFromAuthData = (data) => {
  return data?.user || data?.session?.user || data?.data?.user || null;
};

const AuthProvider = ({ children }) => {
  const { data: sessionData, isPending, refetch } = authClient.useSession();

  const [optimisticUser, setOptimisticUser] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);

  const sessionUser = sessionData?.user || null;
  const formattedSessionUser = formatUser(sessionUser);
  const finalUser = formattedSessionUser || optimisticUser;

  const issueJwtToken = async () => {
    const { data } = await axiosPublic.post("/api/jwt");

    if (!data?.token) {
      throw new Error("JWT token was not issued.");
    }

    localStorage.setItem("scaffold-token", data.token);
    return data.token;
  };

  const refreshSession = useCallback(async () => {
    try {
      const result = await refetch?.();
      const refreshedUser = result?.data?.user || null;

      if (refreshedUser) {
        const formattedUser = formatUser(refreshedUser);
        setOptimisticUser(formattedUser);
        return result?.data || null;
      }

      return sessionData || null;
    } catch {
      return sessionData || null;
    }
  }, [refetch, sessionData]);

  const createUser = async (email, password, extraData = {}) => {
    setManualLoading(true);

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

      const responseUser = getUserFromAuthData(data);
      const formattedUser = formatUser(responseUser, email);

      setOptimisticUser(formattedUser);

      await issueJwtToken();
      await refreshSession();

      return data;
    } finally {
      setManualLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setManualLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Login failed.");
      }

      const responseUser = getUserFromAuthData(data);
      const formattedUser = formatUser(responseUser, email);

      setOptimisticUser(formattedUser);

      await issueJwtToken();
      await refreshSession();

      return data;
    } finally {
      setManualLoading(false);
    }
  };

  const logoutUser = async () => {
    setManualLoading(true);

    try {
      localStorage.removeItem("scaffold-token");
      await authClient.signOut();
      setOptimisticUser(null);
      await refreshSession();
      toast.success("Logged out successfully.");
    } finally {
      setManualLoading(false);
    }
  };

  const updateUserProfile = async (profile) => {
    setManualLoading(true);

    try {
      const { data, error } = await authClient.updateUser({
        name: profile.name || profile.displayName || finalUser?.name || "",
        image: profile.avatar || profile.photoURL || finalUser?.photoURL || "",
        avatar: profile.avatar || profile.photoURL || finalUser?.photoURL || "",
        bloodGroup: profile.bloodGroup || finalUser?.bloodGroup || "",
        district: profile.district || finalUser?.district || "",
        upazila: profile.upazila || finalUser?.upazila || "",
      });

      if (error) {
        throw new Error(error.message || "Profile update failed.");
      }

      await refreshSession();
      return data;
    } finally {
      setManualLoading(false);
    }
  };

  const fetchDbUser = async () => refreshSession();

  const authInfo = useMemo(
    () => ({
      session: sessionData || null,
      user: finalUser,
      dbUser: finalUser,
      loading: Boolean(isPending || manualLoading),
      createUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      fetchDbUser,
      refreshSession,
      isAdmin: finalUser?.role === "admin",
      isVolunteer: finalUser?.role === "volunteer",
      isDonor: !finalUser?.role || finalUser?.role === "donor",
      isBlocked: finalUser?.status === "blocked",
    }),
    [sessionData, finalUser, isPending, manualLoading, refreshSession]
  );

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;