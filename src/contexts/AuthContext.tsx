import React, { useEffect, useState, useContext, createContext } from "react";
import Loader from "../components/Loader";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const AuthContext = createContext({
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = async () => {
    setCurrentUser(null);
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      //console.log(user);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, []);

  const value = {
    user: currentUser,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader fullScreen /> : children}
    </AuthContext.Provider>
  );
};
