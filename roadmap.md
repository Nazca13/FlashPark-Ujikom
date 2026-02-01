# Roadmap Progress FlashPark & File Structure

Dokumen ini berisi status progress pengerjaan proyek FlashPark berdasarkan roadmap 4 minggu, lengkap dengan daftar file yang dikerjakan pada setiap sesi pertemuan untuk keperluan presentasi.

---

## MINGGU 1: Fondasi & Desain

### Pertemuan 1: Konstruksi Database
**Fokus:** Membangun struktur data dan koneksi database.
- [x] **Setup Project**: Next.js App Router
- [x] **Konfigurasi Env**: `.env` (Database URL)
- [x] **Schema Database**:
    - `prisma/schema.prisma` (Definisi model `tb_user`, `tb_tarif`, `tb_area_parkir`, `tb_transaksi`, `tb_log_aktivitas`)
- [x] **Tabel Database** (PostgreSQL): `db_parkir_ukk`

### Pertemuan 2: Perancangan Logika & Algoritma
**Fokus:** Konsep visual dan logika sistem (Non-coding).
- [x] **Flowchart Alur Sistem** (Login → Dashboard → Transaksi)
- [x] **Entity Relationship Diagram (ERD)** (Relasi antar tabel)

---

## MINGGU 2: Sistem Back-End & Keamanan

### Pertemuan 3: Autentikasi Multi-User
**Fokus:** Sistem login aman dengan pembagian hak akses (Admin vs Petugas).
- [x] **Halaman Login**:
    - `src/components/pages/SignInPage.js` (UI Login - *Note: Disatukan di `src/app/login/page.js` atau komponen auth*)
    - `src/components/pages/SignInPage.module.css` (Styling)
- [x] **Logic Authentication**:
    - `src/app/login/actions.js` (Server Action untuk validasi user)
    - `src/components/auth/AuthProvider.js` (Session Management)

### Pertemuan 4: CRUD Data Master (Panel Admin)
**Fokus:** Fitur admin untuk mengelola data referensi.
- [x] **Layout Admin**:
    - `src/components/layout/dashboard-layout.js` (Sidebar & Header Admin)
- [x] **Manajemen User (Petugas)**:
    - `src/app/dashboard/admin/users/page.js` (Tabel Data User)
    - `src/app/dashboard/admin/users/actions.js` (Tambah/Edit/Hapus User)
- [x] **Manajemen Tarif Parkir**:
    - `src/app/dashboard/admin/tarif/page.js` (Setting Harga per Jam)
- [x] **Manajemen Area Parkir**:
    - `src/app/dashboard/admin/area/page.js` (Setting Kapasitas Slot)
- [x] **Log Aktivitas**:
    - `src/app/dashboard/admin/logs/page.js` (History Aktivitas System)

---

## MINGGU 3: Fitur Inti Operasional

### Pertemuan 5: Transaksi Masuk (Check-In)
**Fokus:** Mencatat kendaraan yang masuk parkir.
- [x] **Layout Petugas**:
    - `src/components/layout/petugas-layout.js`
- [x] **Halaman Dashboard Petugas**:
    - `src/app/dashboard/petugas/page.js` (Main UI)
- [x] **Form Transaksi Masuk**:
    - `src/app/dashboard/petugas/transaction-form.js` (Input Plat & Pilih Area)
- [x] **Logic Check-In**:
    - `src/app/dashboard/petugas/actions.js` (Function `checkInKendaraan`: Insert ke DB & Update Kapasitas)

### Pertemuan 6: Transaksi Keluar & Pembayaran
**Fokus:** Proses checkout, hitung biaya, dan struk. (**STATUS: SELESAI**)
- [x] **Halaman Transaksi Keluar**:
    - `src/app/dashboard/petugas/keluar/page.js`
- [x] **Fitur Pencarian Kendaraan**:
    - `src/app/dashboard/petugas/keluar/checkout-system.js` (Component Search & Checkout)
- [x] **Logic Hitung Biaya (Checkout)**:
    - `checkInKendaraan` & `checkoutKendaraan` (di `actions.js`)
- [x] **Cetak Struk**:
    - Integrasi `react-to-print`

---

## MINGGU 4: Finalisasi & Pelaporan

### Pertemuan 7: Laporan Keuangan & Optimasi
**Fokus:** Halaman Owner untuk melihat pendapatan.
- [ ] **Dashboard Owner**:
    - *Plan*: `src/app/dashboard/owner/page.js`
- [ ] **Chart/Grafik Pendapatan**:
    - *Plan*: Integrasi Chart.js / Recharts
- [ ] **Export Data**:
    - *Plan*: Fitur Download PDF/Excel

### Pertemuan 8: Debugging & Serah Terima Proyek
**Fokus:** Pembersihan kode dan final testing.
- [ ] **Code Cleanup**: Menghapus `console.log` dan komentar tidak perlu.
- [ ] **Testing**: Cek semua flow dari Login sampai Logout.
- [ ] **Bundling**: Persiapan file .zip untuk dikumpulkan.

---

> **Posisi Saat Ini:** Minggu 3, Pertemuan 6 (Selesai).
