/**
 * ============================================================================
 * ADMIN DASHBOARD PAGE
 * ============================================================================
 * File ini adalah halaman utama dashboard admin yang menampilkan:
 * - Statistik ringkasan (pendapatan, kendaraan masuk, sisa slot, total petugas)
 * - Tabel riwayat transaksi parkir
 * 
 * @module AdminDashboard
 * @path /dashboard/admin
 * ============================================================================
 */

// ============================================================================
// IMPORT DEPENDENCIES
// ============================================================================

/**
 * @import DashboardLayout - Komponen layout utama dashboard
 * Menyediakan sidebar, header, dan struktur halaman dashboard
 * @see /components/layout/DashboardLayout
 */
import { DashboardLayout } from "@/components/layout/DashboardLayout";

/**
 * @import StatCard - Komponen kartu statistik
 * Menampilkan informasi statistik dengan ikon, judul, dan nilai
 * @see /components/ui/StatCard
 */
import { StatCard } from "@/components/ui/StatCard";

/**
 * @import getDashboardData - Server Action untuk mengambil data dashboard
 * Fungsi async yang query data transaksi dan statistik dari database
 * @see ./actions.js
 */
import { getDashboardData } from "./actions";

/**
 * @import styles - CSS Module untuk styling halaman dashboard
 * Berisi class: pageTitle, statsGrid, cardContainer, filterRow, table, dll
 * @see ./DashboardPage.module.css
 */
import styles from './DashboardPage.module.css';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AdminDashboard - Komponen Halaman Dashboard Admin
 * 
 * @description
 * Ini adalah Server Component (async function) karena perlu mengambil data
 * langsung dari database menggunakan Server Actions.
 * 
 * @async - Fungsi async untuk mendukung pengambilan data dari database
 * @returns {JSX.Element} - Halaman dashboard dengan statistik dan tabel transaksi
 * 
 * @example
 * // Komponen ini di-render otomatis oleh Next.js ketika user mengakses
 * // route: /dashboard/admin
 */
