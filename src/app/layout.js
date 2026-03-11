/**
 * ============================================================================
 * ROOT LAYOUT - src/app/layout.js
 * ============================================================================
 * Layout utama (root) yang membungkus SELURUH halaman aplikasi FlashPark.
 * Setiap halaman otomatis menggunakan layout ini sebagai "bungkus luar".
 * 
 * Fungsi file ini:
 * 1. Mengatur font Poppins dari Google Fonts
 * 2. Mengatur metadata (judul tab browser, favicon)
 * 3. Menyediakan struktur HTML dasar (<html> + <body>)
 * 
 * Di Next.js, layout.js di folder app/ adalah layout WAJIB yang harus ada.
 * Semua halaman (page.js) akan dirender sebagai {children} di dalam layout ini.
 * 
 * @module RootLayout
 * @path Semua halaman
 * ============================================================================
 */

// import font Poppins dari library google font bawaan Next.js
// Next.js otomatis download dan host font ini secara lokal (lebih cepat, privacy-friendly)
import { Poppins } from "next/font/google";

// import file CSS global yang berlaku ke seluruh aplikasi
// file ini berisi reset CSS, variabel warna, dan styling dasar
import "./globals.css";

// ===== KONFIGURASI FONT POPPINS =====
// Poppins() = fungsi dari Next.js untuk setup Google Font
const poppins = Poppins({
  variable: "--font-poppins",                     // nama CSS variable (bisa dipakai: font-family: var(--font-poppins))
  subsets: ["latin"],                             // subset karakter: latin (a-z, 0-9, simbol dasar)
  weight: ["300", "400", "500", "600", "700"],    // variasi ketebalan yang di-download:
  // 300 = light, 400 = regular, 500 = medium, 600 = semi-bold, 700 = bold
});

// ===== METADATA HALAMAN =====
// metadata = informasi yang muncul di tab browser dan dipakai mesin pencari (SEO)
// export const = harus diekspor agar Next.js bisa membacanya
export const metadata = {
  title: "FlashPark",                      // judul yang muncul di tab browser
  description: "Parking App System",       // deskripsi untuk SEO

  // ikon kecil di tab browser (favicon)
  icons: {
    icon: '/logo-metadata.svg',            // path ke file ikon (dari folder public/)
  },
};

/**
 * RootLayout - Komponen Layout Root yang Membungkus Seluruh Aplikasi
 * 
 * Setiap halaman di FlashPark otomatis masuk sebagai {children} di sini.
 * Layout ini menyediakan tag <html> dan <body> yang WAJIB ada.
 * 
 * @param {Object} props - Properties komponen
 * @param {React.ReactNode} props.children - Konten halaman yang sedang dibuka user
 * @returns {JSX.Element} - Struktur HTML lengkap dengan font dan metadata
 */
export default function RootLayout({ children }) {
  return (
    // tag <html> utama, set bahasa ke English
    <html lang="en">
      {/* tag <body> tempat semua konten tampil */}
      {/* poppins.className = tambahkan class font Poppins ke body */}
      {/* sehingga SEMUA teks di aplikasi otomatis pakai font Poppins */}
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
