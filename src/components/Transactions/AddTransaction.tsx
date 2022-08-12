import React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
} from "@mui/material";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import styles from "./Transactions.module.scss";
import { db } from "../../firebase/config";
import { format } from "date-fns";
import { deleteKeys } from "../../utils/common";
import { useAuth } from "../../contexts/AuthContext";

const initialTransaction = {
  account: "",
  amount: "",
  description: "",
  date: format(new Date(), "yyyy-MM-dd"),
  time: format(new Date(), "HH:mm"),
  isHomeExpense: false,
};

const AddTransaction = (props: any) => {
  const {
    transactions,
    getTransactions,
    transactionId = "",
    toggleLoading,
    handleEditMode,
    open,
    onClose,
  } = props;

  const { currentUser }: any = useAuth();

  const [newTransaction, setNewTransaction] = useState<any>(initialTransaction);

  const txnCollectionRef = collection(db, "expenses");

  useEffect(() => {
    const transaction = transactions.find((item: any) => item.id === transactionId);
    if (transaction) {
      setNewTransaction(transaction);
    }
  }, [transactionId, transactions]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const obj = {
      ...newTransaction,
      [name]: value,
    };
    setNewTransaction(obj);
  };

  const handleSwitch = (name: string, checked: boolean) => {
    const obj = {
      ...newTransaction,
      [name]: checked,
    };
    setNewTransaction(obj);
  };

  const resetTransaction = () => {
    handleEditMode("");
    setNewTransaction({ ...initialTransaction });
    toggleLoading(false);
    onClose();
    getTransactions();
  };

  const handleSave = async () => {
    toggleLoading(true);
    //return console.log(newTransaction);
    if (transactionId) {
      // Edit mode
      const txnIdx = transactions.findIndex((item: any) => item.id === transactionId);
      if (txnIdx > -1) {
        const docRef = doc(db, "expenses", transactionId);
        let updatedTxn = {
          ...newTransaction,
          updatedAt: serverTimestamp(),
        };
        updatedTxn = deleteKeys(updatedTxn, ["id", "createdAt"]);
        await updateDoc(docRef, updatedTxn);
        resetTransaction();
      }
    } else {
      const newTxn = {
        ...newTransaction,
        createdBy: currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(txnCollectionRef, newTxn);
      resetTransaction();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6">{transactionId ? "Edit Expense" : "Add Expense"}</Typography>
      </DialogTitle>
      <DialogContent>
        <div className={styles.formFields}>
          <div className={styles.field}>
            <TextField
              size="small"
              label="Account"
              type="text"
              placeholder="Enter Account"
              name="account"
              value={newTransaction.account}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className={styles.field}>
            <TextField
              size="small"
              label="Amount"
              type="number"
              placeholder="Enter Amount"
              name="amount"
              value={newTransaction.amount}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className={styles.field}>
            <TextField
              size="small"
              label="Description"
              type="text"
              placeholder="Enter Description"
              name="description"
              value={newTransaction.description}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className={styles.field}>
            <TextField
              size="small"
              label="Date"
              type="date"
              name="date"
              value={newTransaction.date}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className={styles.field}>
            <TextField
              size="small"
              label="Time"
              type="time"
              name="time"
              value={newTransaction.time}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className={styles.switchField}>
            <label>Home Expense</label>
            <Switch
              checked={newTransaction.isHomeExpense}
              onChange={(e: any) => handleSwitch("isHomeExpense", e.target.checked)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {newTransaction.id ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransaction;
