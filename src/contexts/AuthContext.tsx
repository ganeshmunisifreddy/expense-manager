import React, { useEffect, useState, useContext } from "react";
import Loader from "../components/Loader";
import { auth } from "../firebase/config";

const AuthContext = React.createContext({
  currentUser: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader fullScreen /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
