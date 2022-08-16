import React from "react";
import { useEffect, useState } from "react";
import { Button, Typography, TextField, Card } from "@mui/material";
import { NextPage } from "next";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import styles from "../styles/Profile.module.scss";
import PrivateLayout from "../layouts/PrivateLayout";
import Loader from "../components/Loader/Loader";

const Profile: NextPage = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [errMsg, setErrMsg] = useState<string>("");

  const { currentUser }: any = useAuth();

  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile(currentUser, {
        displayName,
      });
      setIsLoading(false);
    } catch (e: any) {
      console.log(e.message);
      setIsLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className={styles.root}>
        <Card className={styles.profileCard}>
          <Typography>Update Profile</Typography>
          <TextField
            size="small"
            label="Display Name"
            type="text"
            placeholder="Enter Display Name"
            name="displayName"
            value={displayName}
            onChange={(e: any) => setDisplayName(e.target.value)}
            fullWidth
            disabled={isLoading}
          />
          <Button variant="contained" onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? <Loader size={20} /> : "Update"}
          </Button>
        </Card>

        <Link href={"/"} passHref>
          <Button className={styles.homeBtn}>Go Home</Button>
        </Link>
      </div>
    </PrivateLayout>
  );
};

export default Profile;
