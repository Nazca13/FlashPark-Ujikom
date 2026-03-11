/**
 * ============================================================================
 * NEXT.JS CONFIGURATION - next.config.mjs
 * ============================================================================
 * File konfigurasi utama Next.js. Di sini kita set pengaturan global
 * untuk build, gambar, dan server actions.
 * 
 * Format .mjs = ES Module (bisa pakai import/export)
 * 
 * @module NextConfig
 * ============================================================================
 */

/** @type {import('next').NextConfig} */
// nextConfig = object berisi semua pengaturan Next.js
const nextConfig = {
  //   output: 'export', // DIKOMENTARI: Jika diaktifkan, build jadi static HTML (untuk Electron desktop app)
  //                     // Saat aktif, fitur server-side seperti API route dan server action tidak bisa dipakai

  // ===== KONFIGURASI GAMBAR =====
  images: {
    unoptimized: true, // matikan optimasi gambar Next.js
    // kenapa? karena saat jadi aplikasi desktop (Electron), 
    // optimasi gambar Next.js tidak bisa berjalan (butuh server)
    // jadi kita set true agar gambar tetap bisa tampil
  },

  // ===== KONFIGURASI SERVER ACTIONS =====
  // Server Actions = fungsi yang jalan di server tapi dipanggil dari client
  // Untuk keamanan, kita harus daftarkan domain yang diizinkan
  serverActions: {
    allowedOrigins: [
      "localhost:3001",                    // development di port 3001
      "localhost:3000",                    // development di port 3000
      "localhost",                         // development tanpa port
      "rnm45pf6-3001.asse.devtunnels.ms", // VS Code Dev Tunnel (untuk testing jarak jauh)
      "*.asse.devtunnels.ms",             // wildcard untuk semua Dev Tunnel di region Asia Southeast
    ],
  },
};

// export konfigurasi agar Next.js bisa membacanya
export default nextConfig;