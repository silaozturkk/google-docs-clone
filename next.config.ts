// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "img.clerk.com",
      // başka dış görsel kaynakların varsa onları da buraya ekle
    ],
  },
  // ...diğer ayarların...
};

module.exports = nextConfig;
