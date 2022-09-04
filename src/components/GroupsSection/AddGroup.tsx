import React, { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  Avatar,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import styles from "./GroupsSection.module.scss";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { AccountSearch } from "mdi-material-ui";
import Loader from "../Loader";
import { stringAvatar } from "../../utils/common";

const initialGroup = Object.freeze({
  name: "",
  users: {},
  active: true,
});

const userCollectionRef = collection(db, "users");

const AddGroup = (props: any) => {
  const { open, onClose, onSave, activeGroup } = props;

  const { user }: any = useAuth();

  const { uid = "", displayName = "", phoneNumber = "" } = user || {};
  const { id: activeGroupId = "" } = activeGroup || {};

  const [newGroup, setNewGroup] = useState<any>({ ...initialGroup });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneNumberText, setPhoneNumberText] = useState("");

  const handleNameChange = (e: any) => {
    const { name, value } = e.target;
    const obj = {
      ...newGroup,
      [name]: value,
    };
    setNewGroup(obj);
  };

  const getUser = async () => {
    const withCountryCode = "+91" + phoneNumberText;
    if (!phoneNumberText || withCountryCode === phoneNumber.toString()) {
      setPhoneNumberText("");
      return;
    }
    setIsLoading(true);
    try {
      const q = query(userCollectionRef, where("phoneNumber", "==", withCountryCode));
      const data = await getDocs(q);
      setIsLoading(false);
      if (!data.docs.length) {
        return alert("User does not exist. Please check phone number.");
      }
      setPhoneNumberText("");
      const user = {
        id: data.docs[0].id,
        ...data.docs[0].data(),
      };
      const groupObj = {
        ...newGroup,
        users: { ...newGroup.users },
      };
      if (!groupObj.users[uid]) {
        groupObj.users[uid] = { id: uid, displayName, phoneNumber };
      }
      if (groupObj.users[user.id]) {
        return alert("User already added to the group.");
      }
      groupObj.users[user.id] = user;
      setNewGroup(groupObj);
    } catch (e: any) {
      console.error(e.message);
      setIsLoading(false);
    }
  };

  const deleteUser = (id: string) => {
    const group = {
      ...newGroup,
    };
    if (group.users[id]) {
      delete group.users[id];
    }
    if (Object.keys(group.users).length < 2) {
      group.users = {};
    }
    setNewGroup(group);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (Object.keys(newGroup.users).length < 2) {
      return alert("Please add at least one user.");
    }
    onSave(newGroup);
  };

  const handleClose = () => {
    setNewGroup(initialGroup);
    onClose();
  };

  useEffect(() => {
    if (activeGroup.id) {
      setNewGroup(activeGroup);
    }
  }, [activeGroup]);

  return (
    <Dialog open={open}>
      <form onSubmit={onSubmit}>
        <DialogTitle align="center">
          <Typography>{activeGroupId ? "View" : "Add"} Group</Typography>
        </DialogTitle>
        <DialogContent>
          <div className={styles.formFields}>
            <div className={styles.field}>
              <TextField
                size="small"
                label="Name"
                type="text"
                placeholder="Enter group name"
                name="name"
                value={newGroup.name}
                onChange={handleNameChange}
                fullWidth
                required
                autoComplete="off"
                disabled={Boolean(activeGroupId)}
              />
            </div>
            {!activeGroupId && (
              <div className={styles.field}>
                <TextField
                  size="small"
                  label="Search User"
                  type="number"
                  placeholder="Enter user phone number"
                  name="searchUser"
                  value={phoneNumberText}
                  onChange={(e: any) => setPhoneNumberText(e.target.value)}
                  fullWidth
                  disabled={isLoading}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={getUser}>
                          <AccountSearch
                            sx={{
                              color: "#7635dc",
                              width: 20,
                              height: 20,
                            }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}
            {isLoading && (
              <div style={{ margin: 16, textAlign: "center" }}>
                <Loader size={20} />
              </div>
            )}
            {Object.values(newGroup.users)?.length > 0 && (
              <>
                <Typography variant="subtitle1" className={styles.usersTitle}>
                  Group Members
                </Typography>
                <div className={styles.users}>
                  {Object.values(newGroup.users).map((user: any) => (
                    <Card className={styles.user} key={user.id}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {stringAvatar(user.displayName)}
                      </Avatar>
                      <div className={styles.userInfo}>
                        <Typography>{user.displayName}</Typography>
                        <Typography variant="body2" color="primary">
                          {user.phoneNumber}
                        </Typography>
                      </div>
                      {user.id !== uid && !activeGroupId && (
                        <IconButton
                          className={styles.removeBtn}
                          onClick={() => deleteUser(user.id)}>
                          {/* <XIcon height={16} color="#ff0000" /> */}
                        </IconButton>
                      )}
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            {activeGroupId ? "Close" : "Cancel"}
          </Button>
          {!activeGroupId && (
            <Button variant="contained" type="submit">
              {newGroup.id ? "Update" : "Save"}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddGroup;
