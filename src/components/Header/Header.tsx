import React from "react";
import { Typography, Avatar, Menu, MenuItem, IconButton } from "@mui/material";

import styles from "./Header.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { stringAvatar } from "../../utils/common";
import Link from "next/link";

type Props = {
  logout: () => void;
};

const Header = (props: Props) => {
  const { logout } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (key: string) => {
    handleClose();
    switch (key) {
      case "logout":
        return logout();
      case "profile":
      default:
        break;
    }
  };
  const { currentUser }: any = useAuth();
  const displayName = stringAvatar(currentUser?.displayName || "User");
  return (
    <div className={styles.header}>
      <Typography variant="h6">Expense Manager</Typography>
      <IconButton onClick={handleClick}>
        <Avatar sx={{ background: "#7635dc", width: 32, height: 32, fontSize: 16 }}>
          {displayName}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <Link href="/profile" passHref>
          <MenuItem onClick={() => handleAction("profile")}>Profile</MenuItem>
        </Link>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default Header;
