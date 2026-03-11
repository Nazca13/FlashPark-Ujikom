/**
 * ============================================================================
 * CHECK-OUT ACTION - src/features/transactions/actions/check-out.action.js
 * ============================================================================
 * Server action untuk proses kendaraan KELUAR parkir (checkout).
 * 
 * Alur checkout:
 * 1. Update transaksi: set waktu keluar, biaya total, status jadi "keluar"
 * 2. Update area parkir: kurangi 1 slot terisi (slot jadi kosong lagi)
 * 3. Catat log aktivitas checkout
 * 4. Refresh halaman checkout petugas
 * 
 * @module CheckOutAction
 * @path /dashboard/petugas/keluar
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

// import revalidatePath untuk refresh cache halaman
import { revalidatePath } from "next/cache";

// import fungsi writeLog untuk mencatat aktivitas
import { writeLog } from "@/features/logs/actions/log.action";

// import cookies untuk mengambil data session user dari cookie browser
import { cookies } from "next/headers";

/**
 * checkoutKendaraan - Proses kendaraan keluar parkir
 * 
 * @param {number} id_parkir - ID transaksi parkir yang akan di-checkout
 * @param {number} total_bayar - Total biaya parkir yang harus dibayar
 * @param {number} id_area - ID area parkir (untuk update slot terisi)
 * @returns {Object} - { success: true } jika berhasil, { success: false, error: "..." } jika gagal
 */
export async function checkoutKendaraan(id_parkir, total_bayar, id_area) {
    try {
        // ===== 1. UPDATE DATA TRANSAKSI =====
        // set waktu keluar, biaya total, dan ubah status jadi "keluar"
        const res = await prisma.tb_transaksi.update({
            where: { id_parkir: parseInt(id_parkir) },  // cari transaksi berdasarkan ID
            data: {
                waktu_keluar: new Date(),    // catat waktu keluar (sekarang)
                biaya_total: total_bayar,     // simpan total biaya yang dihitung
                status: 'keluar'              // ubah status dari "masuk" jadi "keluar"
            },
            // select plat_nomor agar bisa dicatat di log
            select: { plat_nomor: true }     // hanya ambil plat nomor dari hasil update
        });

        // ===== 2. UPDATE SLOT AREA PARKIR =====
        // kurangi 1 dari kolom "terisi" (kendaraan sudah keluar, slot jadi kosong)
        await prisma.tb_area_parkir.update({
            where: { id_area: parseInt(id_area) },       // cari area berdasarkan ID
            data: {
                terisi: { decrement: 1 }                  // kurangi 1 slot terisi
            }
        });

        // ===== 3. CATAT LOG AKTIVITAS =====
        // ambil ID user (petugas) dari session cookie
        const cookieStore = await cookies();                        // akses cookie store
        const userId = cookieStore.get("session_user_id")?.value;  // ambil value cookie "session_user_id"
        // ?. = optional chaining: kalau cookie tidak ada, return undefined (tidak error)

        // hanya catat log kalau ada user ID di cookie
        if (userId) {
            await writeLog(userId, `Check-Out Kendaraan: ${res.plat_nomor}`);
        }

        // ===== 4. REFRESH HALAMAN =====
        revalidatePath("/dashboard/petugas/keluar"); // refresh halaman checkout

        // return sukses
        return { success: true };

    } catch (error) {
        // kalau ada error, log dan return error message
        console.error("Kesalahan sistem saat Checkout:", error);
        return { success: false, error: "Gagal memproses checkout." };
    }
}
