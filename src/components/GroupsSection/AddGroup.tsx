import React from "react";
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
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import Loader from "../Loader";
import { stringAvatar } from "../../utils/common";

const initialGroup = {
  name: "",
  users: {},
};

const userCollectionRef = collection(db, "users");

const AddGroup = (props: any) => {
  const { open, onClose, onSave } = props;

  const { currentUser }: any = useAuth();

  const { uid = "", displayName = "", phoneNumber = "" } = currentUser || {};

  const [newGroup, setNewGroup] = useState<any>(initialGroup);
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
      console.log(e.message);
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
    if (newGroup.users.length < 2) {
      return alert("Please add at least one user.");
    }
    onSave(newGroup);
  };

  return (
    <Dialog open={open}>
      <form onSubmit={onSubmit}>
        <DialogTitle align="center">
          <Typography>Add Group</Typography>
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
              />
            </div>
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={getUser}>
                        <SearchIcon height={16} color="#333" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
                        {user.id !== uid && (
                          <IconButton
                            className={styles.removeBtn}
                            onClick={() => deleteUser(user.id)}>
                            <XIcon height={16} color="#ff0000" />
                          </IconButton>
                        )}
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {newGroup.id ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddGroup;
