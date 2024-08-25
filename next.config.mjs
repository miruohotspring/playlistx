/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "./dist", // Changes the build output directory to `./dist/`.
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
