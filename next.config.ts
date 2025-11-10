import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  // 修复 Windows 下多个 lockfile 导致的工作区根目录推理问题 确保服务器端代码在项目根目录下解析，避免路径错误

  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: [
    'http://localhost:3000',

  ],
};

export default nextConfig;
