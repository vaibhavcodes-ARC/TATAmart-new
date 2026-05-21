import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["gsap"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
