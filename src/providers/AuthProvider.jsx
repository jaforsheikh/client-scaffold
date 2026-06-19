import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosPublic from "../api/axiosPublic";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const logoutUser = async () => {
    setLoading(true);

    try {
      localStorage.removeItem("scaffold-token");
      setUser(null);
      setDbUser(null);
      await signOut(auth);
      toast.success("Logged out successfully.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDbUser = async (currentUser) => {
    if (!currentUser?.email) {
      setDbUser(null);
      return;
    }

    try {
      const { data } = await axiosPublic.get("/users/me", {
        params: { email: currentUser.email },
      });

      setDbUser(data);
    } catch {
      setDbUser({
        name: currentUser?.displayName || "Scaffold User",
        email: currentUser?.email || "",
        avatar: currentUser?.photoURL || "",
        role: "donor",
        status: "active",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      try {
        if (currentUser?.email) {
          setUser(currentUser);

          try {
            const { data } = await axiosPublic.post("/jwt", {
              email: currentUser.email,
            });

            if (data?.token) {
              localStorage.setItem("scaffold-token", data.token);
            }
          } catch {
            localStorage.removeItem("scaffold-token");
          }

          await fetchDbUser(currentUser);
        } else {
          localStorage.removeItem("scaffold-token");
          setUser(null);
          setDbUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = useMemo(
    () => ({
      user,
      dbUser,
      loading,
      createUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      fetchDbUser,
      isAdmin: dbUser?.role === "admin",
      isVolunteer: dbUser?.role === "volunteer",
      isDonor: !dbUser?.role || dbUser?.role === "donor",
      isBlocked: dbUser?.status === "blocked",
    }),
    [user, dbUser, loading]
  );

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;