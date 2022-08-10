const withPWA = require("next-pwa");

const development = process.env.NODE_ENV === "development";

const nextConfig = {
  ...(development ? {} : {
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development",
    },
  }),
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = development ? nextConfig : withPWA(nextConfig);