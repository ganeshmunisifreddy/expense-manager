import React from "react";
import { IconButton } from "@mui/material";
import { HomeIcon, UsersIcon, UserCircleIcon } from "@heroicons/react/outline";

import styles from "./Header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const getActiveColor = (path: string) => {
    if (path === router.pathname) {
      return "#7635dc";
    }
    return "#000000bf";
  };
  return (
    <div className={styles.header}>
      <Link href="/" passHref>
        <IconButton>
          <HomeIcon height={24} color={getActiveColor("/")} />
        </IconButton>
      </Link>
      <Link href="/groups" passHref>
        <IconButton>
          <UsersIcon height={24} color={getActiveColor("/groups")} />
        </IconButton>
      </Link>
      <Link href="/profile" passHref>
        <IconButton>
          <UserCircleIcon height={24} color={getActiveColor("/profile")} />
        </IconButton>
      </Link>
    </div>
  );
};

export default Header;
