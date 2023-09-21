import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader/Loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isUserLoading } = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [router, user, isUserLoading]);

  return <>{!user ? <Loader fullScreen /> : children}</>;
};

export default AuthGuard;
