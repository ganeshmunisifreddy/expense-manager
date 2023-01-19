import type { NextPage } from "next";
import Head from "next/head";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Container, MenuItem, Select, Typography, Card } from "@mui/material";
import { useRouter } from "next/router";

import { db } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/Groups.module.scss";
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
import GroupsSection from "../components/GroupsSection";
import { ConvertToCurrency } from "../utils/common";

const txnCollectionRef = collection(db, "expenses");
const groupCollectionRef = collection(db, "groups");

const Groups: NextPage = () => {
  const [groups, setGroups] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<any>({
    fromDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    toDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    month: format(new Date(), "MMMM"),
  });
  const [stats, setStats] = useState<any>({});

  const { user }: any = useAuth();

  const { uid = "" } = user;

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

  const handleSelectedGroup = (group: any) => {
    setSelectedGroup(group);
    setTransactions([]);
  };

  const getGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(groupCollectionRef, where(`users.${uid}.id`, "==", uid));
      const data = await getDocs(q);
      const groupsData =
        data.docs
          .map((doc) => {
            const newItem: any = { ...doc.data(), id: doc.id };
            return newItem;
          })
          .filter((item: any) => item.active) || [];
      setGroups(groupsData);
      if (groupsData.length) {
        setSelectedGroup(groupsData[0]);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  const handleSave = async (newGroup: any, closeModal: any) => {
    setIsLoading(true);
    try {
      const newGroupDoc = {
        ...newGroup,
        createdBy: user?.uid || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const savedGroup = await addDoc(groupCollectionRef, newGroupDoc);
      const savedDoc = { ...newGroupDoc, id: savedGroup.id };
      const groupsData = [...groups];
      groupsData.push(savedDoc);
      setGroups(groupsData);
      setSelectedGroup(savedDoc);
      closeModal();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (groupId: string) => {
    const isConfirm = confirm(
      "Are you sure, you want to delete?\nDeleting Group won't delete group transactions.",
    );
    if (!isConfirm) return;
    setIsLoading(true);
    try {
      const docRef = doc(db, "groups", groupId);
      const updatedTxn = {
        active: false,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(docRef, updatedTxn);
      getGroups();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupTransactions = useCallback(async () => {
    if (!selectedGroup.id) {
      return;
    }
    setIsLoading(true);
    try {
      const q = query(
        txnCollectionRef,
        orderBy("date", "desc"),
        orderBy("time", "desc"),
        where("date", ">=", dateFilter.fromDate),
        where("date", "<=", dateFilter.toDate),
        where("groupId", "==", selectedGroup.id),
      );
      const data = await getDocs(q);
      const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) || [];
      setTransactions(transactions);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, selectedGroup]);

  useEffect(() => {
    getGroupTransactions();
  }, [getGroupTransactions]);

  useEffect(() => {
    if (uid) {
      getGroups();
    } else {
      router.replace("/login");
    }
  }, [uid, router, getGroups]);

  useEffect(() => {
    const statsMap: any = {};
    if (selectedGroup?.users) {
      Object.values(selectedGroup?.users).forEach((user: any) => {
        statsMap[user.id] = {
          id: user.id,
          name: user.displayName,
          total: 0,
        };
      });
      console.log(statsMap, transactions);
      if (transactions?.length) {
        transactions.forEach((txn: any) => {
          statsMap[txn.createdBy].total += parseFloat(txn.amount);
        });
      }
      const groupTotal = Object.values(statsMap).reduce((acc: number, item: any) => {
        return (acc += item.total);
      }, 0);
      setStats({ groupTotal, userStats: statsMap });
    }
  }, [transactions, selectedGroup]);

  return (
    <PrivateLayout>
      <Container className={styles.container}>
        <Head>
          <title>Groups | Expense Manager</title>
        </Head>

        {isLoading && <Loader fullScreen />}

        <main className={styles.main}>
          <GroupsSection
            groups={groups}
            handleSave={handleSave}
            selectedGroup={selectedGroup}
            handleSelectedGroup={handleSelectedGroup}
            handleDelete={handleDelete}
          />
          {selectedGroup && (
            <Card className={styles.statsCard}>
              {stats.userStats &&
                Object.values(stats.userStats).map((user: any) => (
                  <div className={styles.userStats} key={user.id}>
                    <Typography>{user.name}</Typography>
                    <Typography>{ConvertToCurrency(user.total)}</Typography>
                  </div>
                ))}
              <div className={styles.totalStats}>
                <Typography>Total Group Expenses</Typography>
                <Typography>{ConvertToCurrency(stats.groupTotal)}</Typography>
              </div>
            </Card>
          )}
          {groups.length > 0 && (
            <>
              <div className={styles.filterSection}>
                <Typography variant="h6">{selectedGroup?.name}</Typography>
                <Select value={dateFilter.month} onChange={handleMonthChange} size="small">
                  {Object.values(selectData).map((item: any) => (
                    <MenuItem key={item.month} value={item.month}>
                      {item.month}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <Transactions
                data={transactions}
                getTransactions={getGroupTransactions}
                selectedGroup={selectedGroup}
              />
            </>
          )}
        </main>
      </Container>
    </PrivateLayout>
  );
};

export default Groups;
