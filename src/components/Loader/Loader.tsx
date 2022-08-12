import React from "react";
import { CircularProgress } from "@mui/material";
import styles from "./Loader.module.scss";

type Props = {
  fullScreen?: boolean;
  size?: number;
  color?: any;
};

const Loader = (props: Props) => {
  const { fullScreen, ...rest } = props;
  if (fullScreen) {
    return (
      <div className={styles.overlay}>
        <CircularProgress {...rest} />
      </div>
    );
  }
  return <CircularProgress {...rest} />;
};

export default Loader;
