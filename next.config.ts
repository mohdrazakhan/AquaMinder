import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Force use of Webpack instead of Turbopack
  webpack: (config) => {
    return config;
  },
  turbopack: {},
};

export default nextConfig;
