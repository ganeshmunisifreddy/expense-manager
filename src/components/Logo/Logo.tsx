import Image from "next/image";
import logo from "../../../assets/logo.png";
import styles from "./Logo.module.scss";

const Logo = () => {
  return <Image src={logo} className={styles.logo} alt="Xpense Tracker" />;
};

export default Logo;
