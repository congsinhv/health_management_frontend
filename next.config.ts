import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
<<<<<<< HEAD
  // Enable standalone output for Docker
  output: 'standalone',

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack configuration (fallback for when not using Turbopack)
=======
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
>>>>>>> e5c3234 (feat: implement chatbox feature with health management flows)
  webpack(config) {
    // SVG handling with SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
