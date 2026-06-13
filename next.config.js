/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "r2.thesportsdb.com" },
      { protocol: "https", hostname: "**.thesportsdb.com" },
    ],
  },
};

module.exports = nextConfig;
