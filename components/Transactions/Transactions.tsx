import React from "react";
import { Text, Dropdown, Card } from "@nextui-org/react";
import { format } from "date-fns";
import { CreditCardIcon, DotsVerticalIcon } from "@heroicons/react/outline";

import styles from "./Transactions.module.css";
import { convertTimeToMeridiem } from "../../utils/common";

let RupeeIndian = Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

let formatDateText = (date: string, time: string) => {
  if (new Date(date).toLocaleDateString() === new Date().toLocaleDateString()) {
    return "Today, " + convertTimeToMeridiem(time);
  }
  return format(new Date(date), "dd MMM");
};

const Transactions = (props: any) => {
  const { data = [], handleEditMode, handleDelete } = props;

  const handleAction = (key: string, id: string) => {
    switch (key) {
      case "edit":
        return handleEditMode(id);
      case "delete":
        return handleDelete(id);
      default:
        break;
    }
  };

  return (
    <div className={styles.root}>
      <Text h5>Transactions</Text>
      <div className={styles.transactions}>
        {data?.length > 0 && (
          <div>
            {data.map((txn: any, index: number) => (
              <Card key={txn.id + "-" + index} className={styles.transaction}>
                <div style={{ flex: 5 }}>
                  <Text b>{txn.description}</Text>
                  <Text className={styles.account}>
                    <CreditCardIcon height={16} color="#0272F5" className={styles.accountIcon} />
                    {txn.account}
                  </Text>
                </div>
                <div style={{ flex: 5 }} className="text-right">
                  <Text className={styles.date}>{formatDateText(txn.date, txn.time)}</Text>
                  <Text b color="primary">
                    {RupeeIndian.format(txn.amount)}
                  </Text>
                </div>
                <div style={{ flex: 1, textAlign: "right", cursor: "pointer" }}>
                  <Dropdown>
                    <Dropdown.Trigger>
                      <DotsVerticalIcon
                        height={16}
                        color="#0272F5"
                        className={styles.accountIcon}
                      />
                    </Dropdown.Trigger>
                    <Dropdown.Menu onAction={(key: any) => handleAction(key, txn.id)}>
                      <Dropdown.Item key="edit">Edit</Dropdown.Item>
                      <Dropdown.Item key="delete" withDivider color="error">
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card>
            ))}
          </div>
        )}
        {data?.length === 0 && (
          <Text h4 css={{ textAlign: "center" }}>
            No Transactions
          </Text>
        )}
      </div>
      {/* <Button size="sm">Add Expense</Button> */}
    </div>
  );
};

export default Transactions;
