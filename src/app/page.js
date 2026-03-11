/**
 * ============================================================================
 * HALAMAN UTAMA (ROOT PAGE) - src/app/page.js
 * ============================================================================
 * File ini adalah halaman awal saat user membuka website (route "/").
 * Fungsinya hanya satu: langsung redirect (alihkan) user ke halaman login.
 * 
 * Kenapa redirect? Karena aplikasi ini butuh login dulu sebelum bisa dipakai.
 * Jadi ga ada konten di halaman utama, langsung lempar ke /signin.
 * 
 * @module HomePage
 * @path / (root)
 * ============================================================================
 */

// import fungsi redirect dari next/navigation
// redirect = fungsi bawaan Next.js untuk memindahkan user ke halaman lain secara otomatis
// bedanya dengan <Link>: redirect dilakukan di server sebelum halaman dirender
import { redirect } from "next/navigation";

/**
 * Home - Komponen Halaman Utama
 * 
 * Fungsi ini akan dijalankan setiap kali user mengakses URL "/"
 * Langsung redirect ke halaman login tanpa menampilkan apa-apa
 * 
 * @returns {void} - Tidak return JSX karena langsung redirect
 */
export default function Home() {
  // langsung pindahkan user ke halaman signin (login)
  // setelah baris ini, kode di bawahnya tidak akan dieksekusi
  redirect("/signin");
}