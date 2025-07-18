
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Set to true to fail build on type errors
    // Good for production, but can be annoying in development
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to true to fail build on lint errors
    // Good for production
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
