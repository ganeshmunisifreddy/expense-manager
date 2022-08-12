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
import { Text, Container, Button, Card } from "@nextui-org/react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

import { db, auth } from "../firebase/config";
import AddTransaction from "../components/Transactions/AddTransaction";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../context/AuthContext";

import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Transactions from "../components/Transactions";

const txnCollectionRef = collection(db, "expenses");

const Home: NextPage = () => {
  const [transactions, setTransactions] = useState<any>([]);
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { currentUser }: any = useAuth();

  const userId: string = currentUser.uid || "";

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

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (e: any) {
      console.error(e);
    }
  };

  const openModal = () => setIsOpen(true);

  const closeModal = (isFetch: boolean) => {
    if (isFetch) {
      getTransactions();
    }
    setIsOpen(false);
  };

  const getTransactions = useCallback(async () => {
    console.log("called getTransactions");
    setIsLoading(true);
    const q = query(
      txnCollectionRef,
      orderBy("date", "asc"),
      // where("date", ">=", "2022-08-01"),
      // where("date", "<=", "2022-08-31"),
      where("createdBy", "==", userId),
      limit(10),
    );
    const data = await getDocs(q);
    const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) || [];
    setTransactions(transactions);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getTransactions();
    } else {
      router.push("/login");
    }
  }, [userId, router, getTransactions]);

  return (
    <Container className={styles.container}>
      <Head>
        <title>Expense Manager</title>
        <meta name="description" content="Expense Manager - Nine Technology" />
      </Head>

      {isLoading && <Loader fullScreen />}

      <Header logout={logout} />

      <main className={styles.main}>
        <div className={styles.cards}>
          <Card className={styles.myExpenses}>
            <UserIcon height={32} color="#212b36" />
            <Text>My Expenses</Text>
          </Card>
          <Card className={styles.homeExpenses}>
            <HomeIcon height={32} color="#212b36" />
            <Text>Home Expenses</Text>
          </Card>
        </div>
        <div className="flex justify-center">
          <Button size="sm" css={{ width: "100%" }} onClick={openModal}>
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
          setTransactions={setTransactions}
          transactionId={transactionId}
          toggleLoading={toggleLoading}
          handleEditMode={handleEditMode}
          open={isOpen}
          onClose={closeModal}
        />
      )}
    </Container>
  );
};

export default Home;
