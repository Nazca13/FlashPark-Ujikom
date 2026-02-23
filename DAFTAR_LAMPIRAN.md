# LAMPIRAN PROYEK FLASHPARK

Dokumen ini berisi daftar final file dan materi yang **WAJIB** dilampirkan dalam Laporan Akhir.

---

## 📌 BAGIAN A: DAFTAR KODE PROGRAM (SOURCE CODE)

Berikut adalah *source code* lengkap dari fitur-fitur inti aplikasi FlashPark. Gunakan ini untuk lampiran kode program.

### 1. Konfigurasi Database (Schema)
**File:** `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL")
}

model tb_transaksi {
  id_parkir      Int            @id @default(autoincrement())
  plat_nomor     String         @db.VarChar(20)
  id_tarif       Int
  id_user        Int            // Petugas yang melayani
  id_area        Int            // Area parkir
  waktu_masuk    DateTime       @default(now())
  waktu_keluar   DateTime?
  biaya_total    Decimal?       @db.Decimal(10, 0)
  status         String         @default("masuk") @db.VarChar(20)
   
  // Relasi
  tb_tarif       tb_tarif       @relation(fields: [id_tarif], references: [id_tarif])
  tb_user        tb_user        @relation(fields: [id_user], references: [id_user])
  tb_area_parkir tb_area_parkir @relation(fields: [id_area], references: [id_area])
}

model tb_area_parkir {
  id_area      Int            @id @default(autoincrement())
  nama_area    String         @db.VarChar(50)
  kapasitas    Int
  terisi       Int?           @default(0)
  is_active    Boolean        @default(true)
   
  // Relasi balik
  tb_transaksi tb_transaksi[]
}

model tb_tarif {
  id_tarif        Int            @id @default(autoincrement())
  jenis_kendaraan String         @db.VarChar(20)
  tarif_per_jam   Decimal        @db.Decimal(10, 0)
   
  tb_transaksi    tb_transaksi[]
}

model tb_user {
  id_user          Int                @id @default(autoincrement())
  nama_lengkap     String             @db.VarChar(50)
  username         String             @unique @db.VarChar(50)
  password         String             @db.VarChar(100)
  status_aktif     Int?               @default(1) @db.SmallInt
  role             user_role          @default(petugas)
   
  // Relasi Balik
  tb_transaksi     tb_transaksi[]
  tb_kendaraan     tb_kendaraan[]
  tb_log_aktivitas tb_log_aktivitas[]
}

model tb_kendaraan {
  id_kendaraan    Int       @id @default(autoincrement())
  plat_nomor      String    @unique @db.VarChar(15)
  jenis_kendaraan String    @db.VarChar(20)
  warna           String?   @db.VarChar(20)
  pemilik         String?   @db.VarChar(100)
  id_user         Int?      
  created_at      DateTime? @default(now()) @db.Timestamp(6)
    
  tb_user         tb_user?  @relation(fields: [id_user], references: [id_user], onDelete: NoAction, onUpdate: NoAction)
}

model tb_log_aktivitas {
  id_log          Int       @id @default(autoincrement())
  id_user         Int
  aktivitas       String    @db.VarChar(100)
  waktu_aktivitas DateTime? @default(now()) @db.Timestamp(6)

  tb_user         tb_user   @relation(fields: [id_user], references: [id_user], onDelete: Cascade, onUpdate: NoAction)
}

enum user_role {
  admin
  petugas
  owner
}
```

### 2. Koneksi Database (Prisma Client)
**File:** `src/lib/database/prisma.js`
```javascript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaGlobal = prisma
```

### 3. Logika Login (Authentication Actions)
**File:** `src/features/authentication/actions/login.actions.js`
```javascript
"use server";

import prisma from "@/lib/database/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { writeLog } from "@/features/logs/actions/log.action";

export async function loginAction(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return { error: "Username dan Password harus diisi!" };
  }

  const user = await prisma.tb_user.findFirst({
    where: { username: username },
  });

  if (!user || user.password !== password) {
    return { error: "Username atau Password salah!" };
  }

  const cookieStore = await cookies();

  cookieStore.set("session_user_id", user.id_user.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 minggu
    path: "/",
  });

  cookieStore.set("session_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  await writeLog(user.id_user, "Login ke sistem");

  if (user.role === "admin") {
    redirect("/dashboard/admin");
  } else if (user.role === "petugas") {
    redirect("/dashboard/petugas");
  } else if (user.role === "owner") {
    redirect("/dashboard/owner");
  }

  return { error: "Role tidak dikenali!" };
}

export async function logoutAction() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("session_user_id")?.value;
  if (userId) {
    await writeLog(userId, "Logout dari sistem");
  }

  cookieStore.delete("session_user_id");
  cookieStore.delete("session_role");

  redirect("/signin");
}
```

