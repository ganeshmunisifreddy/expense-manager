import React, { useEffect, useState } from "react";
import { Card, Input, Text, Button } from "@nextui-org/react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";

import { auth } from "../firebase/config";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../context/AuthContext";

import styles from "../styles/Login.module.css";

type Props = {};

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaWidgetId: any;
  }
}

const Login = (props: Props) => {
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
        callback: (response: any) => {
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
    let appVerifier = window.recaptchaVerifier;
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
    if (otp.length !== 6) {
      return setErrMsg("Please enter valid OTP");
    }
    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then((result: any) => {
        console.log(result);
        //const user = result.user;
        router.push("/");
      })
      .catch((error: any) => {
        setErrMsg(error.message);
        console.log("Error Message####", error.message);
      });
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <Text h4 className={styles.title}>
            Login
          </Text>
          <div className={styles.inputField}>
            <Input
              bordered
              type="text"
              labelLeft="+91"
              label="Phone Number"
              placeholder="98765 43210"
              value={phone}
              fullWidth
              onChange={(e: any) => setPhone(e.target.value)}
              required
              disabled={isOtpSent || isLoading}
            />
          </div>
          {isOtpSent && (
            <div className={styles.inputField}>
              <Input
                type="number"
                label="OTP"
                placeholder="Enter OTP"
                value={otp}
                fullWidth
                onChange={(e: any) => setOtp(e.target.value)}
              />
            </div>
          )}
          <div className={styles.inputField}>
            {isOtpSent ? (
              <Button className={styles.submitBtn} onClick={verifyOtp}>
                Verify
              </Button>
            ) : (
              <Button className={styles.submitBtn} onClick={getOtp} disabled={isLoading}>
                {isLoading ? <Loader size="sm" /> : "Login"}
              </Button>
            )}
          </div>
        </Card>
        {errMsg && (
          <Text color="error" className={styles.errorMessage}>
            {errMsg}
          </Text>
        )}
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
