/**
 * ============================================================================
 * ESLINT CONFIGURATION - eslint.config.mjs
 * ============================================================================
 * Konfigurasi ESLint untuk proyek FlashPark.
 * ESLint = tool otomatis untuk mengecek kualitas kode JavaScript/React.
 * Dia akan menandai kode yang berpotensi bermasalah (error, warning).
 * 
 * File ini menggunakan format "flat config" (ESLint v9+).
 * 
 * @module ESLintConfig
 * ============================================================================
 */

// import fungsi defineConfig dan globalIgnores dari ESLint
// defineConfig = fungsi helper untuk membuat konfigurasi ESLint (autocomplete support)
import { defineConfig, globalIgnores } from "eslint/config";

// import aturan Next.js Core Web Vitals
// nextVitals = set aturan khusus untuk memastikan performa website Next.js optimal
// termasuk cek penggunaan Image, Link, dan font yang benar
import nextVitals from "eslint-config-next/core-web-vitals";

// buat konfigurasi ESLint
const eslintConfig = defineConfig([
  // spread (sebarkan) semua aturan dari nextVitals
  // ini mengaktifkan semua aturan Next.js sekaligus
  ...nextVitals,

  // Override default ignores dari eslint-config-next
  // Folder-folder ini tidak perlu dicek ESLint karena bukan kode sumber kita
  globalIgnores([
    // Default ignores dari eslint-config-next:
    ".next/**",        // folder build Next.js (auto-generated)
    "out/**",          // folder output static export
    "build/**",        // folder build umum
    "next-env.d.ts",   // file tipe TypeScript auto-generated Next.js
  ]),
]);

// export konfigurasi agar ESLint bisa membacanya
export default eslintConfig;
