import React from "react";
import { Loading } from "@nextui-org/react";
import styles from "./Loader.module.css";

type Props = {
  fullScreen?: boolean;
  size?: any;
  color?: any;
};

const Loader = (props: Props) => {
  const { fullScreen, ...rest } = props;
  if (fullScreen) {
    return (
      <div className={styles.overlay}>
        <Loading {...rest} />
      </div>
    );
  }
  return <Loading {...rest} />;
};

export default Loader;
