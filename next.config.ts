/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Disable source maps in production to avoid warnings
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
