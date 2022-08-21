import React from "react";
import { useEffect, useState } from "react";
import {
  Button,
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
  amount: "",
  description: "",
  account: "",
  date: format(new Date(), "yyyy-MM-dd"),
  time: format(new Date(), "HH:mm"),
};

const FIELDS = [
  {
    label: "Amount",
    type: "number",
    placeholder: "Enter Amount",
    name: "amount",
    fullWidth: true,
    required: true,
  },
  {
    label: "What was this spend for?",
    type: "text",
    placeholder: "Enter description",
    name: "description",
    fullWidth: true,
    required: true,
  },
  {
    label: "Account",
    type: "text",
    placeholder: "Enter Account",
    name: "account",
    fullWidth: true,
    required: false,
  },
  {
    label: "Date",
    type: "date",
    placeholder: "",
    name: "date",
    fullWidth: true,
    required: true,
  },
  {
    label: "Time",
    type: "time",
    placeholder: "",
    name: "time",
    fullWidth: true,
    required: true,
  },
];

const AddTransaction = (props: any) => {
  const {
    transactions,
    getTransactions,
    transactionId = "",
    toggleLoading,
    handleEditMode,
    open,
    onClose,
    selectedGroup,
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

  const resetTransaction = () => {
    handleEditMode("");
    setNewTransaction({ ...initialTransaction });
    toggleLoading(false);
    onClose();
    getTransactions();
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    toggleLoading(true);
    try {
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
          createdBy: currentUser?.uid || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          groupId: selectedGroup?.id,
        };
        console.error(newTxn);
        await addDoc(txnCollectionRef, newTxn);
        resetTransaction();
      }
    } catch (e: any) {
      console.error(e.message);
      toggleLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      //onClose={onClose}
    >
      <form onSubmit={handleSave}>
        <DialogTitle align="center">
          <Typography>{transactionId ? "Edit Expense" : "Add Expense"}</Typography>
        </DialogTitle>
        <DialogContent>
          <div className={styles.formFields}>
            {FIELDS.map((field: any, index: number) => {
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
                    fullWidth={field.fullWidth}
                    required={field.required}
                    autoComplete="off"
                  />
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {newTransaction.id ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransaction;
