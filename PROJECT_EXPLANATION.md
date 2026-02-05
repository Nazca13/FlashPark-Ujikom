# Dokumentasi Proyek FlashPark

Dokumen ini berisi penjelasan detail mengenai struktur proyek, fungsi file-file kunci, dan folder yang digunakan dalam aplikasi FlashPark.

## 1. Struktur Folder & File Utama

### Root Directory
- **.env**: File konfigurasi environment variables. Berisi koneksi database (`DATABASE_URL`) dan secret key lainnya. **JANGAN DI-COMMIT KE GIT**.
- **prisma/**: Folder untuk konfigurasi database ORM (Prisma).
  - **schema.prisma**: Definisi struktur tabel database (User, Tarif, Area, Transaksi, Logs).
- **public/**: Folder untuk aset statis yang bisa diakses publik (gambar, icon, dll).
- **src/**: Folder utama kode sumber aplikasi.

### `src/` Directory
- **app/**: Folder utama untuk routing halaman (App Router Next.js).
- **components/**: Folder untuk komponen UI yang bisa digunakan kembali.
- **hooks/**: Custom hooks React untuk logika yang bisa digunakan kembali (contoh: `useDebounce`).
- **lib/**: Fungsi utilitas dan konfigurasi library pihak ketiga (contoh: konfigurasi Prisma Client).

---

## 2. Penjelasan Detail per Folder

### `src/app/` (Halaman & Routing)
Next.js menggunakan file-system based routing. Setiap folder di dalam `app/` yang memiliki file `page.js` akan menjadi sebuah route URL.

#### `src/app/login/`
Halaman login untuk autentikasi pengguna.
- **page.js**: Tampilan halaman login.
- **actions.js**: Server Action untuk memproses login (verifikasi username/password dari database).

#### `src/app/dashboard/`
Folder induk untuk halaman dashboard.
- **layout.js**: Layout utama dashboard.
- **petugas/**: Area khusus untuk user dengan role "Petugas".
  - **page.js**: Halaman utama dashboard petugas (Input Nopol, pilih area).
  - **transaction-form.js**: Client Component untuk form input transaksi masuk.
  - **actions.js**: Server Action untuk memproses "Check-In" (simpan ke database).
  - **keluar/**: Fitur Transaksi Keluar (Pertemuan 6).
    - **page.js**: Halaman utama transaksi keluar.
    - **checkout/**: Folder komponen sistem checkout (Updated).
      - **index.js**: Komponen utama untuk Search, Hitung Biaya, dan Cetak Struk.
- **admin/**: Area khusus untuk user dengan role "Admin".
  - **users/**: Manajemen data pengguna (Petugas).
  - **tarif/**: Manajemen data tarif parkir.
  - **area/**: Manajemen data area parkir dan kapasitas.
  - **logs/**: Melihat riwayat aktivitas sistem.

### `src/components/` (Komponen UI)
- **layout/**: Komponen layout untuk struktur halaman.
  - **dashboard-layout.js**: Struktur umum dashboard (Sidebar + Content).
  - **sidebar.js**: Komponen navigasi samping dengan logika icon aktif/tidak aktif.
  - **petugas-layout/**: Folder layout spesifik untuk halaman petugas.
    - **index.js**: Layout wrapper.
    - **styles.module.css**: Styling CSS Module.
- **ui/**: Komponen UI kecil (Button, Input, Card, dll).
- **auth/**: Komponen terkait autentikasi.
  - **AuthProvider.js**: Context provider untuk mengelola session user di sisi client.

### `src/lib/` (Utilities)
- **prisma.js**: Inisialisasi `PrismaClient`. Digunakan untuk melakukan query ke database di seluruh aplikasi. Pola singleton untuk mencegah terlalu banyak koneksi database.

---

## 3. Styling & Fonts
- **Font Global**: Menggunakan font **Poppins** yang diimport dari `next/font/google` di `src/app/layout.js`.
- **CSS Modules**: Menggunakan pendekatan CSS Modules (contoh: `styles.module.css`) untuk styling yang terisolasi per komponen.

---

## 3. Penjelasan Kode & Fungsi Penting

### Database (Prisma)
Kita menggunakan Prisma ORM. Setiap kali kita ingin mengambil atau menyimpan data, kita menggunakan `prisma.[namaTabel].[operasi]`.
Contoh:
```javascript
// Mengambil semua user
const users = await prisma.tb_user.findMany();

// Membuat transaksi baru
await prisma.tb_transaksi.create({
  data: {
    plat_nomor: 'B 1234 ABC',
    ...
  }
});
```

### Server Actions
File `actions.js` di setiap folder biasanya berisi fungsi yang berjalan di server.
- **`"use server"`**: Menandakan bahwa fungsi di dalam file ini bisa dipanggil dari Client Component tapi dieksekusi di Server.
- Contoh fungsi: `login`, `createUser`, `checkInKendaraan`.

### Autentikasi
Menggunakan kombinasi `cookie` (session) dan database.
1. User login -> Server validasi -> Server set cookie session.
2. Setiap kali pindah halaman -> Middleware (jika ada) atau Layout mengecek validitas session.
