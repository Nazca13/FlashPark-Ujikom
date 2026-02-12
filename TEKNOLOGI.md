# Teknologi yang Digunakan di FlashPark

Dokumen ini menjelaskan **22 teknologi utama** yang digunakan dalam pengembangan sistem FlashPark beserta fungsi dan implementasinya.

---

## 🎨 Frontend Framework & Library

### 1. **Next.js 16.1.1**
**Fungsi**: Framework React untuk Server-Side Rendering (SSR) dan Static Site Generation (SSG)

**Dipakai dimana**:
- Routing sistem menggunakan App Router (`src/app/`)
- Halaman dinamis: `/dashboard/admin`, `/dashboard/petugas`, `/dashboard/owner`
- Server Actions untuk operasi backend (`actions.js` files)
- Automatic code splitting untuk performa optimal

**Contoh file**:
- `src/app/layout.js` - Root layout
- `src/app/dashboard/admin/page.js` - Admin dashboard page
- `src/app/signin/page.js` - Login page

---

### 2. **React 19.2.3**
**Fungsi**: Library JavaScript untuk membangun user interface berbasis komponen

**Dipakai dimana**:
- Semua komponen UI di `src/components/`
- Client components dengan `"use client"` directive
- React hooks: `useState`, `useEffect`, `useActionState`

**Contoh file**:
- `src/components/ui/stats/stat-card.js` - StatCard component
- `src/components/forms/transaction-form/index.js` - Form input kendaraan
- `src/features/transactions/components/checkout/index.js` - Checkout component

---

### 3. **React DOM 19.2.3**
**Fungsi**: Package untuk rendering React components ke DOM browser

**Dipakai dimana**:
- Rendering semua halaman web
- Event handling (onClick, onChange, onSubmit)
- Form interactions di seluruh aplikasi

---

## 💾 Backend & Database

### 4. **PostgreSQL**
**Fungsi**: Relational Database Management System (RDBMS)

**Dipakai dimana**:
- Database utama `db_parkir_ukk`
- Menyimpan 5 tabel: `tb_user`, `tb_transaksi`, `tb_tarif`, `tb_area_parkir`, `tb_log_aktivitas`
- Relasi antar tabel (Foreign Keys, One-to-Many)

**Struktur**:
- Tabel User: 3 role (admin, petugas, owner)
- Tabel Transaksi: Check-in/out kendaraan dengan kalkulasi biaya
- Tabel Area: Slot parkir dengan real-time monitoring kapasitas

---

### 5. **Prisma ORM 5.10.2**
**Fungsi**: Object-Relational Mapping untuk interaksi database yang type-safe

**Dipakai dimana**:
- Schema definition: `prisma/schema.prisma`
- Database migrations dan seeding
- Type-safe queries di semua actions

**Contoh penggunaan**:
```javascript
// src/features/users/actions/manage-users.actions.js
await prisma.tb_user.create({ data: {...} })
await prisma.tb_user.findMany({ where: {...} })
await prisma.tb_user.update({ where: {...}, data: {...} })
await prisma.tb_user.delete({ where: {...} })
```

---

### 6. **Prisma Client**
**Fungsi**: Auto-generated database client dari Prisma schema

**Dipakai dimana**:
- Semua file di `src/features/*/actions/`
- Query dan mutations di Server Actions
- Type-safe database operations

**File setup**:
- `src/lib/database/prisma.js` - Prisma client initialization
- `src/lib/database/index.js` - Export prisma instance

---

### 7. **Prisma Adapter PG (@prisma/adapter-pg)**
**Fungsi**: Adapter untuk menghubungkan Prisma dengan PostgreSQL via connection pool

**Dipakai dimana**:
- `src/lib/database/prisma.js` - Setup connection dengan PostgreSQL
- Optimasi koneksi database dengan pooling

