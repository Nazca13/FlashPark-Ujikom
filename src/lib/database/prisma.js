/**
 * ============================================================================
 * PRISMA CLIENT SINGLETON - src/lib/database/prisma.js
 * ============================================================================
 * File ini membuat koneksi database SINGLETON menggunakan Prisma + PostgreSQL.
 * 
 * SINGLETON = hanya ada 1 instance koneksi database di seluruh aplikasi.
 * Kenapa singleton? Kalau tidak, setiap request bisa bikin koneksi baru,
 * dan akhirnya kehabisan koneksi (connection limit exceeded).
 * 
 * Alur koneksi:
 * 1. Buat Pool (kumpulan koneksi) PostgreSQL pakai library "pg"
 * 2. Buat adapter PrismaPg (jembatan antara Prisma dan pg)
 * 3. Buat PrismaClient dengan adapter tersebut
 * 4. Simpan di globalThis agar tidak dibuat ulang saat hot reload (dev mode)
 * 
 * @module PrismaClient
 * ============================================================================
 */

// import PrismaClient = class utama untuk query database
import { PrismaClient } from '@prisma/client'

// import PrismaPg = adapter (jembatan) agar Prisma bisa pakai driver "pg" langsung
// ini dipakai karena kita menyalakan fitur "driverAdapters" di schema.prisma
import { PrismaPg } from '@prisma/adapter-pg'

// import Pool = connection pool dari library "pg" (node-postgres)
// Pool = kumpulan koneksi database yang siap pakai (lebih efisien daripada buka-tutup koneksi)
import { Pool } from 'pg'

/**
 * prismaClientSingleton - Fungsi untuk membuat instance PrismaClient baru
 * 
 * Dipanggil hanya SEKALI (pertama kali dibutuhkan), setelah itu instance
 * disimpan di globalThis agar bisa dipakai ulang.
 * 
 * @returns {PrismaClient} - Instance PrismaClient yang sudah terhubung ke database
 */
const prismaClientSingleton = () => {
    // buat pool koneksi PostgreSQL dengan URL dari file .env
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })

    // buat adapter PrismaPg yang menghubungkan Prisma dengan pool pg
    const adapter = new PrismaPg(pool)

    // buat dan return PrismaClient baru dengan adapter
    return new PrismaClient({ adapter })
}

// globalForPrisma = referensi ke object global (window di browser, global di Node.js)
// dipakai untuk menyimpan instance Prisma agar bertahan antar hot reload
const globalForPrisma = globalThis

// ambil instance Prisma dari global (kalau sudah ada) ATAU buat baru
// ?? = nullish coalescing: kalau kiri null/undefined, pakai kanan
const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton()

// export default: bisa dipakai dengan import prisma from "@/lib/database/prisma"
export default prisma

// HANYA di development mode: simpan instance ke globalThis
// ini mencegah hot reload membuat instance baru setiap kali file berubah
// di production, PrismaClient dibuat sekali saja (tidak perlu global)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaGlobal = prisma