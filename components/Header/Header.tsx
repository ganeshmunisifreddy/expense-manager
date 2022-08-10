import React from "react";
import { Text, Button } from "@nextui-org/react";

import styles from "./Header.module.css";

type Props = {
  logout: React.MouseEventHandler;
};

const Header = (props: Props) => {
  const { logout } = props;
  return (
    <div className={styles.header}>
      <Text h4>Expense Manager</Text>
      <Button bordered auto color="error" size="sm" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Header;