**Implementasi**:
```javascript
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

---

### 8. **pg (node-postgres) 8.17.2**
**Fungsi**: PostgreSQL client untuk Node.js dengan connection pooling

**Dipakai dimana**:
- `src/lib/database/prisma.js` - Create connection pool
- Manage multiple database connections efficiently

**Implementasi**:
```javascript
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
```

---

## 📊 Data Visualization & Reporting

### 9. **Recharts 3.7.0**
**Fungsi**: Library React untuk membuat chart dan grafik interaktif

**Dipakai dimana**:
- Dashboard Owner: `src/app/dashboard/owner/page.js`
- Revenue Chart: `src/features/reports/components/revenue-chart/index.js`
- Grafik batang pendapatan harian (7 hari terakhir)

**Komponen yang dipakai**:
- `BarChart` - Grafik batang
- `XAxis`, `YAxis` - Sumbu koordinat
- `CartesianGrid` - Grid background
- `Tooltip` - Info hover
- `Bar` - Data visualization

---

### 10. **jsPDF 4.1.0**
**Fungsi**: Library JavaScript untuk generate file PDF

**Dipakai dimana**:
- Dashboard Owner: Export laporan pendapatan
- `src/app/dashboard/owner/page.js` - Function `handleExportPDF()`

**Fitur yang diimplementasi**:
- Generate PDF dengan header "LAPORAN PENDAPATAN"
- Informasi periode tanggal
- Tabel pendapatan otomatis

---

### 11. **jsPDF AutoTable 5.0.7**
**Fungsi**: Plugin jsPDF untuk membuat tabel otomatis di PDF

**Dipakai dimana**:
- Dashboard Owner: Tabel detail pendapatan harian
- Format tabel rapi dengan kolom: Tanggal, Jumlah Transaksi, Total Pendapatan

**Implementasi**:
```javascript
import autoTable from 'jspdf-autotable'
doc.autoTable({
  head: [['Tanggal', 'Jumlah Transaksi', 'Total Pendapatan']],
  body: tableData
})
```

---

### 12. **html2canvas 1.4.1**
**Fungsi**: Capture elemen HTML menjadi canvas/image

**Dipakai dimana**:
- Backup library untuk screenshot grafik/chart
- Capture visualizations untuk export

---

### 13. **react-to-print 3.2.0**
**Fungsi**: Print React components langsung

**Dipakai dimana**:
- Alternatif untuk print receipts atau reports
- Print-friendly formatting

---

## 🛠️ Development Tools

### 14. **ESLint 9**
**Fungsi**: JavaScript linter untuk menjaga kualitas kode

**Dipakai dimana**:
- Linting semua file `.js`
- Enforce coding standards
- Detect bugs dan anti-patterns

**File config**:
- `eslint.config.mjs` - ESLint configuration

---

### 15. **ESLint Config Next**
**Fungsi**: ESLint configuration khusus untuk Next.js projects

**Dipakai dimana**:
- Rules khusus Next.js (Image optimization, Link usage, etc.)
- Best practices untuk App Router
- Server/Client component validation

---

## 🎨 Styling

### 16. **CSS Modules**
**Fungsi**: CSS dengan scope lokal per komponen (tidak global)

**Dipakai dimana**:
- Semua file `*.module.css`
- Component-specific styling yang tidak bentrok
- 15+ file CSS Modules di project

**Contoh file**:
- `src/components/ui/stats/stat-card.module.css`
- `src/app/dashboard/admin/admin.module.css`
- `src/components/layouts/admin-layout/styles.module.css`

**Cara pakai**:
```javascript
import styles from './component.module.css'
<div className={styles.container}>...</div>
```

---

### 17. **Vanilla CSS**
**Fungsi**: Pure CSS tanpa preprocessor

**Dipakai dimana**:
- `src/app/globals.css` - Global styles (font Poppins, reset CSS, variables)
- Base styling untuk seluruh aplikasi
- CSS custom properties (variables)

---

## 🔐 Authentication & Security

### 18. **Server Actions (Next.js built-in)**
**Fungsi**: Server-side operations yang secure dan type-safe

**Dipakai dimana**:
- SEMUA file `actions.js` di project
- Login/logout: `src/features/authentication/actions/login.actions.js`
- CRUD operations: User, Tarif, Area, Transaksi
- Database queries yang aman dari SQL injection

**Keuntungan**:
- Automatic CSRF protection
- Type-safe mutations
- No need for API routes

---

### 19. **Session Management (Cookies)**
**Fungsi**: Menyimpan state user login secara aman

**Dipakai dimana**:
- `src/features/authentication/actions/login.actions.js`
- Cookie `user_session` untuk track logged-in user
- Redirect based on role (admin/petugas/owner)

**Implementasi**:
```javascript
import { cookies } from 'next/headers'
const cookieStore = await cookies()
cookieStore.set('user_session', JSON.stringify(user))
```

---

## 🌐 Development Environment

### 20. **Node.js**
**Fungsi**: JavaScript runtime untuk server-side execution

**Dipakai dimana**:
- Menjalankan Next.js development server
- Execute Server Actions
- Build process dan dependencies management

**Commands**:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server

---

### 21. **npm**
**Fungsi**: Node Package Manager untuk manage dependencies

**Dipakai dimana**:
- Install semua 22 packages
- Manage `package.json` dan `package-lock.json`
- Scripts automation (dev, build, start)

**File**:
- `package.json` - Dependencies list dan scripts

---

## 🖥️ Optional (Future Development)

### 22. **Electron 34.0.0**
**Fungsi**: Framework untuk membuat desktop applications menggunakan web technologies

**Dipakai dimana**:
- **Belum aktif digunakan** (masih dalam package.json)
- Rencana masa depan: FlashPark versi desktop app
- Bisa jalan di Windows/Mac/Linux tanpa browser

**Persiapan**:
- `package.json`: Script `electron-dev` dan `electron-build`
- Siap diaktifkan kapan saja jika diperlukan

---

## 📝 Summary

**Total 22 teknologi** yang terintegrasi sempurna membentuk FlashPark menjadi sistem parkir modern dengan fitur:

✅ **Frontend Modern**: Next.js + React untuk UI yang cepat dan responsive  
✅ **Database Powerful**: PostgreSQL + Prisma untuk data yang aman dan terstruktur  
✅ **Visualization**: Recharts untuk grafik pendapatan yang interaktif  
✅ **Reporting**: jsPDF untuk laporan PDF profesional  
✅ **Security**: Server Actions + Session Management untuk keamanan maksimal  
✅ **Code Quality**: ESLint untuk kode yang clean dan maintainable  
✅ **Styling**: CSS Modules untuk styling yang modular dan tidak bentrok  

Semua teknologi ini bekerja harmonis untuk menghasilkan sistem parkir yang **efisien**, **aman**, dan **mudah digunakan**! 🚀
