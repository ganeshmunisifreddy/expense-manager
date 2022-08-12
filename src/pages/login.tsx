import React, { useEffect, useState } from "react";
import { Card, InputAdornment, TextField, Typography, Button } from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";

import { auth } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/Login.module.scss";

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

  const { currentUser } = useAuth();

  const generateRecaptcha = async () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.recaptcha.reset(window.recaptchaWidgetId);
      return;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("captcha solved");
        },
        errorCallback: (response: any) => {
          console.log(response);
        },
      },
      auth,
    );
    window.recaptchaWidgetId = await window.recaptchaVerifier.render();
  };

  const getOtp = () => {
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
      .catch((error) => {
        console.log("Error Message####", error.message);
        setIsLoading(false);
        setErrMsg(error.message);
      });
  };

  const verifyOtp = () => {
    setErrMsg("");
    setIsLoading(true);
    if (otp.length !== 6) {
      return setErrMsg("Please enter valid OTP");
    }
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then((result: any) => {
        setIsLoading(false);
        console.log(result);
        //const user = result.user;
        router.push("/");
      })
      .catch((error: any) => {
        setIsLoading(false);
        setErrMsg(error.message);
        console.log("Error Message####", error.message);
      });
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <Typography variant="h6" className={styles.title}>
            Login
          </Typography>
          <div className={styles.inputField}>
            <TextField
              type="text"
              label="Phone Number"
              placeholder="98765 43210"
              value={phone}
              fullWidth
              onChange={(e: any) => setPhone(e.target.value)}
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
              <Button variant="contained" className={styles.submitBtn} onClick={verifyOtp}>
                {isLoading ? <Loader size={20} /> : "Verify"}
              </Button>
            ) : (
              <Button
                variant="contained"
                className={styles.submitBtn}
                onClick={getOtp}
                disabled={isLoading}>
                {isLoading ? <Loader size={20} /> : "Login"}
              </Button>
            )}
          </div>
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
