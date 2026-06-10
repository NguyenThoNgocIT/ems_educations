import type { NextConfig } from "next";
import path from "path";

const apiBaseUrl = (
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8081"
).replace(/\/$/, "");
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: {
          unoptimized: true,
        },
      }
    : {}),
  /* config options here */
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  /* 3. CẤU HÌNH THỬ NGHIỆM (Nếu còn mục nào khác thì để ở đây) */
  experimental: {
    // Để trống hoặc thêm các tính năng experimental khác nếu cần
  },

  /* 4. REWRITES (Kết nối API tới backend dev ở localhost:8081) */
  async rewrites() {
    if (isStaticExport) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
