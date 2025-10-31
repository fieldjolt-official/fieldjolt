import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  transpilePackages: [
    "@fieldjolt/ui",
    "@fieldjolt/api",
    "@fieldjolt/db",
    "@fieldjolt/auth",
  ],
};

export default nextConfig;
