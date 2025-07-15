import type { NextConfig } from "next";

const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT || 'gramii';
const distDir = `.next-${siteVariant}`;

const nextConfig: NextConfig = {
  distDir: distDir,
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
