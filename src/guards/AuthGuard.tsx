import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader/Loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, user]);

  return <div>{user ? children : <Loader fullScreen />}</div>;
};

export default AuthGuard;
