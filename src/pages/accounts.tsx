import React from "react";
import { useState } from "react";
import { Button, Typography, Card, IconButton } from "@mui/material";
import { NextPage } from "next";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/Accounts.module.scss";
import PrivateLayout from "../layouts/PrivateLayout";
import Loader from "../components/Loader/Loader";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import AuthGuard from "../guards/AuthGuard";
import Head from "next/head";
import AddAccount from "../components/Accounts/AddAccount";
import Iconify from "../components/Iconify";

const Accounts: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<any>(null);

  const { user, accounts, updateAccounts }: any = useAuth();

  const { uid = "" } = user || {};

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setAccountId("");
  };

  const handleSelect = (id: string) => {
    setAccountId(id);
    openModal();
  };

  const handleSave = async (account: any) => {
    if (account.name.length < 3) {
      return alert("Account name must contain at least 3 characters");
    }
    setIsLoading(true);
    const newAccounts = { ...accounts };
    if (accountId) {
      newAccounts[accountId] = { ...account };
    } else {
      newAccounts[crypto.randomUUID()] = { ...account };
    }
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { accounts: newAccounts });
      updateAccounts(newAccounts);
      setIsLoading(false);
      closeModal();
    } catch (e: any) {
      console.error(e.message);
      alert(e.message);
      setIsLoading(false);
    }
  };

  // const handleDelete = (e: any) => {
  //   e.stopPropagation();
  //   const isConfirm = confirm("Are you sure, you want to delete?");
  //   if (!isConfirm) return;
  // };

  return (
    <AuthGuard>
      <PrivateLayout>
        <Head>
          <title>Accounts | Expense Manager</title>
        </Head>
        {isLoading && <Loader fullScreen />}
        <div className={styles.root}>
          <div className={`${styles.headerSection} sticky`}>
            <Typography variant="h6">Accounts</Typography>
            <Button variant="contained" onClick={openModal}>
              <Iconify icon="ic:round-add-card" style={{ marginRight: 4 }} /> Add
            </Button>
          </div>
          <div className={styles.container}>
            {Object.keys(accounts)
              .sort((a, b) => {
                if (accounts[b].name < accounts[a].name) {
                  return 1;
                } else {
                  return -1;
                }
              })
              .map((key) => {
                return (
                  <Card key={key} className={styles.accountCard} onClick={() => handleSelect(key)}>
                    <Typography sx={{ fontWeight: "bold" }}>{accounts[key].name}</Typography>
                    <IconButton>
                      {/* <Iconify icon="solar:trash-bin-minimalistic-bold" /> */}
                      <Iconify icon="solar:pen-2-bold" />
                    </IconButton>
                  </Card>
                );
              })}
          </div>
        </div>
        <AddAccount open={isOpen} onClose={closeModal} accountId={accountId} onSave={handleSave} />
      </PrivateLayout>
    </AuthGuard>
  );
};

export default Accounts;
