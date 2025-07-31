import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 如果你想在构建时忽略 ESLint 错误，可以设置为 true
    // ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "your-strapi-domain.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
