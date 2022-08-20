import React, { useState } from "react";
import { Typography, Card, Button, Menu, MenuItem, IconButton } from "@mui/material";
import { PlusIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import styles from "./GroupsSection.module.scss";
import AddGroup from "./AddGroup";

const GroupsSection = (props: any) => {
  const { groups = [], handleSave, selectedGroup, handleSelectedGroup, handleDelete } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState("");

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSave = (group: any) => {
    handleSave(group, closeModal);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, groupId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveGroup(groupId);
  };

  const handleAction = (key: string) => {
    handleClose();
    switch (key) {
      case "delete":
        return handleDelete(activeGroup);
      default:
        break;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                <div className={styles.groupInfo}>
                  <Typography>{group.name}</Typography>
                  <IconButton
                    onClick={(e: any) => handleClick(e, group.id)}
                    style={{ marginLeft: 8 }}>
                    <DotsVerticalIcon height={16} color="#7635dc" />
                  </IconButton>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Typography variant="body1" align="center">
            No Groups
          </Typography>
        )}
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleAction("delete")}>Delete</MenuItem>
      </Menu>
      {isOpen && <AddGroup onSave={onSave} open={isOpen} onClose={closeModal} />}
    </>
  );
};

export default GroupsSection;
