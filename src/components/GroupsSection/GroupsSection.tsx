import React, { useState } from "react";
import { Typography, Card, Button, Menu, MenuItem, IconButton } from "@mui/material";
import styles from "./GroupsSection.module.scss";
import AddGroup from "./AddGroup";
import Iconify from "../Iconify";

const GroupsSection = (props: any) => {
  const { groups = [], handleSave, selectedGroup, handleSelectedGroup, handleDelete } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<any>({});

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setActiveGroup({});
  };

  const onSave = (group: any) => {
    handleSave(group, closeModal);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, group: any) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveGroup(group);
  };

  const handleAction = (key: string) => {
    handleClose();
    switch (key) {
      case "view":
        return setIsOpen(true);
      case "delete":
        return handleDelete(activeGroup.id);
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
          <Button
            variant="contained"
            startIcon={<Iconify icon="icon-park-outline:add" width={20} />}
            onClick={openModal}>
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
                  <IconButton onClick={(e: any) => handleClick(e, group)} style={{ marginLeft: 8 }}>
                    <Iconify icon="mdi:dots-vertical" width={20} />
                  </IconButton>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            No Groups
          </Typography>
        )}
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleAction("view")}>View</MenuItem>
        <MenuItem onClick={() => handleAction("delete")}>Delete</MenuItem>
      </Menu>
      {isOpen && (
        <AddGroup activeGroup={activeGroup} onSave={onSave} open={isOpen} onClose={closeModal} />
      )}
    </>
  );
};

export default GroupsSection;
