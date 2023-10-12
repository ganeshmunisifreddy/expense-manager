import React from "react";
import { useEffect, useState } from "react";
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
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import styles from "./Transactions.module.scss";
import { db } from "../../firebase/config";
import { format } from "date-fns";
import { deleteKeys, trimSpaces } from "../../utils/common";
import { useAuth } from "../../contexts/AuthContext";
import Iconify from "../Iconify";
import Transition from "../Trasition";

const FIELDS = [
  {
    label: "Amount",
    type: "number",
    placeholder: "Enter Amount",
    name: "amount",
    required: true,
  },
  {
    label: "What was this spend for?",
    type: "text",
    placeholder: "Enter description",
    name: "description",
    required: true,
  },
  {
    label: "Mode of payment",
    type: "select",
    name: "modeOfPayment",
    required: false,
  },
  {
    label: "Account",
    type: "select",
    name: "accountId",
    required: true,
  },
  {
    label: "Date",
    type: "date",
    placeholder: "",
    name: "date",
    required: true,
  },
  {
    label: "Time",
    type: "time",
    placeholder: "",
    name: "time",
    required: true,
  },
];

const AddTransaction = (props: any) => {
  const {
    transactions,
    getTransactions,
    transactionId = "",
    toggleLoading,
    open,
    onClose,
    selectedGroup,
  } = props;

  const { user, accounts }: any = useAuth();

  const [newTransaction, setNewTransaction] = useState<any>({
    amount: "",
    description: "",
    modeOfPayment: "",
    accountId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
  });

  const txnCollectionRef = collection(db, "expenses");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const obj = {
      ...newTransaction,
      [name]: value,
      ...(name === "modeOfPayment" &&
        accounts[value]?.defaultBankAccount && {
          accountId: accounts[value]?.defaultBankAccount,
        }),
    };
    setNewTransaction(obj);
  };

  const clear = () => {
    onClose();
    setNewTransaction({
      amount: "",
      description: "",
      modeOfPayment: "",
      accountId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
    });
  };

  const resetTransaction = () => {
    clear();
    toggleLoading(false);
    getTransactions();
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const txn = trimSpaces(newTransaction);
    // console.log(txn);
    // return;
    toggleLoading(true);
    try {
      if (transactionId) {
        // Edit mode
        const txnIdx = transactions.findIndex((item: any) => item.id === transactionId);
        if (txnIdx > -1) {
          const docRef = doc(db, "expenses", transactionId);
          let updatedTxn = {
            ...txn,
            updatedAt: serverTimestamp(),
          };
          updatedTxn = deleteKeys(updatedTxn, ["id", "createdAt"]);
          await updateDoc(docRef, updatedTxn);
          resetTransaction();
        }
      } else {
        const newTxn = {
          ...txn,
          createdBy: user?.uid || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...(selectedGroup?.id && { groupId: selectedGroup?.id }),
          ...(selectedGroup?.id && { groupName: selectedGroup?.name }),
        };
        await addDoc(txnCollectionRef, newTxn);
        resetTransaction();
      }
    } catch (e: any) {
      console.error(e.message);
      toggleLoading(false);
    }
  };

  useEffect(() => {
    const transaction = transactions.find((item: any) => item.id === transactionId);
    if (transaction) {
      setNewTransaction(transaction);
    }
  }, [transactionId, transactions]);

  return (
    <Dialog
      open={open}
      //onClose={onClose}
      TransitionComponent={Transition}
      fullScreen>
      <form onSubmit={handleSave} className={styles.form}>
        <AppBar sx={{ position: "relative", borderRadius: 0 }}>
          <Toolbar>
            <IconButton onClick={clear} sx={{ color: "#fff" }}>
              <Iconify icon="ep:close-bold" />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1 }} align="center" component="div">
              {transactionId ? "Edit Expense" : "Add Expense"}
            </Typography>
            <Button variant="contained" type="submit">
              {newTransaction.id ? "Update" : "Save"}
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
                      value={newTransaction[field.name]}
                      name={field.name}
                      onChange={handleChange}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {Object.keys(accounts).map((key) => {
                        if (field.name === "modeOfPayment" && accounts[key].type !== "UPI") {
                          return null;
                        }
                        if (field.name === "accountId" && accounts[key].type === "UPI") {
                          return null;
                        }
                        if (newTransaction.modeOfPayment) {
                          if (field.name === "accountId" && accounts[key].type !== "Bank") {
                            return null;
                          }
                        }
                        return (
                          <MenuItem key={key} value={key}>
                            {accounts[key].name}
                          </MenuItem>
                        );
                      })}
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
                    value={newTransaction[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    autoComplete="off"
                    variant="standard"
                    fullWidth
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

export default AddTransaction;
