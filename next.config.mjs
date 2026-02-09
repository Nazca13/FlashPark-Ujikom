/** @type {import('next').NextConfig} */
const nextConfig = {
  //   output: 'export', // Ini kunci utamanya untuk Electron
  images: {
    unoptimized: true, // Supaya gambar tidak error saat jadi aplikasi desktop
  },
};

export default nextConfig;