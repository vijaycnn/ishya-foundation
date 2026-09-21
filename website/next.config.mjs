import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: true,
  },
  turbopack: {
    root: __dirname,
  },
  // output: "standalone",
};

export default nextConfig;
