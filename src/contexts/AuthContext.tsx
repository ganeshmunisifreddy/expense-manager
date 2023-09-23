import React, { useEffect, useState, useContext, createContext, useCallback } from "react";
import Loader from "../components/Loader";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = createContext({
  user: null,
  isUserLoading: true,
  accounts: {},
});

export const useAuth = () => useContext(AuthContext);

export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<any>({});

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
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    setAccounts(userData.data()?.accounts || {});
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
    accounts,
    isUserLoading,
    logout,
  };
};

export const AuthContextProvider = ({ children }: any) => {
  const { currentUser: user, accounts, isUserLoading, logout } = useFirebaseAuth();

  const value = {
    user,
    accounts,
    isUserLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isUserLoading ? <Loader fullScreen /> : children}
    </AuthContext.Provider>
  );
};
