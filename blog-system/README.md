# "Silicon Nebula"个人博客系统 (Next.js + Strapi v5)

下面是一份详细的前后端分离个人博客系统的README文档，包含了所有关键配置项的说明。

## 项目概述

这是一个现代化的个人博客系统，采用前后端分离架构：
- **前端**：Next.js (React框架) - 部署在Vercel

- **后端**：Strapi v5 (无头CMS) - 部署在云服务器

- **搜索引擎**：Algolia

- **评论系统**：Twikoo - 部署在Vercel

  

  ### 效果图

![博客系统示例图](C:\Users\十八\AppData\Roaming\Typora\typora-user-images\image-20250731161653160.png)

## 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- PostgreSQL 12+ (推荐) 或 SQLite (开发用)
- Redis (可选，用于缓存)

## 项目结构

```bash
blog-system/
├── frontend/          # Next.js 前端应用
├── backend/           # Strapi v5 后端应用
└── README.md          # 项目文档
```

## 1. 前端配置 (Next.js)

### 安装与运行

```bash
cd frontend
npm install
# 或者 yarn install
npm run dev
```

### 环境变量配置

创建 `.env.local` 文件并配置以下变量：

```env
# 基础配置

# 本地模式
NEXT_PUBLIC_STRAPI_URL=https://你的strapi后台端口
NEXT_PUBLIC_STRAPI_API_TOKEN=你的strapi后台token秘钥

# Strapi 后端配置
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337  # 开发环境
# NEXT_PUBLIC_STRAPI_API_URL=https://your-api-domain.com # 生产环境
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token_here

# Algolia 搜索配置
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blog_posts

# Twikoo 评论系统配置
NEXT_PUBLIC_TWIKOO_URL=https://twikoo.yourdomain.com
TWIKOO_ENV_ID=your_vercel_environment_id
```

### 其他配置

修改`next.config.js`文件

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "你的图源cdn"],//<---修改这里
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true, // 禁用Next.js图片优化，直接加载原始图片
  },
};

