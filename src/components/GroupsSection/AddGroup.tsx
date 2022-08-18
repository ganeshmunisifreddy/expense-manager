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
import styles from "./Groups.module.scss";
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
  isHomeExpense: false,
};

const AddGroup = (props: any) => {
  const { groups, getGroups, groupId = "", toggleLoading, handleEditMode, open, onClose } = props;

  const { currentUser }: any = useAuth();

  const [newTransaction, setNewTransaction] = useState<any>(initialTransaction);

  const txnCollectionRef = collection(db, "expenses");

  useEffect(() => {
    const transaction = groups.find((item: any) => item.id === groupId);
    if (transaction) {
      setNewTransaction(transaction);
    }
  }, [groupId, groups]);

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
    getGroups();
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    //return console.log(newTransaction);
    toggleLoading(true);
    try {
      if (groupId) {
        // Edit mode
        const id = groups.findIndex((item: any) => item.id === groupId);
        if (id > -1) {
          const docRef = doc(db, "expenses", groupId);
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
        };
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
          <Typography>{groupId ? "Edit Group" : "Add Group"}</Typography>
        </DialogTitle>
        <DialogContent>
          <div className={styles.formFields}>
            <div className={styles.field}>
              <TextField
                size="small"
                label="Name"
                type="text"
                placeholder="Enter Group name"
                name="name"
                value=""
                onChange={handleChange}
                fullWidth
                required
              />
            </div>
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

export default AddGroup;
