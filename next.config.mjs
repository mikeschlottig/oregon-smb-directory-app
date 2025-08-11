/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Generate static params for all city/industry combinations
  generateBuildId: () => 'oregon-smb-directory',
};

export default nextConfig;