### 4. Halaman Login (UI)
**File:** `src/components/auth/sign-in-page.js`
*(Code sebagian untuk UI Login)*
```javascript
"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { loginAction } from "@/features/authentication/actions";
import styles from "./sign-in-page.module.css";

const initialState = { error: "" };

export function SignInPageView() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Masuk ke FlashPark</h1>
            <p className={styles.subtitle}>Sistem Manajemen Parkir Modern</p>

            <form action={formAction} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Masukkan username"
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            required
                            className={styles.input}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            <Image
                                src={showPassword ? "/content/password-on.svg" : "/content/password-off.svg"}
                                alt={showPassword ? "Hide password" : "Show password"}
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                </div>

                {state?.error && <div className={styles.error}>{state.error}</div>}

                <button type="submit" className={styles.button}>
                    Masuk Sekarang
                </button>
            </form>
        </div>
    );
}
```

### 5. Logika Check-In (Masuk Parkir)
**File:** `src/features/transactions/actions/check-in.action.js`
```javascript
"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { writeLog } from "@/features/logs/actions/log.action";

export async function checkInKendaraan(formData) {
    const plat = formData.get("plat_nomor").toUpperCase();
    const idTarif = parseInt(formData.get("id_tarif"));
    const idArea = parseInt(formData.get("id_area"));
    const idUser = parseInt(formData.get("id_user"));

    if (!plat || !idTarif || !idArea) {
        return { success: false, error: "Data tidak lengkap! Mohon isi semua field." };
    }

    try {
        await prisma.tb_transaksi.create({
            data: {
                plat_nomor: plat,
                id_tarif: idTarif,
                id_area: idArea,
                id_user: idUser,
                status: "masuk",
                waktu_masuk: new Date(),
            },
        });

        await prisma.tb_area_parkir.update({
            where: { id_area: idArea },
            data: { terisi: { increment: 1 } },
        });

        await writeLog(idUser, `Check-In Kendaraan: ${plat}`);

        revalidatePath("/dashboard/petugas");

        return { success: true };

    } catch (error) {
        console.error("Kesalahan sistem saat Check-In:", error);
        return { success: false, error: "Gagal memproses check-in. Coba lagi." };
    }
}
```

### 6. Logic Form Transaksi (UI)
**File:** `src/components/forms/transaction-form/index.js`
```javascript
"use client";
import Image from "next/image";
import { useState } from "react";
import { checkInKendaraan } from "@/features/transactions/actions";
import styles from "@/app/dashboard/petugas/styles.module.css";

export default function TransactionForm({ tarifList, areaList, userId }) {
    const [loading, setLoading] = useState(false);
    const [plat, setPlat] = useState("");
    const [selectedTarif, setSelectedTarif] = useState(null);

    const handlePlatChange = (e) => {
        let val = e.target.value.toUpperCase();
        setPlat(val);
    };

    async function handleSubmit(formData) {
        setLoading(true);
        const result = await checkInKendaraan(formData);

        if (result.success) {
            window.location.reload();
        } else {
            alert("Gagal: " + result.error);
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit}>
            <div>
                <label className={styles.platLabel}>MASUKKAN PLAT NOMOR</label>
                <input
                    className={styles.inputPlat}
                    name="plat_nomor"
                    type="text"
                    placeholder="D 1234 ABC"
                    required
                    autoComplete="off"
                    maxLength={11}
                    value={plat}
                    onChange={handlePlatChange}
                />
            </div>

            {/* Bagian Pilihan Kendaraan & Area disederhanakan untuk lampiran */}
            <input type="hidden" name="id_user" value={userId} />

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? "Memproses..." : "Cetak Karcis Masuk"}
            </button>
        </form>
    );
}
```

### 7. Logika Check-Out (Keluar Parkir & Biaya)
**File:** `src/features/transactions/actions/check-out.action.js`
```javascript
"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { writeLog } from "@/features/logs/actions/log.action";
import { cookies } from "next/headers";

export async function checkoutKendaraan(id_parkir, total_bayar, id_area) {
    try {
        const res = await prisma.tb_transaksi.update({
            where: { id_parkir: parseInt(id_parkir) },
            data: {
                waktu_keluar: new Date(),
                biaya_total: total_bayar,
                status: 'keluar'
            },
            select: { plat_nomor: true }
        });

        await prisma.tb_area_parkir.update({
            where: { id_area: parseInt(id_area) },
            data: { terisi: { decrement: 1 } }
        });

        const cookieStore = await cookies();
        const userId = cookieStore.get("session_user_id")?.value;

        if (userId) {
            await writeLog(userId, `Check-Out Kendaraan: ${res.plat_nomor}`);
        }

        revalidatePath("/dashboard/petugas/keluar");
        return { success: true };

    } catch (error) {
        console.error("Kesalahan sistem saat Checkout:", error);
        return { success: false, error: "Gagal memproses checkout." };
    }
}
```

