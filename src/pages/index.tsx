import type { NextPage } from "next";
import Head from "next/head";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { Typography, Container, Card } from "@mui/material";
import { UserGroupIcon, UserIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { db } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/Home.module.scss";
import Transactions from "../components/Transactions";
import PrivateLayout from "../layouts/PrivateLayout";
import Link from "next/link";

const txnCollectionRef = collection(db, "expenses");

const Home: NextPage = () => {
  const [transactions, setTransactions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currentUser }: any = useAuth();

  const userId: string = currentUser?.uid || "";

  const router = useRouter();

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    const q = query(
      txnCollectionRef,
      orderBy("date", "desc"),
      orderBy("time", "desc"),
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
            <Link href="/my-expenses" passHref>
              <Card className={styles.myExpenses}>
                <UserIcon height={32} color="#212b36" />
                <Typography>My Expenses</Typography>
              </Card>
            </Link>
            <Link href="/groups" passHref>
              <Card className={styles.homeExpenses}>
                <UserGroupIcon height={32} color="#212b36" />
                <Typography>Groups</Typography>
              </Card>
            </Link>
          </div>
          <div>
            <Typography variant="subtitle1">Recent Transactions</Typography>
            <Transactions data={transactions} getTransactions={getTransactions} />
          </div>
        </main>
      </Container>
    </PrivateLayout>
  );
};

export default Home;
