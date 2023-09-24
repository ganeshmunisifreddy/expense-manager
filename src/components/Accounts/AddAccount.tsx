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

const FIELDS = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Account Name",
    name: "name",
    fullWidth: true,
    required: true,
  },
  {
    label: "Type",
    type: "select",
    name: "type",
    fullWidth: true,
    required: true,
    values: ["Bank", "UPI", "Credit Card", "Wallet", "Cash", "Debit Card"],
  },
];

const AddAccount = (props: any) => {
  const { open, onClose, onSave, accountId } = props;

  const [newAccount, setNewAccount] = useState<any>({
    name: "",
    type: "",
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
    });
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    const newAc = trimSpaces(newAccount);
    onSave(newAc);
  };

  useEffect(() => {
    if (accountId) {
      setNewAccount({ name: "", type: "", ...accounts[accountId] });
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
            {FIELDS.map((field: any, index: number) => {
              if (field.type === "select") {
                return (
                  <FormControl
                    variant="standard"
                    className={styles.field}
                    required={field.required}
                    key={field.label + "-" + index}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={newAccount[field.name]}
                      name={field.name}
                      onChange={handleChange}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {field?.values.map((val: string) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
              return (
                <div className={styles.field} key={field.label + "-" + index}>
                  <TextField
                    size="small"
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    name={field.name}
                    value={newAccount[field.name]}
                    onChange={handleChange}
                    fullWidth={field.fullWidth}
                    required={field.required}
                    autoComplete="off"
                    variant="standard"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default AddAccount;
