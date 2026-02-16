/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/product/out-of-madness',
          destination: '/books/out-of-madness',
          permanent: true,  // Permanent redirect (301)
        },
      ];
    },
  };
  
  export default nextConfig;
  