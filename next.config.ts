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
      // S3 bucket used for company logo URLs
      {
        protocol: "https",
        hostname: "positive-switch-assets.s3.eu-north-1.amazonaws.com",
      },
      // Generic AWS S3 pattern (safety net)
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
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
