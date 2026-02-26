import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 reactCompiler: true,
 transpilePackages: ["@sanity/vision", "sanity", "next-sanity"], // ← YEH ADD KARO!
 images: {
  remotePatterns: [
   {
    protocol: "https",
    hostname: "cdn.sanity.io",
    port: "",
    pathname: "/**",
   },
  ],
 },
};

export default nextConfig;
