import type { NextConfig } from "next";

// Extract hostname from API URL for image configuration
const getApiHostname = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.newfiremedia.org/api/v1';
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return 'api.newfiremedia.org'; // fallback
  }
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/men/**",
      },
      {
        protocol: "https",
        hostname: getApiHostname(),
      },
      // Allow localhost for development (Rails Active Storage)
      {
        protocol: "http",
        hostname: "localhost",
        port: "6070",
      },
    ],
  },
};

export default nextConfig;
