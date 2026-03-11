/**
 * ============================================================================
 * LOG ACTIVITY ACTION - src/features/logs/actions/log.action.js
 * ============================================================================
 * Server action untuk mencatat aktivitas user ke tabel log.
 * Dipakai sebagai "audit trail" — mencatat siapa melakukan apa dan kapan.
 * 
 * Contoh catatan log:
 * - "Login ke sistem"
 * - "Check-In Kendaraan: D 1234 ABC"
 * - "Check-Out Kendaraan: D 1234 ABC"
 * - "Logout dari sistem"
 * 
 * CATATAN: Fungsi ini TIDAK boleh menyebabkan error di fitur utama.
 * Kalau gagal menulis log, error hanya dicatat di console (silent fail).
 * 
 * @module LogAction
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

/**
 * writeLog - Mencatat aktivitas user ke tabel tb_log_aktivitas
 * 
 * @param {number|string} id_user - ID user yang melakukan aktivitas
 * @param {string} aktivitas - Deskripsi aktivitas (contoh: "Check-In Kendaraan: D 1234 ABC")
 * @returns {void} - Tidak return apa-apa (fire and forget)
 */
export async function writeLog(id_user, aktivitas) {
    // validasi: kalau id_user atau aktivitas kosong, jangan lanjut
    if (!id_user || !aktivitas) return;

    try {
        // simpan log ke tabel tb_log_aktivitas
        await prisma.tb_log_aktivitas.create({
            data: {
                id_user: parseInt(id_user),      // ID user (konversi ke integer)
                aktivitas: aktivitas,              // deskripsi aktivitas
                waktu_aktivitas: new Date()        // waktu saat aktivitas terjadi (sekarang)
            }
        });
    } catch (error) {
        // SILENT FAIL: hanya log error ke console, JANGAN throw error
        // Alasan: logging gagal tidak boleh mengganggu operasi utama (check-in/checkout/login)
        // Kalau throw error di sini, check-in/checkout/login bisa ikut gagal
        console.error("Failed to write log:", error);
    }
}
