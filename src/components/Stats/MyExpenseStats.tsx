import React, { useEffect, useState } from "react";
import { Typography, Card } from "@mui/material";
import styles from "./Stats.module.scss";
import { ConvertToCurrency } from "../../utils/common";

const MyExpenseStats = (props: any) => {
  const { transactions = [], month } = props;

  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const total = transactions.reduce((acc: number, txn: any) => {
      return (acc += parseFloat(txn.amount));
    }, 0);
    setStats({ total });
  }, [transactions]);

  return (
    <Card className={styles.statsCard}>
      <div className={styles.totalStats}>
        <Typography>{month} Expenses</Typography>
        <Typography>{ConvertToCurrency(stats.total)}</Typography>
      </div>
    </Card>
  );
};

export default MyExpenseStats;
