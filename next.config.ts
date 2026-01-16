import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: [
      "i.imgur.com",
      "dynamic-assets.coinbase.com",
      "asset-metadata-service-production.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
