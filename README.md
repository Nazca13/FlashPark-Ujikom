<p align="center">
  <img src="public/Logo (1).svg" alt="FlashPark Logo" width="200" />
</p>

<h1 align="center">FlashPark ⚡🅿️</h1>

<p align="center">
  <strong>Sistem Manajemen Parkir Cerdas & Modern</strong><br/>
  Aplikasi web full-stack untuk mengelola area parkir secara real-time — mulai dari check-in, check-out, perhitungan biaya otomatis, hingga laporan pendapatan.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-5.10.2-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Electron-34.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
</p>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Database](#-arsitektur-database)
- [Struktur Proyek](#-struktur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Screenshot](#-screenshot)
- [Kontributor](#-kontributor)
- [Lisensi](#-lisensi)

---

## 🏗️ Tentang Proyek

**FlashPark** adalah sistem manajemen parkir berbasis web yang dirancang untuk mempermudah operasional parkir secara digital. Dibangun sebagai proyek **UKK RPL (Uji Kompetensi Keahlian Rekayasa Perangkat Lunak)**, aplikasi ini menyediakan dashboard berbasis role untuk **Admin**, **Petugas**, dan **Owner** dengan fitur real-time monitoring, kalkulasi biaya otomatis, serta pelaporan keuangan.

### Mengapa FlashPark?

| Masalah Konvensional | Solusi FlashPark |
|---|---|
| Pencatatan manual rentan kesalahan | ✅ Input digital dengan validasi otomatis |
| Sulit memantau kapasitas parkir | ✅ Monitoring slot real-time |
| Perhitungan biaya manual | ✅ Kalkulasi otomatis berdasarkan durasi & tarif |
| Tidak ada laporan keuangan | ✅ Grafik & ekspor PDF profesional |
| Tidak ada kontrol akses | ✅ Sistem role-based access (Admin, Petugas, Owner) |

---

## ✨ Fitur Utama

### 👨‍💼 Admin
- **Dashboard Statistik Real-time** — Total transaksi, kendaraan masuk, sisa slot, dan total pendapatan
- **Filter Dashboard** — Filter berdasarkan tanggal, plat nomor, dan jenis kendaraan
- **Kelola Pengguna** — Tambah, lihat, dan hapus user (Petugas, Admin, Owner)
- **Manajemen Tarif** — Atur biaya parkir per jam berdasarkan jenis kendaraan (Mobil, Motor, Truk)
- **Manajemen Area Parkir** — Kelola slot, monitoring kapasitas, aktifkan/nonaktifkan area
- **Log Aktivitas** — Riwayat semua aktivitas sistem

### 🧑‍🔧 Petugas
- **Check-In Kendaraan** — Input plat nomor, pilih jenis kendaraan, validasi slot otomatis
- **Check-Out Kendaraan** — Cari kendaraan, kalkulasi biaya otomatis berdasarkan durasi
- **Cetak Struk** — Bukti pembayaran parkir yang bisa dicetak
- **Monitoring Kapasitas** — Lihat sisa slot yang tersedia secara real-time
- **Riwayat 5 Kendaraan Terakhir** — Quick view kendaraan yang baru masuk

### 💰 Owner
- **Dashboard Pendapatan** — Statistik pendapatan hari ini dan bulan berjalan
- **Grafik Tren Pendapatan** — Visualisasi pendapatan harian (7 hari terakhir) menggunakan Recharts
- **Filter Range Tanggal** — Lihat pendapatan pada periode tertentu
- **Ekspor Laporan PDF** — Unduh laporan keuangan lengkap dalam format PDF

### 🔐 Fitur Umum
- **Autentikasi Aman** — Login dengan session management berbasis cookie
- **Role-Based Access Control** — Redirect otomatis sesuai role pengguna
- **Layout Responsif** — Sidebar navigasi dengan efek transisi halus
- **Logout Aman** — Penghapusan sesi secara aman

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|---|---|---|
| **Next.js** | 16.1.1 | Framework React dengan App Router & Server Actions |
| **React** | 19.2.3 | Library UI berbasis komponen |
| **CSS Modules** | — | Styling modular dan terisolasi per komponen |
| **Recharts** | 3.7.0 | Chart & grafik interaktif |
| **Poppins** | — | Google Font untuk tipografi |

### Backend & Database
| Teknologi | Versi | Fungsi |
|---|---|---|
| **PostgreSQL** | — | Relational Database (RDBMS) |
| **Prisma ORM** | 5.10.2 | Object-Relational Mapping (type-safe queries) |
| **Prisma Adapter PG** | 5.10.2 | Connection pooling untuk PostgreSQL |
| **pg (node-postgres)** | 8.17.2 | PostgreSQL client untuk Node.js |
| **Server Actions** | — | Operasi server-side bawaan Next.js (CSRF-protected) |

### Reporting & Export
| Teknologi | Versi | Fungsi |
|---|---|---|
| **jsPDF** | 4.1.0 | Generate file PDF |
| **jsPDF AutoTable** | 5.0.7 | Tabel otomatis dalam PDF |
| **html2canvas** | 1.4.1 | Capture elemen HTML ke gambar |
| **react-to-print** | 3.2.0 | Print komponen React langsung |

### Dev Tools
| Teknologi | Versi | Fungsi |
|---|---|---|
| **ESLint** | 9.x | Linter untuk kualitas kode |
| **Electron** | 34.0.0 | Desktop app (opsional/future) |
| **Node.js** | — | JavaScript runtime |
| **npm** | — | Package manager |

---

## 🗄️ Arsitektur Database

Aplikasi menggunakan **PostgreSQL** dengan **6 tabel utama** yang saling berelasi:

```
┌──────────────────┐       ┌──────────────────┐
│    tb_user        │       │    tb_tarif       │
├──────────────────┤       ├──────────────────┤
│ id_user (PK)     │       │ id_tarif (PK)    │
│ nama_lengkap     │       │ jenis_kendaraan  │
│ username (UQ)    │       │ tarif_per_jam    │
│ password         │       └────────┬─────────┘
│ status_aktif     │                │
│ role (enum)      │                │
└──┬───────┬───────┘                │
   │       │                        │
   │       │    ┌───────────────────┼──────────────────┐
   │       │    │  tb_transaksi     │                  │
   │       │    ├───────────────────┤                  │
   │       ├───►│ id_parkir (PK)    │                  │
   │       │    │ plat_nomor        │◄─────────────────┘
   │       │    │ id_tarif (FK)     │
   │       │    │ id_user (FK)      │◄─── Petugas
   │       │    │ id_area (FK)      │◄─── Area Parkir
   │       │    │ waktu_masuk       │
   │       │    │ waktu_keluar      │
   │       │    │ biaya_total       │
   │       │    │ status            │
   │       │    └───────────────────┘
   │       │
   │       │    ┌───────────────────┐
   │       └───►│ tb_kendaraan      │
   │            ├───────────────────┤
   │            │ id_kendaraan (PK) │
   │            │ plat_nomor (UQ)   │
   │            │ jenis_kendaraan   │
   │            │ warna             │
   │            │ pemilik           │
   │            │ id_user (FK)      │
   │            └───────────────────┘
   │
   │            ┌───────────────────┐     ┌──────────────────┐
   └───────────►│ tb_log_aktivitas  │     │ tb_area_parkir   │
                ├───────────────────┤     ├──────────────────┤
                │ id_log (PK)       │     │ id_area (PK)     │
                │ id_user (FK)      │     │ nama_area        │
                │ aktivitas         │     │ kapasitas        │
                │ waktu_aktivitas   │     │ terisi           │
                └───────────────────┘     │ is_active        │
                                          └──────────────────┘
```

### Enum: `user_role`
| Nilai | Deskripsi |
|---|---|
| `admin` | Mengelola data master (user, tarif, area) |
| `petugas` | Menangani check-in/check-out kendaraan |
| `owner` | Memantau laporan keuangan |

---

## 📂 Struktur Proyek

```
flashpark/
├── prisma/
│   └── schema.prisma          # Definisi tabel & relasi database
├── public/                    # Aset statis (logo, icon, gambar)
│   ├── content/               # Icon konten (sidebar, aksi)
│   └── sidebar/               # Icon navigasi sidebar
├── src/
│   ├── app/                   # Routing halaman (Next.js App Router)
│   │   ├── layout.js          # Root layout (font Poppins)
│   │   ├── globals.css        # Global styles & CSS variables
│   │   ├── signin/            # Halaman login
│   │   └── dashboard/
│   │       ├── admin/         # Dashboard Admin
│   │       │   ├── users/     #  └─ Kelola Pengguna
│   │       │   ├── tarif/     #  └─ Kelola Tarif
│   │       │   ├── area/      #  └─ Kelola Area Parkir
│   │       │   └── logs/      #  └─ Log Aktivitas
│   │       ├── petugas/       # Dashboard Petugas
│   │       │   └── keluar/    #  └─ Transaksi Keluar (Check-Out)
│   │       └── owner/         # Dashboard Owner (Laporan)
│   ├── components/            # Komponen UI reusable
│   │   ├── forms/             # Form components
│   │   ├── layouts/           # Layout wrappers (sidebar, header)
│   │   └── ui/                # UI primitives (button, card, stat)
│   ├── features/              # Fitur bisnis (modular)
│   │   ├── areas/             # Manajemen area parkir
│   │   ├── authentication/    # Login, session, auth provider
│   │   ├── logs/              # Log aktivitas
│   │   ├── reports/           # Grafik & laporan pendapatan
│   │   ├── tariffs/           # Manajemen tarif
│   │   ├── transactions/      # Check-in, check-out, struk
│   │   └── users/             # Manajemen pengguna
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Konfigurasi & utility
│       └── database/          # Prisma client setup (singleton)
├── .env                       # Environment variables
├── package.json               # Dependencies & scripts
├── next.config.mjs            # Konfigurasi Next.js
└── eslint.config.mjs          # Konfigurasi ESLint
```

---

## 📌 Prasyarat

Pastikan tools berikut sudah terinstal di sistem Anda:

| Tool | Versi Minimum | Download |
|---|---|---|
| **Node.js** | 18.x atau lebih baru | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x atau lebih baru | *(bundled dengan Node.js)* |
| **PostgreSQL** | 14.x atau lebih baru | [postgresql.org](https://www.postgresql.org/download/) |

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Nazca13/FlashPark-Ujikom.git
cd FlashPark-Ujikom
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Database

Buat database PostgreSQL baru:

```sql
CREATE DATABASE db_parkir_ukk;
```

### 4. Konfigurasi Environment

Buat file `.env` di root proyek:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/db_parkir_ukk"
```

> ⚠️ Ganti `USERNAME` dan `PASSWORD` dengan kredensial PostgreSQL Anda.

### 5. Generate Prisma Client & Migrasi Database

```bash
npx prisma generate
npx prisma db push
```

### 6. (Opsional) Seed Data Awal

Jika tersedia file seed, jalankan:

```bash
npx prisma db seed
```

---

## ▶️ Menjalankan Aplikasi

### Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Production Build

```bash
npm run build
npm start
```

### Desktop App (Electron — Opsional)

```bash
npm run electron-dev
```

---

## 📸 Screenshot

> *Tambahkan screenshot aplikasi di sini untuk memberikan preview visual.*

| Halaman | Preview |
|---|---|
| Login | *screenshot* |
| Dashboard Admin | *screenshot* |
| Dashboard Petugas (Check-In) | *screenshot* |
| Transaksi Keluar (Check-Out) | *screenshot* |
| Dashboard Owner (Laporan) | *screenshot* |
| Cetak Struk | *screenshot* |
| Ekspor PDF | *screenshot* |

---

## 👥 Kontributor

| Nama | Role |
|---|---|
| **Nazca** | Full-Stack Developer |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **Uji Kompetensi Keahlian (UKK) RPL** dan bersifat **open-source** untuk tujuan edukasi.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan <strong>Next.js</strong>, <strong>React</strong>, dan <strong>PostgreSQL</strong>
</p>
