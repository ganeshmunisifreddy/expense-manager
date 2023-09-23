import React, { useState } from "react";
import { Typography, IconButton, Card, Menu, MenuItem, Fab } from "@mui/material";
import { doc, deleteDoc } from "firebase/firestore";

import styles from "./Transactions.module.scss";
import { ConvertToCurrency, formatDateText } from "../../utils/common";
import AddTransaction from "./AddTransaction";
import { db } from "../../firebase/config";
import Loader from "../Loader";
import Iconify from "../Iconify";
import { useAuth } from "../../contexts/AuthContext";

const Transactions = (props: any) => {
  const { data = [], getTransactions, selectedGroup } = props;
  const { user }: any = useAuth();

  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleLoading = (value: boolean) => setIsLoading(value);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setTransactionId("");
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
        console.error(e.message);
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
          {data?.length > 0 &&
            data.map((txn: any, index: number) => {
              const txnUser = selectedGroup?.users[txn.createdBy]?.displayName;
              return (
                <Card key={txn.id + "-" + index} className={styles.transaction}>
                  <div style={{ flex: 6, overflow: "hidden" }}>
                    <Typography className={styles.description}>{txn.description}</Typography>
                    <Typography className={styles.date}>
                      {formatDateText(txn.date, txn.time)}
                    </Typography>
                    {txn.groupName && !selectedGroup && (
                      <Typography className={styles.groupName}>{txn.groupName}</Typography>
                    )}
                  </div>
                  <div style={{ flex: 3 }} className="text-right">
                    <Typography color="primary">{ConvertToCurrency(txn.amount)}</Typography>
                    {selectedGroup && (
                      <div className={styles.account}>
                        <Typography className={styles.accountLabel}>
                          <Iconify icon="fa-solid:user" width={10} sx={{ mr: 0.5 }} />
                          {txnUser}
                        </Typography>
                      </div>
                    )}
                    {txn.account && !selectedGroup && (
                      <div className={styles.account}>
                        <Typography className={styles.accountLabel}>
                          <Iconify icon="ion:card" width={14} sx={{ mr: 0.5 }} />
                          {txn.account}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "right", cursor: "pointer" }}>
                    <IconButton
                      onClick={(e: any) => handleClick(e, txn.id)}
                      disabled={txn.createdBy !== user?.uid}
                      style={{ marginLeft: 8 }}>
                      <Iconify icon="mdi:dots-vertical" />
                    </IconButton>
                  </div>
                </Card>
              );
            })}

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleAction("edit")}>Edit</MenuItem>
            <MenuItem onClick={() => handleAction("delete")}>Delete</MenuItem>
          </Menu>

          <Fab size="medium" color="primary" className={styles.fabBtn} onClick={openModal}>
            <Iconify icon="fluent:add-12-filled" />
          </Fab>

          {data?.length === 0 && (
            <Typography variant="h6" style={{ textAlign: "center", marginTop: 128 }}>
              No Expenses
            </Typography>
          )}
        </div>

        <AddTransaction
          transactions={data}
          getTransactions={getTransactions}
          transactionId={transactionId}
          toggleLoading={toggleLoading}
          handleEditMode={handleEditMode}
          open={isOpen}
          onClose={closeModal}
          selectedGroup={selectedGroup}
        />
      </div>
    </>
  );
};

export default Transactions;
