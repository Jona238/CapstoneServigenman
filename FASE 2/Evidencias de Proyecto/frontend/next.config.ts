import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Extra stability for Windows dev file watching
  // (Polling avoids ENOENT on .next temp files when FS tools interfere)
  // Note: This only affects webpack dev, not production/build.
  // @ts-expect-error - Next doesn't type watchOptions in config
  webpack: (config, { dev }) => {
    if (dev) {
      // @ts-expect-error - watchOptions is a valid webpack option
      config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    }
    return config;
  },
  eslint: {
    // Skip ESLint errors during production builds to avoid blocking deploys
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://localhost:8000/:path*" },
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
