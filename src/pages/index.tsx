import type { NextPage } from "next";
import Head from "next/head";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { Typography, Container, Button, Card } from "@mui/material";
import { UserGroupIcon, UserIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { db } from "../firebase/config";
import AddTransaction from "../components/Transactions/AddTransaction";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/Home.module.scss";
import Transactions from "../components/Transactions";
import PrivateLayout from "../layouts/PrivateLayout";

const txnCollectionRef = collection(db, "expenses");

const Home: NextPage = () => {
  const [transactions, setTransactions] = useState<any>([]);
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { currentUser }: any = useAuth();

  const userId: string = currentUser?.uid || "";

  const router = useRouter();

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

  const toggleLoading = (value: boolean) => setIsLoading(value);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    const q = query(
      txnCollectionRef,
      orderBy("date", "asc"),
      where("date", ">=", "2022-08-01"),
      where("date", "<=", "2022-08-31"),
      where("createdBy", "==", userId),
      limit(10),
    );
    try {
      const data = await getDocs(q);
      const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) || [];
      setTransactions(transactions);
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getTransactions();
    } else {
      router.push("/login");
    }
  }, [userId, router, getTransactions]);

  return (
    <PrivateLayout>
      <Container className={styles.container}>
        <Head>
          <title>Expense Manager</title>
          <meta name="description" content="Expense Manager - Nine Technology" />
        </Head>

        {isLoading && <Loader fullScreen />}

        <main className={styles.main}>
          <div className={styles.cards}>
            <Card className={styles.myExpenses}>
              <UserIcon height={32} color="#212b36" />
              <Typography>My Expenses</Typography>
            </Card>
            <Card className={styles.homeExpenses}>
              <UserGroupIcon height={32} color="#212b36" />
              <Typography>Groups</Typography>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button size="small" variant="contained" style={{ width: "100%" }} onClick={openModal}>
              Add Expense
            </Button>
          </div>
          <Transactions
            data={transactions}
            handleDelete={handleDelete}
            handleEditMode={handleEditMode}
          />
        </main>
        {isOpen && (
          <AddTransaction
            transactions={transactions}
            getTransactions={getTransactions}
            transactionId={transactionId}
            toggleLoading={toggleLoading}
            handleEditMode={handleEditMode}
            open={isOpen}
            onClose={closeModal}
          />
        )}
      </Container>
    </PrivateLayout>
  );
};

export default Home;
