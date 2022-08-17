import type { NextPage } from "next";
import Head from "next/head";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Container, MenuItem, Select, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { db } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/MyExpenses.module.scss";
import Transactions from "../components/Transactions";
import PrivateLayout from "../layouts/PrivateLayout";
import {
  startOfMonth,
  endOfMonth,
  format,
  eachMonthOfInterval,
  endOfYear,
  startOfYear,
} from "date-fns";

const txnCollectionRef = collection(db, "expenses");

const MyExpenses: NextPage = () => {
  const [transactions, setTransactions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<any>({
    fromDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    toDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    month: format(new Date(), "MMMM"),
  });

  const { currentUser }: any = useAuth();

  const userId: string = currentUser?.uid || "";

  const router = useRouter();

  const selectData = useMemo(() => {
    return eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    }).reduce((acc: any, item: any) => {
      const month = format(item, "MMMM");
      return {
        ...acc,
        [month]: {
          fromDate: format(startOfMonth(item), "yyyy-MM-dd"),
          toDate: format(endOfMonth(item), "yyyy-MM-dd"),
          month: format(item, "MMMM"),
        },
      };
    }, {});
  }, []);

  const handleMonthChange = (e: any) => {
    const value = e.target.value;
    setDateFilter(selectData[value]);
  };

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    const q = query(
      txnCollectionRef,
      orderBy("date", "desc"),
      orderBy("time", "desc"),
      where("date", ">=", dateFilter.fromDate),
      where("date", "<=", dateFilter.toDate),
      where("createdBy", "==", userId),
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
  }, [userId, dateFilter]);

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
          <title>Expense Manager | My Expenses</title>
        </Head>

        {isLoading && <Loader fullScreen />}

        <main className={styles.main}>
          <div className={styles.filterSection}>
            <Typography variant="h6">Transactions</Typography>
            <Select value={dateFilter.month} onChange={handleMonthChange} size="small">
              {Object.values(selectData).map((item: any) => (
                <MenuItem key={item.month} value={item.month}>
                  {item.month}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Transactions data={transactions} getTransactions={getTransactions} />
        </main>
      </Container>
    </PrivateLayout>
  );
};

export default MyExpenses;
