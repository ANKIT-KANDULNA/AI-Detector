/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js to allow images from any domain.
  // You'd lock this down in production.
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig
