import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "e-mobility.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  // output: "standalone",
  // allowedDevOrigins: ['192.168.29.101'],
};

export default nextConfig;
