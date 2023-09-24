import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Iconify from "../Iconify";
import Logo from "../Logo";

const LINKS = [
  {
    name: "Home",
    link: "/expenses",
    icon: "solar:home-smile-angle-bold",
    iconOutline: "solar:home-smile-angle-linear",
  },
  {
    name: "Groups",
    link: "/groups",
    icon: "solar:users-group-rounded-bold",
    iconOutline: "solar:users-group-rounded-linear",
  },
  {
    name: "Accounts",
    link: "/accounts",
    icon: "solar:card-bold",
    iconOutline: "solar:card-linear",
  },
  {
    name: "Profile",
    link: "/profile",
    icon: "solar:user-circle-bold",
    iconOutline: "solar:user-circle-linear",
  },
];

const Header = () => {
  const router = useRouter();
  const isActivePath = (path: string) => path === router.pathname;

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <Box className={styles.menu}>
        {LINKS.map((item, index) => {
          const active = isActivePath(item.link);
          return (
            <Button
              key={item.name + index}
              component={Link}
              href={item.link}
              className={styles.menuButton}
              startIcon={<Iconify icon={active ? item.icon : item.iconOutline} />}
              variant={active ? "contained" : "text"}>
              {item.name}
            </Button>
          );
        })}
      </Box>
      <Box className={styles.menuMobile}>
        {LINKS.map((item, index) => {
          const active = isActivePath(item.link);
          return (
            <IconButton
              key={item.name + index}
              component={Link}
              href={item.link}
              className={styles.menuButton}>
              <Iconify icon={active ? item.icon : item.iconOutline} width={active ? 26 : 24} />
            </IconButton>
          );
        })}
      </Box>
    </div>
  );
};

export default Header;
