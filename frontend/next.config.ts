import type { NextConfig } from "next";

const apiBaseUrl = (
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8081"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    root: ".",
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
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
