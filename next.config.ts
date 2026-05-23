import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // remark-math and rehype-katex are ESM-only packages.
  // transpilePackages ensures Turbopack/webpack compiles them correctly
  // so the math plugins are actually applied at runtime.
  transpilePackages: ["remark-math", "rehype-katex", "katex"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
