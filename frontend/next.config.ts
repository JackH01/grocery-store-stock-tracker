import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/products",
        destination: "http://localhost:8000/api/products/",
      },
      {
        source: "/api/product_categories",
        destination: "http://localhost:8000/api/product_categories/",
      },
    ];
  }
};

export default nextConfig;
