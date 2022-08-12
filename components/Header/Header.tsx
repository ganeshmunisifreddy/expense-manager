import React from "react";
import { Typography, Button } from "@mui/material";

import styles from "./Header.module.scss";

type Props = {
  logout: React.MouseEventHandler;
};

const Header = (props: Props) => {
  const { logout } = props;
  return (
    <div className={styles.header}>
      <Typography variant="h6">Expense Manager</Typography>
      <Button variant="outlined" color="error" size="small" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Header;
