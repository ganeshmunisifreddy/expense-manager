import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/PrivateLayout.module.scss";

type Props = {
  children: any;
};

const PrivateLayout = ({ children }: Props) => {
  const { user }: any = useAuth();

  const userId: string = user?.uid || "";

  const displayName: string = user?.displayName || "";

  const router = useRouter();

  useEffect(() => {
    if (userId) {
      if (!displayName && router.pathname !== "/profile") {
        router.replace("/profile");
      }
    }
  }, [userId, displayName, router]);

  return (
    <Box className={styles.layout}>
      <Header />
      <div className={styles.layoutContent}>{children}</div>
    </Box>
  );
};

export default PrivateLayout;
