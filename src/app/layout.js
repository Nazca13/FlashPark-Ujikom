// import font poppins dari library google font bawaan next.js
import { Poppins } from "next/font/google";
// import file css global untuk styling dasar aplikasi
import "./globals.css";

// konfigurasi font poppins, kita ambil beberapa ketebalan (weight)
const poppins = Poppins({
  variable: "--font-poppins", // variabel css biar bisa dipake di file lain
  subsets: ["latin"], // subset karakter latin (abc...)
  weight: ["300", "400", "500", "600", "700"], // variasi tebal font
});

// metadata untuk informasi website di tab browser dan seo
export const metadata = {
  title: "FlashPark",
  description: "Parking App System",

  // ikon kecil di tab browser (favicon)
  icons: {
    icon: '/logo-metadata.svg',
  },
};

// komponen utama layout yang membungkus seluruh aplikasi
// children = isi halaman yang sedang dibuka user
export default function RootLayout({ children }) {
  return (
    // tag html utama, set bahasa inggris
    <html lang="en">
      {/* tag body, tempat semua konten tampil */}
      {/* kita masukin class font poppins disini biar ngefek ke semua */}
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
