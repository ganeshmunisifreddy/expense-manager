import React, { useEffect, useState, useContext, createContext } from "react";
import Loader from "../components/Loader";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";

const AuthContext = createContext({
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setTimeout(() => {
        setLoading(false);
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          router.push("/login");
        }
      }, 1000);
    });

    return () => unsubscribe();
  }, [router]);

  const value = {
    user: currentUser,
    loading,
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
