import type { NextPage } from "next";
import Head from "next/head";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { Container, Stack, Switch, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { db } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/MyExpenses.module.scss";
import Transactions from "../components/Transactions";
import PrivateLayout from "../layouts/PrivateLayout";
import { startOfMonth, endOfMonth, format } from "date-fns";
import MyExpenseStats from "../components/Stats/MyExpenseStats";
import AuthGuard from "../guards/AuthGuard";

const txnCollectionRef = collection(db, "expenses");

const MyExpenses: NextPage = () => {
  const [transactions, setTransactions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showGroupTxns, setShowGroupTxns] = useState<boolean>(false);
  const [dateMonth, setDateMonth] = useState<any>(startOfMonth(new Date()));

  const router = useRouter();

  const { user, isUserLoading }: any = useAuth();
  const userId: string = user?.uid || "";

  const filteredTransactions = transactions.filter((txn: any) => {
    if (!showGroupTxns) {
      return !txn.groupId;
    }
    return txn;
  });

  const handleDateChange = (value: any) => {
    setDateMonth(value);
  };

  const handleMonthChange = () => {
    setIsOpen(false);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowGroupTxns(event.target.checked);
    localStorage.setItem("showGroupTxns", JSON.stringify(event.target.checked));
  };

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    const fromDate = format(startOfMonth(new Date(dateMonth)), "yyyy-MM-dd");
    const toDate = format(endOfMonth(new Date(dateMonth)), "yyyy-MM-dd");
    const q = query(
      txnCollectionRef,
      orderBy("date", "desc"),
      orderBy("time", "desc"),
      where("date", ">=", fromDate),
      where("date", "<=", toDate),
      where("createdBy", "==", userId),
    );
    try {
      const data = await getDocs(q);
      const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) || [];
      setTransactions(transactions);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId, dateMonth]);

  useEffect(() => {
    if (userId) {
      getTransactions();
    }
  }, [userId, router, getTransactions]);

  useEffect(() => {
    const value = localStorage.getItem("showGroupTxns");
    if (value) {
      setShowGroupTxns(JSON.parse(value));
    }
  }, []);

  return (
    <AuthGuard>
      <PrivateLayout>
        <Container className={styles.container}>
          <Head>
            <title>Xpense Tracker</title>
            <meta name="description" content="Xpense Tracker - Nine Technology" />
          </Head>

          {isLoading && <Loader fullScreen />}

          <main className={styles.main}>
            <div className={styles.filterSection}>
              <Typography variant="h6">My Expenses</Typography>
              <DesktopDatePicker
                open={isOpen}
                value={dateMonth}
                format="MMM yyyy"
                views={["month", "year"]}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                onChange={handleDateChange}
                onMonthChange={handleMonthChange}
                selectedSections="month"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      maxWidth: 144,
                      input: {
                        textAlign: "center!important",
                      },
                    },
                  },
                }}
                disableFuture
              />
            </div>
            <MyExpenseStats
              transactions={filteredTransactions}
              month={format(new Date(dateMonth), "MMMM")}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography>Group Expenses</Typography>
              <Switch checked={showGroupTxns} onChange={handleToggle} />
            </Stack>
            {!isUserLoading && (
              <Transactions data={filteredTransactions} getTransactions={getTransactions} />
            )}
          </main>
        </Container>
      </PrivateLayout>
    </AuthGuard>
  );
};

export default MyExpenses;
