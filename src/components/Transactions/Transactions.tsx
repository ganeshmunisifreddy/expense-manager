import React, { useState } from "react";
import { Typography, IconButton, Card, Menu, MenuItem, Fab } from "@mui/material";
import { CreditCardIcon, DotsVerticalIcon, PlusIcon } from "@heroicons/react/outline";
import { doc, deleteDoc } from "firebase/firestore";

import styles from "./Transactions.module.scss";
import { ConvertToCurrency, formatDateText } from "../../utils/common";
import AddTransaction from "./AddTransaction";
import { db } from "../../firebase/config";
import Loader from "../Loader";

const Transactions = (props: any) => {
  const { data = [], getTransactions } = props;

  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleLoading = (value: boolean) => setIsLoading(value);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setTransactionId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (key: string) => {
    handleClose();
    switch (key) {
      case "edit":
        return handleEditMode(transactionId);
      case "delete":
        return handleDelete(transactionId);
      default:
        break;
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirm = confirm("Are you sure, you want to delete?");
    if (isConfirm) {
      setIsLoading(true);
      try {
        const docRef = doc(db, "expenses", id);
        await deleteDoc(docRef);
        setIsLoading(false);
        getTransactions();
      } catch (e: any) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  const handleEditMode = (id: string) => {
    setTransactionId(id);
    setIsOpen(true);
  };

  return (
    <>
      {isLoading && <Loader fullScreen />}
      <div className={styles.root}>
        <div className={styles.transactions}>
          {data?.length > 0 && (
            <div>
              {data.map((txn: any, index: number) => (
                <Card key={txn.id + "-" + index} className={styles.transaction}>
                  <div style={{ flex: 6, overflow: "hidden" }}>
                    <Typography className={styles.description}>{txn.description}</Typography>
                    <Typography className={styles.account}>
                      <CreditCardIcon height={16} color="#7635dc" className={styles.accountIcon} />
                      {txn.account}
                    </Typography>
                  </div>
                  <div style={{ flex: 3 }} className="text-right">
                    <Typography className={styles.date}>
                      {formatDateText(txn.date, txn.time)}
                    </Typography>
                    <Typography color="primary">{ConvertToCurrency(txn.amount)}</Typography>
                  </div>
                  <div style={{ flex: 1, textAlign: "right", cursor: "pointer" }}>
                    <IconButton
                      onClick={(e: any) => handleClick(e, txn.id)}
                      style={{ marginLeft: 8 }}>
                      <DotsVerticalIcon height={16} color="#7635dc" />
                    </IconButton>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleAction("edit")}>Edit</MenuItem>
            <MenuItem onClick={() => handleAction("delete")}>Delete</MenuItem>
          </Menu>

          <Fab size="medium" color="primary" className={styles.fabBtn} onClick={openModal}>
            <PlusIcon height={16} color="#FFFFFF" />
          </Fab>

          {data?.length === 0 && (
            <Typography variant="h6" style={{ textAlign: "center" }}>
              No Transactions
            </Typography>
          )}
        </div>

        {isOpen && (
          <AddTransaction
            transactions={data}
            getTransactions={getTransactions}
            transactionId={transactionId}
            toggleLoading={toggleLoading}
            handleEditMode={handleEditMode}
            open={isOpen}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
};

export default Transactions;