### 8. Sistem Checkout UI (Hitung Biaya)
**File:** `src/features/transactions/components/checkout/index.js`
*(Code bagian perhitungan biaya)*
```javascript
    // 2. hitung biaya parkir
    const calculateCost = () => {
        if (!data) return null;

        const masuk = new Date(data.waktu_masuk);
        const keluar = new Date();
        const diffMs = keluar - masuk;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

        // minimal bayar 1 jam
        const jamBayar = diffHours < 1 ? 1 : diffHours;

        // hitung total bayar
        const total = jamBayar * data.tb_tarif.tarif_per_jam;

        return {
            keluarTime: keluar,
            durasiJam: jamBayar,
            totalBayar: total
        };
    };
```

### 9. Manajemen User (CRUD)
**File:** `src/features/users/actions/manage-users.actions.js`
```javascript
"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";

export async function createUser(prevState, formData) {
    const nama = formData.get("nama");
    const username = formData.get("username");
    const password = formData.get("password");
    const role = formData.get("role");

    try {
        await prisma.tb_user.create({
            data: {
                nama_lengkap: nama,
                username: username,
                password: password,
                role: role,
                status_aktif: 1,
            },
        });
    } catch (err) {
        return { error: "Gagal membuat user. Username mungkin sudah ada." };
    }

    revalidatePath("/dashboard/admin/users");
}

export async function deleteUser(formData) {
    const id = formData.get("id");
    await prisma.tb_user.delete({
        where: { id_user: parseInt(id) },
    });
    revalidatePath("/dashboard/admin/users");
}
```

### 10. Fitur Laporan Pendapatan (Reporting)
**File:** `src/features/reports/actions/get-owner-reports.action.js`
```javascript
"use server";
import prisma from "@/lib/database/prisma";

export async function getOwnerStats(params = {}) {
    const { startDate, endDate } = params;
    let whereClause = { status: 'keluar' };

    // ... (logic filter tanggal disederhanakan)

    const revenueStats = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: whereClause
    });

    const totalTx = await prisma.tb_transaksi.count({
        where: whereClause
    });

    return {
        today: parseInt(revenueStats._sum.biaya_total || 0),
        totalTransactions: totalTx
    };
}
```

---

## 📌 BAGIAN B: DAFTAR SCREENSHOT (BUKTI TAMPILAN)

Ambil screenshot untuk halaman-halaman berikut ini:

### 1. Akses Publik
1. **Halaman Login**: Kondisi form kosong.
2. **Validasi Login**: Tampilan pesan error saat password salah.

### 2. Dashboard Petugas (Role: Petugas)
3. **Menu Masuk (Check-In)**: Tampilan form input plat nomor & pilihan jenis kendaraan.
4. **Proses Check-In Berhasil**: Notifikasi sukses setelah kendaraan masuk.
5. **Menu Keluar (Check-Out)**: Tampilan daftar kendaraan yang sedang parkir.
6. **Detail Transaksi**: Tampilan saat salah satu kendaraan dipilih untuk keluar (Total Biaya muncul).
7. **Modal Struk**: Tampilan struk virtual/tiket parkir.

### 3. Dashboard Admin (Role: Admin)
8. **Dashboard Utama**: Menampilkan summary card (Total Slot, Total Terisi).
9. **Manajemen User**: Tabel daftar user & modal tambah user.
10. **Manajemen Tarif**: Form setting harga parkir (Mobil/Motor).
11. **Manajemen Area**: Status kapasitas per area/lantai.

### 4. Dashboard Owner (Role: Owner)
12. **Laporan Pendapatan**: Grafik pendapatan dan ringkasan cash flow.
13. **Riwayat Transaksi**: Tabel log semua transaksi yang pernah terjadi.

---

## 📌 BAGIAN C: DOKUMENTASI PENDUKUNG

Dokumen ini sudah tersedia di dalam proyek:
1. **`PROJECT_EXPLANATION.md`** - Penjelasan alur sistem.
2. **`TEKNOLOGI.md`** - Daftar teknologi (Next.js, Prisma, PostgreSQL).
3. **`TESTING.md`** - Tabel pengujian Black Box.
