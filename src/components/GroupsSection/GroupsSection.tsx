import React, { useState } from "react";
import { Typography, Card, Button } from "@mui/material";
import { PlusIcon } from "@heroicons/react/outline";
import styles from "./Groups.module.scss";
import AddGroup from "./AddGroup";
import Loader from "../Loader";

const GroupsSection = (props: any) => {
  console.log(props);
  const { getTransactions } = props;
  const groups = [
    "Home",
    "Kerala Trip",
    "Pondicherry Trip",
    "Home",
    "Kerala Trip",
    "Pondicherry Trip",
  ];
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleLoading = (value: boolean) => setIsLoading(value);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEditMode = (id: string) => {
    setTransactionId(id);
    setIsOpen(true);
  };

  return (
    <>
      {isLoading && <Loader fullScreen />}
      <div className={styles.groupsSection}>
        <div className="flex items-center justify-between">
          <Typography variant="h6">Groups</Typography>
          <Button startIcon={<PlusIcon height={16} color="#7635dc" />} onClick={openModal}>
            Add Group
          </Button>
        </div>
        <div className={styles.groupCardsSection}>
          {groups.map((group: any, index: number) => (
            <Card className={styles.groupCard} key={group + "-" + index}>
              {group}
            </Card>
          ))}
        </div>
      </div>
      <AddGroup
        groups={groups}
        getTransactions={getTransactions}
        transactionId={transactionId}
        toggleLoading={toggleLoading}
        handleEditMode={handleEditMode}
        open={isOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default GroupsSection;