export default async function AdminDashboard() {

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Destructuring hasil dari getDashboardData()
   * 
   * @const {Array} transaksi - Array berisi daftar transaksi parkir terbaru
   *   Setiap item memiliki: id_parkir, plat_nomor, waktu_masuk, waktu_keluar,
   *   biaya_total, serta relasi tb_user dan tb_tarif
   * 
   * @const {Object} stats - Objek berisi statistik dashboard
   *   - stats.pendapatan: Total pendapatan hari ini
   *   - stats.kendaraanMasuk: Jumlah kendaraan yang masuk hari ini
   *   - stats.sisaSlot: Jumlah slot parkir tersedia
   *   - stats.totalPetugas: Jumlah petugas yang terdaftar
   * 
   * @await - Menunggu data selesai diambil dari database sebelum render
   */
  const { transaksi, stats } = await getDashboardData();

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  /**
   * formatRupiah - Memformat angka menjadi format mata uang Rupiah Indonesia
   * 
   * @param {number} angka - Angka yang akan diformat (contoh: 50000)
   * @returns {string} - String format Rupiah (contoh: "Rp50.000")
   * 
   * @description
   * Menggunakan Intl.NumberFormat API bawaan JavaScript untuk:
   * - Menambahkan simbol mata uang "Rp"
   * - Menambahkan pemisah ribuan dengan titik (.)
   * - Tidak menampilkan desimal (minimumFractionDigits: 0)
   * 
   * @example
   * formatRupiah(150000) // Output: "Rp150.000"
   * formatRupiah(2500000) // Output: "Rp2.500.000"
   */
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",       // Mode format mata uang
      currency: "IDR",         // Kode mata uang Indonesia
      minimumFractionDigits: 0 // Tidak tampilkan desimal (.00)
    }).format(angka);
  };

  /**
   * formatDate - Memformat objek Date menjadi format tanggal Indonesia
   * 
   * @param {Date|string|null} dateObj - Objek Date atau string tanggal
   * @returns {string} - Format tanggal (contoh: "24/01/2026") atau "-" jika null
   * 
   * @description
   * Menggunakan toLocaleDateString dengan locale "id-ID" untuk format Indonesia
   * 
   * @example
   * formatDate(new Date()) // Output: "24/01/2026"
   * formatDate(null) // Output: "-"
   */
  const formatDate = (dateObj) => {
    // Guard clause: Jika dateObj null/undefined, kembalikan strip
    if (!dateObj) return "-";

    // Konversi ke Date object (jika string) dan format ke locale Indonesia
    return new Date(dateObj).toLocaleDateString("id-ID");
  };

  /**
   * formatTime - Memformat objek Date menjadi format jam:menit
   * 
   * @param {Date|string|null} dateObj - Objek Date atau string tanggal
   * @returns {string} - Format waktu (contoh: "14:30") atau "-" jika null
   * 
   * @description
   * Menggunakan toLocaleTimeString dengan opsi:
   * - hour: '2-digit' -> Jam dengan 2 digit (contoh: 09, 14)
   * - minute: '2-digit' -> Menit dengan 2 digit (contoh: 05, 30)
   * 
   * @example
   * formatTime(new Date("2026-01-24T14:30:00")) // Output: "14:30"
   * formatTime(null) // Output: "-"
   */
  const formatTime = (dateObj) => {
    // Guard clause: Jika dateObj null/undefined, kembalikan strip
    if (!dateObj) return "-";

    // Konversi dan format ke waktu Indonesia (hanya jam dan menit)
    return new Date(dateObj).toLocaleTimeString("id-ID", {
      hour: '2-digit',   // Format jam 2 digit
      minute: '2-digit'  // Format menit 2 digit
    });
  };

  // ==========================================================================
  // RENDER JSX
  // ==========================================================================

  return (
    /**
     * DashboardLayout - Wrapper layout untuk semua halaman dashboard
     * 
     * @prop {string} activePage - Menandai menu yang aktif di sidebar
     *   Nilai: "Dashboard" akan membuat menu Dashboard ter-highlight
     */
    <DashboardLayout activePage="Dashboard">

      {/* ================================================================== */}
      {/* PAGE TITLE */}
      {/* ================================================================== */}

      {/**
       * Judul halaman dashboard
       * @class styles.pageTitle - Styling dari CSS Module
       */}
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* ================================================================== */}
      {/* STATS SECTION - Kartu Statistik */}
      {/* ================================================================== */}

      {/**
       * Container grid untuk 4 kartu statistik
       * @class styles.statsGrid - CSS Grid layout untuk mengatur posisi kartu
       *   Biasanya menggunakan grid-template-columns untuk 4 kolom responsive
       */}
      <div className={styles.statsGrid}>

        {/**
         * StatCard #1 - Total Pendapatan
         * @prop {string} title - Label kartu: "Total Pendapatan"
         * @prop {string} value - Nilai pendapatan yang sudah diformat ke Rupiah
         * @prop {string} iconPath - Path ke file SVG icon pendapatan
         */}
        <StatCard
          title="Total Pendapatan"
          value={formatRupiah(stats.pendapatan)}
          iconPath="/content/pendapatan-icon.svg"
        />

        {/**
         * StatCard #2 - Kendaraan Masuk
         * @prop {string} title - Label kartu: "Kendaraan Masuk"
         * @prop {number} value - Jumlah kendaraan yang masuk hari ini
         * @prop {string} iconPath - Path ke file SVG icon kendaraan
         */}
        <StatCard
          title="Kendaraan Masuk"
          value={stats.kendaraanMasuk}
          iconPath="/content/kendaraan-masuk-icon.svg"
        />

        {/**
         * StatCard #3 - Sisa Slot
         * @prop {string} title - Label kartu: "Sisa Slot"
         * @prop {number} value - Jumlah slot parkir yang tersedia
         * @prop {string} iconPath - Path ke file SVG icon slot
         */}
        <StatCard
          title="Sisa Slot"
          value={stats.sisaSlot}
          iconPath="/content/sisa-slot-icon.svg"
        />

        {/**
         * StatCard #4 - Total Petugas
         * @prop {string} title - Label kartu: "Total Petugas"
         * @prop {number} value - Jumlah petugas yang terdaftar
         * @prop {string} iconPath - Path ke file SVG icon petugas
         */}
        <StatCard
          title="Total Petugas"
          value={stats.totalPetugas}
          iconPath="/content/total-petugas-icon.svg"
        />
      </div>

      {/* ================================================================== */}
      {/* TABLE SECTION - Tabel Riwayat Transaksi */}
      {/* ================================================================== */}

      {/**
       * Container utama untuk filter dan tabel
       * @class styles.cardContainer - Styling kartu dengan shadow, border-radius, dll
       */}
      <div className={styles.cardContainer}>

        {/* ---------------------------------------------------------------- */}
        {/* Filter Row - Area untuk input filter (opsional) */}
        {/* ---------------------------------------------------------------- */}

        {/**
         * Baris filter untuk menyaring data tabel
         * @class styles.filterRow - Styling untuk layout filter inputs
         * @note Saat ini filter inputs belum diimplementasi (placeholder)
         */}
        <div className={styles.filterRow}>
          {/* TODO: Implementasi filter berdasarkan tanggal, jenis kendaraan, dll */}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Data Table - Tabel Riwayat Transaksi Parkir */}
        {/* ---------------------------------------------------------------- */}

        {/**
         * Tabel HTML untuk menampilkan data transaksi
         * @class styles.table - Styling tabel (border, padding, hover effect, dll)
         */}
        <table className={styles.table}>

          {/**
           * Table Header - Baris judul kolom
           * <thead> = Table Head, berisi definisi kolom
           */}
          <thead>
            <tr>
              <th>No</th>           {/* Nomor urut */}
              <th>Petugas</th>      {/* Nama petugas yang memproses */}
              <th>Kendaraan</th>    {/* Jenis kendaraan (Motor/Mobil) */}
              <th>Plat Nomor</th>   {/* Plat nomor kendaraan */}
              <th>Tanggal</th>      {/* Tanggal transaksi */}
              <th>Jam Masuk</th>    {/* Waktu kendaraan masuk */}
              <th>Jam Keluar</th>   {/* Waktu kendaraan keluar */}
              <th>Total Biaya</th>  {/* Biaya parkir yang dibayar */}
            </tr>
          </thead>

          {/**
           * Table Body - Baris data transaksi
           * <tbody> = Table Body, berisi data aktual
           */}
          <tbody>

            {/**
             * Conditional Rendering dengan Ternary Operator:
             * 
             * kondisi ? tampilkanIni : tampilkanItu
             * 
             * Jika transaksi.length === 0 (tidak ada data):
             *   -> Tampilkan pesan "Belum ada data transaksi"
             * Jika ada data:
             *   -> Loop dan tampilkan setiap transaksi
             */}
            {transaksi.length === 0 ? (

              /**
               * Empty State - Ditampilkan ketika tidak ada data
               * @attr colSpan="8" - Gabungkan 8 kolom menjadi 1 sel
               */
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Belum ada data transaksi.
                </td>
              </tr>

            ) : (

              /**
               * Array.map() - Loop untuk render setiap item transaksi
               * 
               * @param {Object} item - Data transaksi saat ini
               * @param {number} index - Index/posisi dalam array (dimulai dari 0)
               * @returns {JSX.Element} - Baris tabel untuk setiap transaksi
               * 
               * @note key={item.id_parkir} - Wajib di React untuk optimasi render
               *       React menggunakan key untuk track perubahan di list
               */
              transaksi.map((item, index) => (
                <tr key={item.id_parkir}>

                  {/**
                   * Kolom Nomor Urut
                   * index + 1 karena index dimulai dari 0, tapi nomor urut dari 1
                   */}
                  <td>{index + 1}</td>

                  {/**
                   * Kolom Nama Petugas
                   * 
                   * Menggunakan Optional Chaining (?.) dan Nullish Coalescing (||):
                   * - item.tb_user?.nama_lengkap -> Coba akses nama_lengkap dari relasi tb_user
                   * - ?. (Optional Chaining) -> Jika tb_user null/undefined, return undefined
                   *   (mencegah error "Cannot read property of undefined")
                   * - || "Sistem" (Nullish Coalescing) -> Jika hasil undefined/null, gunakan "Sistem"
                   * 
                   * @note tb_user adalah relasi dari Prisma (include di query)
                   */}
                  <td>{item.tb_user?.nama_lengkap || "Sistem"}</td>

                  {/**
                   * Kolom Jenis Kendaraan
                   * 
                   * Mengambil jenis kendaraan dari relasi tb_tarif
                   * Fallback ke "Kendaraan" jika relasi tidak ada
                   * 
                   * @note tb_tarif adalah relasi dari Prisma (include di query)
                   */}
                  <td>{item.tb_tarif?.jenis_kendaraan || "Kendaraan"}</td>

                  {/**
                   * Kolom Plat Nomor
                   * Langsung tampilkan nilai plat_nomor dari data transaksi
                   */}
                  <td>{item.plat_nomor}</td>

                  {/**
                   * Kolom Tanggal
                   * Gunakan helper formatDate untuk format ke locale Indonesia
                   */}
                  <td>{formatDate(item.waktu_masuk)}</td>

                  {/**
                   * Kolom Jam Masuk
                   * Gunakan helper formatTime untuk ekstrak jam:menit
                   */}
                  <td>{formatTime(item.waktu_masuk)}</td>

                  {/**
                   * Kolom Jam Keluar
                   * Bisa null jika kendaraan masih parkir (belum keluar)
                   */}
                  <td>{formatTime(item.waktu_keluar)}</td>

                  {/**
                   * Kolom Total Biaya
                   * 
                   * Conditional dengan Ternary:
                   * - Jika item.biaya_total ada (truthy) -> format ke Rupiah
                   * - Jika null/undefined/0 (falsy) -> tampilkan strip "-"
                   * 
                   * @note biaya_total akan null jika kendaraan belum keluar
                   */}
                  <td>{item.biaya_total ? formatRupiah(item.biaya_total) : "-"}</td>

                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </DashboardLayout>
  );
}