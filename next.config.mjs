/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/product/out-of-madness",
        destination: "/books/out-of-madness",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bluone-ink.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bluone-ink.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dashboard.bluone.ink",
      },
    ],
  },
};

export default nextConfig;
