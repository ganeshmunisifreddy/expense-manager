import React, { useState } from "react";
import { Typography, Card, Button } from "@mui/material";
import { PlusIcon } from "@heroicons/react/outline";
import styles from "./GroupsSection.module.scss";
import AddGroup from "./AddGroup";

const GroupsSection = (props: any) => {
  const { groups = [], handleSave, selectedGroup, handleSelectedGroup } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSave = (group: any) => {
    handleSave(group, closeModal);
  };

  return (
    <>
      <div className={styles.groupsSection}>
        <div className="flex items-center justify-between">
          <Typography variant="h6">Groups</Typography>
          <Button startIcon={<PlusIcon height={16} color="#7635dc" />} onClick={openModal}>
            Add Group
          </Button>
        </div>
        {groups?.length > 0 ? (
          <div className={styles.groupCardsSection}>
            {groups.map((group: any) => (
              <Card
                className={
                  styles.groupCard +
                  (selectedGroup.id === group.id ? " " + styles.selectedGroup : "")
                }
                key={group.id}
                onClick={() => handleSelectedGroup(group)}>
                {group.name}
              </Card>
            ))}
          </div>
        ) : (
          <Typography variant="body1" align="center">
            No Groups
          </Typography>
        )}
      </div>
      {isOpen && <AddGroup onSave={onSave} open={isOpen} onClose={closeModal} />}
    </>
  );
};

export default GroupsSection;
