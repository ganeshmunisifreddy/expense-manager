import React, { useEffect, useState } from "react";
import { Card, InputAdornment, TextField, Typography, Button } from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";

import { auth } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/Login.module.scss";
import Backgrounds from "../components/Backgrounds";
import Head from "next/head";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaWidgetId: any;
  }
}

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const router = useRouter();

  const { user, isUserLoading } = useAuth();

  const generateRecaptcha = async () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.recaptcha.reset(window.recaptchaWidgetId);
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        //callback
      },
      errorCallback: (response: any) => {
        console.error(response);
      },
    });
    window.recaptchaWidgetId = await window.recaptchaVerifier.render();
  };

  const getOtp = (e: any) => {
    e.preventDefault();
    if (phone.length !== 10) {
      return alert("Please enter valid phone number");
    }
    setErrMsg("");
    setIsLoading(true);
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, "+91" + phone, appVerifier)
      .then((confirmationResult) => {
        setIsOtpSent(true);
        setIsLoading(false);
        window.confirmationResult = confirmationResult;
      })
      .catch((e: any) => {
        console.error(e.message);
        setIsLoading(false);
        setErrMsg(e.message);
      });
  };

  const verifyOtp = (e: any) => {
    e.preventDefault();
    setErrMsg("");
    setIsLoading(true);
    if (otp.length !== 6) {
      return setErrMsg("Please enter valid OTP");
    }
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then(() => {
        setIsLoading(false);
        router.replace("/expenses");
      })
      .catch((e: any) => {
        setIsLoading(false);
        setErrMsg(e.message);
        console.error(e.message);
      });
  };

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/expenses");
    }
  }, [user, router, isUserLoading]);

  if (isUserLoading || (!isUserLoading && !!user)) {
    return <Loader fullScreen />;
  }

  return (
    <div className={styles.root}>
      <Head>
        <title>Login - Expense Manager</title>
      </Head>
      <Backgrounds text="Welcome" />
      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <Typography variant="h6" className={styles.title}>
            Login
          </Typography>
          <form onSubmit={isOtpSent ? verifyOtp : getOtp}>
            <div className={styles.inputField}>
              <TextField
                type="text"
                label="Phone Number"
                placeholder="9876543210"
                value={phone}
                fullWidth
                onChange={(e: any) => {
                  const value = e.target.value;
                  if (value.length > 10) return;
                  setPhone(value);
                }}
                required
                disabled={isOtpSent || isLoading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
              />
            </div>
            {isOtpSent && (
              <div className={styles.inputField}>
                <TextField
                  type="number"
                  label="OTP"
                  placeholder="Enter OTP"
                  value={otp}
                  fullWidth
                  onChange={(e: any) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}
            <div className={styles.inputField}>
              {isOtpSent ? (
                <Button
                  variant="contained"
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}>
                  {isLoading ? <Loader size={20} /> : "Verify"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}>
                  {isLoading ? <Loader size={20} /> : "Login"}
                </Button>
              )}
            </div>
          </form>
        </Card>
        {errMsg && (
          <Typography color="error" className={styles.errorMessage}>
            {errMsg}
          </Typography>
        )}
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
