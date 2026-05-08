import type { NextConfig } from "next";
import {ROUTE_REDIRECTS, ROUTE_REWRITES} from "./config/routes";

const nextConfig: NextConfig = {
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  async rewrites() {
    return ROUTE_REWRITES;
  },
  async redirects() {
    return ROUTE_REDIRECTS;
  },
};

export default nextConfig;
