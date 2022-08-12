/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa");

const nextConfig = {
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withPWA(nextConfig);