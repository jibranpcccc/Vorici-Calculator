/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['web.poecdn.com'],
  },
  // Enable static export for GitHub Pages
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Disable the default Next.js image optimization API
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
