# Fitur FlashPark Per Halaman

Dokumen ini merinci semua fitur yang tersedia di sistem FlashPark dikategorikan berdasarkan peran pengguna (Role).

---

## 1. Role: Admin
Dashboard manajemen pusat untuk mengelola data master dan memantau seluruh aktivitas parkir.

### **Dashboard Utama** (`/dashboard/admin`)
- **Statistik Real-time**: Monitoring total transaksi, kendaraan masuk, sisa slot, dan total pendapatan.
- **Filter Dashboard**: Filter data berdasarkan Tanggal, Plat Nomor, dan Jenis Kendaraan.
- **Data Transaksi Terakhir**: Tabel yang menampilkan log detail kendaraan yang baru masuk/keluar.
- **Ekspor Data**: (Opsional) Fitur untuk melihat ringkasan aktivitas harian.

### **Kelola Pengguna** (`/dashboard/admin/users`)
- **Tambah User**: Pendaftaran petugas baru, admin lain, atau akun owner.
- **Daftar User**: Melihat daftar semua pengguna yang terdaftar di sistem.
- **Hapus User**: Menghapus akses pengguna dari sistem.

### **Data Tarif** (`/dashboard/admin/tarif`)
- **Manajemen Tarif**: Mengatur biaya parkir per jam berdasarkan jenis kendaraan (Mobil, Motor, Truk).
- **CRUD Tarif**: Tambah, Edit (via database), dan Hapus jenis kendaraan.

### **Data Area Parkir** (`/dashboard/admin/area`)
- **Manajemen Slot**: Mengatur kapasitas total slot parkir untuk setiap area.
- **Monitoring Slot**: Melihat jumlah slot yang terisi secara real-time.
- **Status Area**: Mengaktifkan atau menonaktifkan area parkir tertentu.

---

## 2. Role: Petugas
Dashboard operasional untuk menangani kendaraan yang masuk dan keluar secara langsung di lapangan.

### **Dashboard (Check-In)** (`/dashboard/petugas`)
- **Kendaraan Masuk**: Form input plat nomor dan pemilihan jenis kendaraan untuk pendaftaran masuk.
- **Validasi Slot**: Otomatis mengecek apakah slot di area masih tersedia sebelum check-in.
- **Monitoring Real-time**: Menampilkan sisa kapasitas slot yang tersedia saat ini.
- **History Masuk**: Menampilkan 5 kendaraan terakhir yang baru saja masuk.

### **Transaksi Keluar (Check-Out)** (`/dashboard/petugas/keluar`)
- **Pencarian Kendaraan**: Cari kendaraan berdasarkan plat nomor.
- **Kalkulasi Biaya Otomatis**: Sistem menghitung durasi parkir dan total bayar berdasarkan tarif terkait.
- **Konfirmasi Pembayaran**: Proses penyelesaian transaksi pembayaran.
- **Cetak Struk**: Mencetak bukti bayar (Struk Parkir) setelah transaksi selesai.
- **Update Slot**: Slot parkir otomatis bertambah kembali setelah kendaraan berhasil check-out.

---

## 3. Role: Owner
Dashboard khusus pemilik bisnis untuk memantau performa finansial.

### **Laporan Pendapatan** (`/dashboard/owner`)
- **Statistik Finansial**: Melihat pendapatan hari ini dan total pendapatan bulan berjalan.
- **Tren Pendapatan (Grafik)**: Visualisasi pendapatan harian dalam 7 hari terakhir.
- **Filter Range Tanggal**: Memilih rentang tanggal khusus untuk melihat laporan pendapatan periode tertentu.
- **Download Laporan PDF**: Mencetak laporan keuangan formal berbasis periode tanggal ke format PDF.

---

## Fitur Umum (Semua Role)
- **Sistem Login**: Autentikasi aman dengan pemisahan akses otomatis sesuai role.
- **Layout Responsif**: Sidebar navigasi yang intuitif dengan efek transisi halus.
- **Logout**: Keluar dari sistem dengan menghapus sesi secara aman.
