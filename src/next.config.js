/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  server: {
    hostname: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000,
  },
};

module.exports = nextConfig;
