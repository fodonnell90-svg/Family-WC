/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "r2.thesportsdb.com" },
      { protocol: "https", hostname: "**.thesportsdb.com" },
    ],
  },
  outputFileTracingIncludes: {
    "/": ["./data/**/*"],
    "/api/standings": ["./data/**/*"],
  },
};

module.exports = nextConfig;

