import { createTheme } from "@mui/material/styles";
import Button from "./Overrides/Button";
import Card from "./Overrides/Card";
import Paper from "./Overrides/Paper";
import TextField from "./Overrides/TextField";
import palette from "./palette";

// Create a theme instance.
const theme = createTheme({
  palette,
  components: {
    ...Card,
    ...Button,
    ...TextField,
    ...Paper,
  } as any,
});

export default theme;
