import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import dynamic from "next/dynamic";
import AuthProvider from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </NextUIProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
