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

const accountIcons: any = {
  Bank: "ph:bank-fill",
  UPI: "solar:double-alt-arrow-right-bold",
  Credit: "solar:card-bold",
  Wallet: "solar:wallet-bold",
  Cash: "heroicons-outline:cash",
};

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

  const accountsMap: any = Object.keys(accounts).reduce((acc, key) => {
    const acMap: any = { ...acc };
    const accountType = accounts[key].type;
    if (accountType) {
      if (!acMap[accountType]) acMap[accountType] = [];
      acMap[accountType].push({ ...accounts[key], id: key });
    } else {
      if (!acMap["Others"]) acMap["Others"] = [];
      acMap["Others"].push({ ...accounts[key], id: key });
    }
    return acMap;
  }, {});

  return (
    <AuthGuard>
      <PrivateLayout>
        <Head>
          <title>Accounts | Xpense Tracker</title>
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
            {Object.keys(accountsMap)
              .sort()
              .map((accountKey: string) => {
                return (
                  <div key={accountKey}>
                    <Typography variant="h6" sx={{ textTransform: "capitalize", mb: 1 }}>
                      {accountKey}
                    </Typography>
                    {accountsMap[accountKey]
                      .sort((a: any, b: any) => {
                        if (b.name < a.name) {
                          return 1;
                        } else if (b.name > a.name) {
                          return -1;
                        } else {
                          return 0;
                        }
                      })
                      .map((ac: any, index: number) => (
                        <Card
                          key={ac.name + index}
                          className={styles.accountCard}
                          onClick={() => handleSelect(ac.id)}>
                          <Typography className={styles.accountName}>
                            {ac.type && (
                              <Iconify icon={accountIcons[ac.type]} style={{ marginRight: 8 }} />
                            )}
                            <span>{ac.name}</span>
                          </Typography>
                          <IconButton>
                            <Iconify icon="solar:pen-2-bold" />
                          </IconButton>
                        </Card>
                      ))}
                  </div>
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
