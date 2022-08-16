import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

import styles from "../styles/PrivateLayout.module.scss";

type Props = {
  children: any;
};

const PrivateLayout = ({ children }: Props) => {
  const { currentUser }: any = useAuth();

  const userId: string = currentUser?.uid || "";

  const displayName: string = currentUser?.displayName || "";

  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userId) {
      if (!displayName && router.pathname !== "/profile") {
        router.push("/profile");
      }
    } else {
      router.push("/login");
    }
  }, [userId, displayName, router]);

  return (
    <Box className={styles.layout}>
      <Header logout={logout} />
      <div className={styles.layoutContent}>{children}</div>
    </Box>
  );
};

export default PrivateLayout;
