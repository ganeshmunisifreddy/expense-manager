import React from "react";
import { IconButton, Typography } from "@mui/material";
import {
  Home,
  HomeOutline,
  AccountGroup,
  AccountGroupOutline,
  AccountCircle,
  AccountCircleOutline,
} from "mdi-material-ui";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const isActivePath = (path: string) => path === router.pathname;

  return (
    <div className={styles.header}>
      <div className={styles.menuItem}>
        <Link href="/" passHref>
          <IconButton>
            {isActivePath("/") ? (
              <div className={styles.activeRoute}>
                <Home />
                <Typography>Home</Typography>
              </div>
            ) : (
              <HomeOutline />
            )}
          </IconButton>
        </Link>
      </div>
      <div className={styles.menuItem}>
        <Link href="/groups" passHref>
          <IconButton>
            {isActivePath("/groups") ? (
              <div className={styles.activeRoute}>
                <AccountGroup />
                <Typography>Groups</Typography>
              </div>
            ) : (
              <AccountGroupOutline />
            )}
          </IconButton>
        </Link>
      </div>
      <div className={styles.menuItem}>
        <Link href="/profile" passHref>
          <IconButton>
            {isActivePath("/profile") ? (
              <div className={styles.activeRoute}>
                <AccountCircle />
                <Typography>Profile</Typography>
              </div>
            ) : (
              <AccountCircleOutline />
            )}
          </IconButton>
        </Link>
      </div>
    </div>
  );
};

export default Header;
