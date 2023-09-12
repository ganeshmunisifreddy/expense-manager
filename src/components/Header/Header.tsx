import React from "react";
import { Box, Button } from "@mui/material";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Iconify from "../Iconify";
import Image from "next/image";
import logo from "../../../assets/logo.png";

const LINKS = [
  {
    name: "Home",
    link: "/expenses",
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
      <Image src={logo} className={styles.logo} alt="Expense Manager" />
      <Box className={styles.menu}>
        {LINKS.map((item, index) => {
          const active = isActivePath(item.link);
          return (
            <Button
              key={item.name + index}
              component={Link}
              href={item.link}
              className={styles.menuButton}
              startIcon={<Iconify icon={active ? item.iconOutline : item.icon} />}
              variant={active ? "contained" : "text"}>
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
