import React from "react";
import { IconButton } from "@mui/material";
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
      <Link href="/" passHref>
        <IconButton>
          {isActivePath("/") ? (
            <Home
              sx={{
                color: "#7635dc",
              }}
            />
          ) : (
            <HomeOutline />
          )}
        </IconButton>
      </Link>
      <Link href="/groups" passHref>
        <IconButton>
          {isActivePath("/groups") ? (
            <AccountGroup
              sx={{
                color: "#7635dc",
              }}
            />
          ) : (
            <AccountGroupOutline />
          )}
        </IconButton>
      </Link>
      <Link href="/profile" passHref>
        <IconButton>
          {isActivePath("/profile") ? (
            <AccountCircle
              sx={{
                color: "#7635dc",
              }}
            />
          ) : (
            <AccountCircleOutline />
          )}
        </IconButton>
      </Link>
    </div>
  );
};

export default Header;