module.exports = nextConfig;
```

修改`next.config.ts`文件

```ts
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
  // 图片cdn来源
  images: {
    domains: ["localhost", "127.0.0.1", "你的图片cdn来源"],//<---修改这里
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

```



### 关键文件位置

- Algolia 搜索配置：`frontend/lib/algolia.ts`
- Strapi API 请求：`frontend/lib/strapi.ts`
- Twikoo 组件：`frontend/components/Comments/TwikooComments.tsx`

### 部署到 Vercel

1. 将代码推送到GitHub仓库
2. 登录 [Vercel](https://vercel.com/) 并导入项目
3. 在环境变量设置中添加所有 `NEXT_PUBLIC_*` 变量
4. 部署项目

## 2. 后端配置 (Strapi v5)

### 安装与运行

```bash
cd backend
npm install
# 或者 yarn install
npm run develop
```

### 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# 应用配置
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_comma_separated
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret

# 公共 URL（重要！）
PUBLIC_URL=https://你的strapi后台访问端口

# 数据库配置
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Algolia 集成
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_admin_api_key
ALGOLIA_INDEX_NAME=blog_posts

# 其他配置
NODE_ENV=production
```

### Algolia 集成插件安装

1. 安装 Strapi Algolia 插件：
```bash
npm install strapi-plugin-algolia
```

2. 在 `backend/config/plugins.ts` 中添加配置：

```ts
export default ({ env }) => ({
  // 其他插件配置...
  // Algolia插件配置
  "strapi-algolia": {
    enabled: true,
    config: {
      apiKey: env("ALGOLIA_SEARCH_API_KEY"),
      applicationId: env("ALGOLIA_APP_ID"),
      indexPrefix: process.env.ALGOLIA_INDEX_PREFIX || "strapi",
      contentTypes: [
        {
          name: "api::post.post",
          index: "development_blog_posts", //你的algolia索引名称
          transform: (data) => {
            const baseUrl = process.env.PUBLIC_URL;
            let coverImageUrl = "";
            if (data.CoverImage?.url) {
              coverImageUrl = data.CoverImage.url.startsWith("http")
                ? data.CoverImage.url
                : `${baseUrl}${data.CoverImage.url}`;
            }

            return {
              objectID: data.id.toString(),
              title: data.Title || "",
              slug: data.Slug || "",
              summary: data.Summary || "",
              content: parseRichTextForAlgolia(data.Content), // Use the local parser
              coverImage: coverImageUrl,
              categories: data.categories?.map((cat) => cat.name) || [],
              tags: data.tags?.map((tag) => tag.name) || [],
            };
          },
          populate: {
            Content: true,
            CoverImage: true,
            categories: true,
            tags: true,
          },
        },
      ],
    },
  },
});
```

### 部署到云服务器

1. 准备云服务器（Ubuntu 20.04+ 推荐）
2. 安装 Node.js, npm, PostgreSQL
3. 配置防火墙开放1337端口
4. 使用PM2管理进程：

```bash
npm install -g pm2
pm2 start npm --name "strapi" -- run start
pm2 save
pm2 startup
```

5. 配置Nginx反向代理：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 3. Twikoo 评论系统配置

### 部署到 Vercel

1. 创建新的Vercel项目
2. 选择Twikoo模板：[https://github.com/twikoojs/twikoo](https://github.com/twikoojs/twikoo)
3. 部署时设置环境变量：

```env
# MongoDB 配置
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/twikoo?retryWrites=true&w=majority

# 管理密码
TWIKOO_ADMIN_PASS=your_admin_password
```

### 在前端集成

在评论组件`TwikooComments.tsx`中添加：

```tsx
  const initTwikoo = () => {
    if (containerRef.current && window.twikoo) {
      // console.log(`[Twikoo] Initializing for path: ${pathname}`);
      try {
        containerRef.current.innerHTML = "";

        // 在这里写你的 HTTPS 地址
        const finalEnvId = "https://你部署在vercel的twikoo的https地址";
        // console.log(`[Twikoo] Using hardcoded envId: ${finalEnvId}`);

        window.twikoo.init({
          envId: finalEnvId,
          el: "#twikoo-comments-container",
          path: pathname,
          lang: "zh-CN",
          provider: "vercel",
        });
        // console.log("[Twikoo] Init function called successfully.");
      } catch (e) {
        console.error("[Twikoo] Error during init:", e);
      }
    }
  };
```

## 4. 关键安全配置

### API Token 管理

1. **Strapi API Token**:
   - 登录Strapi后台
   - 设置 → API Tokens → 创建新Token
   - 选择"Full access"或自定义权限
   - 在前端`.env.local`中使用此Token

2. **Algolia API Keys**:
   - 使用Search-Only API Key在前端
   - 使用Admin API Key在后端
   - 在Algolia控制台限制密钥权限

3. **Strapi JWT 密钥**:
   - 使用强密码生成器创建
   - 长度至少32个字符
   - 定期轮换

### 安全最佳实践

- 永远不要将敏感密钥提交到版本控制
- 使用不同的密钥用于开发和生产环境
- 定期轮换API密钥和访问令牌
- 在云服务器上配置防火墙规则，仅开放必要端口
- 为数据库设置强密码并启用SSL连接

## 5. 内容更新流程

### 添加新博客文章

1. 登录Strapi管理后台
2. 进入Content Manager → Posts
3. 创建新内容
4. 保存并发布
5. 新文章将自动同步到Algolia

### 更新网站配置

1. 修改前端代码后推送到GitHub
2. Vercel会自动重新部署
3. 更新Strapi内容后，需清除前端缓存：
   - 在Vercel项目中触发重新部署
   - 或设置ISR（增量静态再生）

## 故障排除

### 常见问题

1. **Algolia搜索无结果**:
   - 检查Algolia插件配置
   - 确认Strapi内容已发布
   - 在Algolia控制台检查索引内容

2. **Twikoo评论无法加载**:
   - 检查Vercel部署状态
   - 确认MongoDB连接正常
   - 验证前端环境变量配置

3. **Strapi部署后无法访问**:
   - 检查云服务器防火墙设置
   - 查看PM2日志：`pm2 logs strapi`
   - 确认数据库连接配置正确

## 技术支持

如遇技术问题，请提交Issue：
[前端问题](https://github.com/yourusername/blog-frontend/issues)
[后端问题](https://github.com/yourusername/blog-backend/issues)

## 许可证

本项目采用 [MIT 许可证](LICENSE)

```

## 补充说明

### 关键配置项总结

1. **前端环境变量**:
   - Strapi API URL 和 Token
   - Algolia App ID、Search Key 和 Index Name
   - Twikoo 服务 URL

2. **后端环境变量**:
   - 数据库连接字符串
   - Algolia Admin API Key
   - SMTP 邮件服务配置
   - JWT 密钥和 API Token Salt

3. **Twikoo 配置**:
   - MongoDB 连接 URI
   - 管理员密码

### 安全建议

- 所有敏感密钥都应使用环境变量管理
- 生产环境禁用 Strapi 的公共注册
- 定期备份数据库
- 使用 HTTPS 加密所有连接
- 限制 API 访问权限（IP 白名单、速率限制）

### 性能优化

1. **前端**:
   - 使用 Next.js 的 ISG (增量静态生成)
   - 实现图片懒加载
   - 添加缓存控制头

2. **后端**:
   - 启用 Strapi 缓存
   - 使用 Redis 缓存频繁访问的数据
   - 优化数据库查询

3. **搜索**:
   - 调整 Algolia 排名设置
   - 使用查询建议
   - 配置同义词

这个 README 提供了完整的项目配置和部署指南，用户可以根据实际环境修改所有必要的 API 密钥、Token 和 ID。