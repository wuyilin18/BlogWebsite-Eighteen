import type { NextConfig } from "next";
import webpack from "webpack";

// 提前加载 sharp 适配器（同步化处理）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharpAdapter: any;

// 初始化 sharpAdapter
(async () => {
  try {
    // 使用动态导入替代 require
    const sharpModule = await import("responsive-loader/sharp");
    sharpAdapter = sharpModule.default;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      "responsive-loader/sharp not found, falling back to default loader"
    );
  }
})();

const nextConfig: NextConfig = {
  // 禁用类型检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // 原有配置保持不变...
  images: {
    domains: ["localhost", "127.0.0.1", "你的图片cdn来源"], //<---修改这里
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 86400,
    formats: ["image/webp"],
  },

  // 修改 webpack 配置为同步
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer && sharpAdapter) {
      config.module.rules.push({
        test: /\.(png|jpg|jpeg|webp)$/i,
        use: [
          {
            loader: "responsive-loader",
            options: {
              adapter: sharpAdapter,
              sizes: [300, 600, 1200, 2000],
              placeholder: true,
              placeholderSize: 20,
              cacheDirectory: true,
              cacheIdentifier: "responsive-loader",
            },
          },
        ],
      });
    }

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    return config;
  },
};

export default nextConfig;
