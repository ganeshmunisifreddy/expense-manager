import { Typography } from "@mui/material";
import styles from "./Backgrounds.module.scss";

type Props = {
  text?: string;
};

const Backgrounds = (props: Props) => {
  const { text } = props;
  return (
    <div className={styles.root}>
      <div className={styles.background}>
        <Typography variant="h4">{text}</Typography>
      </div>
    </div>
  );
};

export default Backgrounds;
