import React from "react";
import { Box, Button, Typography } from "@mui/material";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Iconify from "../Iconify";

const LINKS = [
  {
    name: "Home",
    link: "/",
    icon: "heroicons:home-20-solid",
    iconOutline: "heroicons:home",
  },
  {
    name: "Groups",
    link: "/groups",
    icon: "heroicons:user-group-20-solid",
    iconOutline: "heroicons:user-group",
  },
  {
    name: "Profile",
    link: "/profile",
    icon: "heroicons:user-circle-solid",
    iconOutline: "heroicons:user-circle",
  },
];

const Header = () => {
  const router = useRouter();
  const isActivePath = (path: string) => path === router.pathname;

  return (
    <div className={styles.header}>
      <Typography variant="h6" className={styles.logo}>
        Expense Manager
      </Typography>
      <Box className={styles.menu}>
        {LINKS.map((item, index) => {
          const active = isActivePath(item.link);
          return (
            <Button
              key={item.name + index}
              component={Link}
              href={item.link}
              className={styles.menuButton}
              // startIcon={
              //   active ? <Iconify icon={item.iconOutline} /> : <Iconify icon={item.icon} />
              // }
              variant={active ? "contained" : "text"}>
              <Iconify icon={active ? item.iconOutline : item.icon} />
              <span className={styles.menuLabelDesktop}>{item.name}</span>
              <span className={styles.menuLabelMobile}>{active ? item.name : ""}</span>
            </Button>
          );
        })}
      </Box>
    </div>
  );
};

export default Header;
