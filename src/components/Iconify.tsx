import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";
import type { BoxProps } from "@mui/material";
import { Box } from "@mui/material";

type IconifyProps = IconifyIcon | string;

interface Props extends BoxProps {
  icon: IconifyProps;
}

const Iconify = ({ icon, width = 24, sx, ...other }: Props) => (
  <Box component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
);

export default Iconify;
