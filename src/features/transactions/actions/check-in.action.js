/**
 * ============================================================================
 * CHECK-IN ACTION - src/features/transactions/actions/check-in.action.js
 * ============================================================================
 * Server action untuk proses kendaraan MASUK parkir (check-in).
 * 
 * Alur check-in:
 * 1. Ambil data dari form (plat nomor, jenis kendaraan, area, petugas)
 * 2. Validasi kelengkapan data
 * 3. Simpan transaksi baru ke database (status: "masuk")
 * 4. Update slot area parkir (+1 terisi)
 * 5. Catat log aktivitas
 * 6. Refresh halaman dashboard petugas
 * 
 * @module CheckInAction
 * @path /dashboard/petugas (form kendaraan masuk)
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

// import revalidatePath untuk refresh cache halaman
import { revalidatePath } from "next/cache";

// import fungsi writeLog untuk mencatat aktivitas ke tabel log
import { writeLog } from "@/features/logs/actions/log.action";

/**
 * checkInKendaraan - Proses kendaraan masuk parkir
 * 
 * @param {FormData} formData - Data form berisi plat_nomor, id_tarif, id_area, id_user
 * @returns {Object} - { success: true } jika berhasil, { success: false, error: "..." } jika gagal
 */
export async function checkInKendaraan(formData) {
    // ===== 1. AMBIL DATA DARI FORM =====
    const plat = formData.get("plat_nomor").toUpperCase();  // plat nomor, paksa uppercase (D 1234 ABC)
    const idTarif = parseInt(formData.get("id_tarif"));     // ID tarif (motor/mobil/dll)
    const idArea = parseInt(formData.get("id_area"));       // ID area parkir yang dipilih
    const idUser = parseInt(formData.get("id_user"));       // ID petugas yang sedang bertugas

    // ===== 2. VALIDASI DATA =====
    // pastikan semua field terisi, kalau ada yang kosong return error
    if (!plat || !idTarif || !idArea) {
        return { success: false, error: "Data tidak lengkap! Mohon isi semua field." };
    }

    try {
        // ===== 3. SIMPAN TRANSAKSI BARU =====
        // buat record baru di tabel tb_transaksi
        await prisma.tb_transaksi.create({
            data: {
                plat_nomor: plat,          // plat nomor kendaraan
                id_tarif: idTarif,         // tarif berdasarkan jenis kendaraan
                id_area: idArea,           // area tempat parkir
                id_user: idUser,           // petugas yang melayani
                status: "masuk",           // status transaksi = masuk (belum keluar)
                waktu_masuk: new Date(),   // catat waktu saat kendaraan masuk
            },
        });

        // ===== 4. UPDATE SLOT AREA PARKIR =====
        // tambah 1 ke kolom "terisi" di area yang dipilih
        // increment: 1 = operasi atomik (aman dari race condition)
        await prisma.tb_area_parkir.update({
            where: { id_area: idArea },           // cari area berdasarkan ID
            data: { terisi: { increment: 1 } },   // tambah 1 slot terisi
        });

        // ===== 5. CATAT LOG AKTIVITAS =====
        // simpan catatan bahwa ada kendaraan masuk (untuk audit trail)
        await writeLog(idUser, `Check-In Kendaraan: ${plat}`);

        // ===== 6. REFRESH HALAMAN =====
        // refresh cache halaman petugas agar list kendaraan terbaru muncul
        revalidatePath("/dashboard/petugas");

        // return sukses
        return { success: true };

    } catch (error) {
        // kalau ada error, log ke console dan return error message
        console.error("Kesalahan sistem saat Check-In:", error);
        return { success: false, error: "Gagal memproses check-in. Coba lagi." };
    }
}
