"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CircularProgress } from "@mui/material";
import styles from "./Loader.module.scss";

type Props = {
  fullScreen?: boolean;
  size?: number;
  color?: any;
};

const Loader = (props: Props) => {
  const { fullScreen, ...rest } = props;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsClient(true);
    }
  }, []);

  if (fullScreen && isClient) {
    return createPortal(
      <div className={styles.overlay}>
        <CircularProgress {...rest} />
      </div>,
      document.body,
    );
  }
  return <CircularProgress {...rest} />;
};

export default Loader;
