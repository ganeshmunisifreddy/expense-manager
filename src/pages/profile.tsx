import React from "react";
import { useEffect, useState } from "react";
import { Button, Typography, TextField, Card, Avatar } from "@mui/material";
import { NextPage } from "next";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";

import styles from "../styles/Profile.module.scss";
import PrivateLayout from "../layouts/PrivateLayout";
import Loader from "../components/Loader/Loader";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { stringAvatar } from "../utils/common";
import AuthGuard from "../guards/AuthGuard";

const Profile: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const { user, logout }: any = useAuth();
  const router = useRouter();

  const { uid = "", phoneNumber, displayName = "" } = user || {};

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (displayName) {
      setName(displayName);
    }
  }, [displayName]);

  const handleUpdate = async () => {
    if (name.trim().length < 3) {
      return setErrMsg("Display Name must contain at least 3 characters");
    }
    setIsLoading(true);
    setErrMsg("");
    try {
      await updateProfile(user, {
        displayName: name,
      });
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        displayName: name,
        phoneNumber,
      });
      setIsLoading(false);
    } catch (e: any) {
      console.error(e.message);
      setErrMsg(e.message);
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setName(e.target.value);
    setErrMsg("");
  };

  return (
    <AuthGuard>
      <PrivateLayout>
        <div className={styles.root}>
          <Card className={styles.profileCard}>
            <Avatar sx={{ width: 72, height: 72, background: "#7635dc" }}>
              {stringAvatar(displayName)}
            </Avatar>
            <Typography>{phoneNumber}</Typography>
            <TextField
              size="small"
              label="Display Name"
              type="text"
              placeholder="Enter Display Name"
              name="displayName"
              value={name}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              error={Boolean(errMsg)}
            />
            <Button variant="contained" onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? <Loader size={20} /> : "Update"}
            </Button>
          </Card>

          <Button className={styles.homeBtn} onClick={handleLogout}>
            Logout
          </Button>

          {errMsg && <Typography className={styles.errorMessage}>{errMsg}</Typography>}
        </div>
      </PrivateLayout>
    </AuthGuard>
  );
};

export default Profile;
