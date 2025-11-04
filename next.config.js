/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Increase body size limit for video uploads (2GB max per PRD)
  experimental: {
    serverActions: {
      bodySizeLimit: '2gb',
    },
  },
}

module.exports = nextConfig

