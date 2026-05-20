import type { NextConfig } from "next";

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
        destination: "http://localhost:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;
