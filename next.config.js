/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["edit.org", "firebasestorage.googleapis.com", "i.imgur.com"],
  },
};

module.exports = nextConfig;
