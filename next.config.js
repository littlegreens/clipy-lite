/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Ottimizzazioni per performance
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
