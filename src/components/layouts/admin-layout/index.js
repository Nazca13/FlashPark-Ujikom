/**
 * ============================================================================
 * ADMIN DASHBOARD LAYOUT - src/components/layouts/admin-layout/index.js
 * ============================================================================
 * Komponen layout untuk semua halaman dashboard Admin.
 * Membungkus setiap halaman admin dengan sidebar di kiri dan konten di kanan.
 * 
 * Struktur tampilan:
 * ┌──────────┬────────────────────────┐
 * │ Sidebar  │   Main Content Area    │
 * │ (fixed)  │   (scrollable)         │
 * │          │                        │
 * └──────────┴────────────────────────┘
 * 
 * @module DashboardLayout
 * @path /dashboard/admin/*
 * ============================================================================
 */

// import komponen Sidebar yang berisi menu navigasi admin
import { Sidebar } from "../shared/sidebar";

// import CSS Module untuk styling layout ini
import styles from './styles.module.css';

/**
 * DashboardLayout - Komponen Layout Dashboard Admin
 * 
 * @param {Object} props - Properties komponen
 * @param {React.ReactNode} props.children - Konten halaman yang dibungkus (misal: tabel user, form tarif, dll)
 * @param {string} props.activePage - Nama halaman yang sedang aktif (untuk highlight menu sidebar)
 * @returns {JSX.Element} - Layout dengan sidebar dan area konten utama
 */
export const DashboardLayout = ({ children, activePage }) => {
  return (
    // container utama: flexbox dengan sidebar fixed di kiri
    <div className={styles.container}>
      {/* Sidebar navigasi admin (fixed di kiri, tidak ikut scroll) */}
      {/* activePage dikirim ke Sidebar untuk highlight menu yang sedang aktif */}
      <Sidebar activePage={activePage} />

      {/* Area konten utama (di kanan sidebar, bisa di-scroll) */}
      {/* children = isi halaman yang dibungkus layout ini */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};