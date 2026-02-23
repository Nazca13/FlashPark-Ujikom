/** @type {import('next').NextConfig} */
const nextConfig = {
  //   output: 'export', // Ini kunci utamanya untuk Electron
  images: {
    unoptimized: true, // Supaya gambar tidak error saat jadi aplikasi desktop
  },
  serverActions: {
    allowedOrigins: [
      "localhost:3001",
      "localhost:3000",
      "localhost",
      "rnm45pf6-3001.asse.devtunnels.ms",
      "*.asse.devtunnels.ms",
    ],
  },
};

export default nextConfig;