import React, { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import styles from "./AddAccount.module.scss";
import { trimSpaces } from "../../utils/common";
import Iconify from "../Iconify";
import Transition from "../Trasition";
import { useAuth } from "../../contexts/AuthContext";

const accountTypes: any = ["Bank", "UPI", "Credit", "Wallet", "Cash"];

const AddAccount = (props: any) => {
  const { open, onClose, onSave, accountId } = props;

  const [newAccount, setNewAccount] = useState<any>({
    name: "",
    type: "",
    defaultBankAccount: "",
  });

  const { accounts }: any = useAuth();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const obj = {
      ...newAccount,
      [name]: value,
    };
    setNewAccount(obj);
  };

  const clear = () => {
    onClose();
    setNewAccount({
      name: "",
      type: "",
      defaultBankAccount: "",
    });
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    const newAc = trimSpaces(newAccount);
    onSave(newAc);
  };

  useEffect(() => {
    if (accountId) {
      setNewAccount({ name: "", type: "", defaultBankAccount: "", ...accounts[accountId] });
    }
  }, [accountId, accounts]);

  return (
    <Dialog open={open} TransitionComponent={Transition} fullScreen>
      <form onSubmit={handleSave} className={styles.form}>
        <AppBar sx={{ position: "relative", borderRadius: 0 }}>
          <Toolbar>
            <IconButton onClick={clear} sx={{ color: "#fff" }}>
              <Iconify icon="ep:close-bold" />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1 }} align="center" component="div">
              {newAccount?.name ? "Edit" : "Add"} Account
            </Typography>
            <Button variant="contained" type="submit">
              {accountId ? "Update" : "Save"}
            </Button>
          </Toolbar>
        </AppBar>
        <div className={styles.formContainer}>
          <div className={styles.formFields}>
            <div className={styles.field}>
              <TextField
                size="small"
                label="Name"
                type="text"
                placeholder="Enter account name"
                name="name"
                value={newAccount.name}
                onChange={handleChange}
                autoComplete="off"
                variant="standard"
                fullWidth
                required
              />
            </div>
            <FormControl variant="standard" className={styles.field} required>
              <InputLabel>Type</InputLabel>
              <Select value={newAccount.type} name="type" onChange={handleChange}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {accountTypes.map((val: string) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newAccount.type === "UPI" && (
              <FormControl variant="standard" className={styles.field}>
                <InputLabel>Default Bank Account</InputLabel>
                <Select
                  value={newAccount.defaultBankAccount}
                  name="defaultBankAccount"
                  onChange={handleChange}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Object.keys(accounts).map((key: string) => {
                    if (accounts[key].type !== "Bank") return null;
                    return (
                      <MenuItem key={key} value={key}>
                        {accounts[key].name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default AddAccount;
