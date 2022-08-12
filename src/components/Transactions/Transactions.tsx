import React from "react";
import { Typography, IconButton, Card, Menu, MenuItem } from "@mui/material";
import { format } from "date-fns";
import { CreditCardIcon, DotsVerticalIcon } from "@heroicons/react/outline";

import styles from "./Transactions.module.scss";
import { convertTimeToMeridiem } from "../../utils/common";

const RupeeIndian = Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const formatDateText = (date: string, time: string) => {
  if (new Date(date).toLocaleDateString() === new Date().toLocaleDateString()) {
    return "Today, " + convertTimeToMeridiem(time);
  }
  return format(new Date(date), "dd MMM");
};

const Transactions = (props: any) => {
  const { data = [], handleEditMode, handleDelete } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (key: string, id: string) => {
    handleClose();
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
      <Typography variant="h6">Transactions</Typography>
      <div className={styles.transactions}>
        {data?.length > 0 && (
          <div>
            {data.map((txn: any, index: number) => (
              <Card key={txn.id + "-" + index} className={styles.transaction}>
                <div style={{ flex: 6, overflow: "hidden" }}>
                  <Typography className={styles.description}>{txn.description}</Typography>
                  <Typography className={styles.account}>
                    <CreditCardIcon height={16} color="#0272F5" className={styles.accountIcon} />
                    {txn.account}
                  </Typography>
                </div>
                <div style={{ flex: 3 }} className="text-right">
                  <Typography className={styles.date}>
                    {formatDateText(txn.date, txn.time)}
                  </Typography>
                  <Typography color="primary">{RupeeIndian.format(txn.amount)}</Typography>
                </div>
                <div style={{ flex: 1, textAlign: "right", cursor: "pointer" }}>
                  <IconButton onClick={handleClick} style={{ marginLeft: 8 }}>
                    <DotsVerticalIcon height={16} color="#0272F5" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}>
                    <MenuItem onClick={() => handleAction("edit", txn.id)}>Edit</MenuItem>
                    <MenuItem onClick={() => handleAction("delete", txn.id)} color="error">
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </Card>
            ))}
          </div>
        )}

        {data?.length === 0 && (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            No Transactions
          </Typography>
        )}
      </div>
      {/* <Button size="sm">Add Expense</Button> */}
    </div>
  );
};

export default Transactions;
