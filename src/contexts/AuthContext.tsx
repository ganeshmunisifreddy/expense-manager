import React, { useEffect, useState, useContext, createContext, useCallback } from "react";
import Loader from "../components/Loader";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const AuthContext = createContext({
  user: null,
  isUserLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  const clear = () => {
    setCurrentUser(null);
    setIsUserLoading(false);
  };

  const authStateChanged = useCallback(async (user: any) => {
    setIsUserLoading(true);
    if (!user) {
      clear();
      return;
    }
    setCurrentUser(user);
    setIsUserLoading(false);
  }, []);

  const logout = () =>
    signOut(auth).then(() => {
      clear();
    });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, [authStateChanged]);

  return {
    currentUser,
    isUserLoading,
    logout,
  };
};

export const AuthContextProvider = ({ children }: any) => {
  const { currentUser: user, isUserLoading, logout } = useFirebaseAuth();

  const value = {
    user,
    isUserLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isUserLoading ? <Loader fullScreen /> : children}
    </AuthContext.Provider>
  );
};
