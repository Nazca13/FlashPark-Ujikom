/**
 * ============================================================================
 * CHECK USERS SCRIPT - check_users.js
 * ============================================================================
 * Script utility (alat bantu) untuk mengecek data user di database.
 * Dijalankan manual dari terminal dengan perintah: node check_users.js
 * 
 * Berguna untuk debugging: memastikan data user sudah masuk ke database
 * atau untuk cek apakah koneksi database berjalan dengan benar.
 * 
 * CATATAN: Script ini BUKAN bagian dari aplikasi web, hanya tool tambahan.
 * 
 * @module CheckUsers
 * ============================================================================
 */

// import PrismaClient dari package @prisma/client
// PrismaClient = class yang menyediakan fungsi-fungsi untuk query database
import { PrismaClient } from '@prisma/client';

// buat instance baru PrismaClient (koneksi ke database)
const prisma = new PrismaClient();

/**
 * main - Fungsi utama untuk mengambil dan menampilkan semua user
 * 
 * Mengambil seluruh data dari tabel tb_user dan print ke console
 * dalam format JSON yang rapi (indentasi 2 spasi)
 */
async function main() {
    // ambil semua data user dari tabel tb_user
    const users = await prisma.tb_user.findMany();

    // tampilkan label
    console.log('Users in database:');

    // tampilkan data user dalam format JSON yang rapi
    // JSON.stringify(data, null, 2) = konversi object ke string JSON dengan indentasi 2 spasi
    console.log(JSON.stringify(users, null, 2));
}

// jalankan fungsi main
main()
    .catch((e) => {
        // kalau ada error, tampilkan errornya dan keluar dengan kode 1 (gagal)
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // setelah selesai (sukses atau gagal), tutup koneksi database
        // penting! kalau tidak ditutup, proses Node.js tidak akan berhenti
        await prisma.$disconnect();
    });
