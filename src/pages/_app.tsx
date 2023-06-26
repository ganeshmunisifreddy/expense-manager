import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../mui/createEmotionCache";
import { AuthProvider } from "../contexts/AuthContext";
import theme from "../mui/theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline enableColorScheme />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Component {...pageProps} />
          </LocalizationProvider>
        </ThemeProvider>
      </AuthProvider>
    </CacheProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
