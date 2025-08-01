
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  experimental: {
    // Empty experimental block for now
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://*.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev"
  ]
};

export default nextConfig;
