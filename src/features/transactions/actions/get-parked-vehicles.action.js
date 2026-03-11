/**
 * ============================================================================
 * GET PARKED VEHICLES ACTION - src/features/transactions/actions/get-parked-vehicles.action.js
 * ============================================================================
 * Server action untuk mengambil daftar SEMUA kendaraan yang sedang parkir.
 * Dipakai di halaman checkout petugas untuk menampilkan list kendaraan
 * yang bisa di-checkout.
 * 
 * @module GetParkedVehiclesAction
 * @path /dashboard/petugas/keluar
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

/**
 * getParkedVehicles - Mengambil semua kendaraan yang sedang parkir
 * 
 * Mengambil transaksi dengan status "masuk" (belum checkout), 
 * termasuk data tarif dan area parkir, diurutkan dari yang terbaru.
 * 
 * @returns {Object} - { success: true, data: [...] } jika berhasil,
 *                      { success: false, error: "..." } jika gagal
 */
export async function getParkedVehicles() {
    try {
        // ambil semua transaksi yang statusnya "masuk" (sedang parkir)
        const data = await prisma.tb_transaksi.findMany({
            where: { status: 'masuk' },     // filter: hanya yang sedang parkir
            include: {
                tb_tarif: true,              // sertakan data tarif (jenis kendaraan, harga)
                tb_area_parkir: true          // sertakan data area (nama area)
            },
            orderBy: { waktu_masuk: 'desc' } // urutkan dari yang paling baru masuk
        });

        // ===== KONVERSI DECIMAL KE NUMBER =====
        // Prisma Decimal harus dikonversi ke Number agar bisa dikirim ke Client Component
        // Kalau tidak dikonversi, akan error: "Decimal is not serializable"
        const safeData = data.map(item => ({
            ...item,                       // copy semua field transaksi
            tb_tarif: {
                ...item.tb_tarif,          // copy semua field tarif
                tarif_per_jam: Number(item.tb_tarif.tarif_per_jam)  // konversi Decimal → Number
            }
        }));

        // return data yang sudah aman untuk client
        return { success: true, data: safeData };

    } catch (error) {
        // kalau gagal ambil data, log dan return error
        console.error("Gagal mengambil daftar kendaraan parkir:", error);
        return { success: false, error: "Gagal mengambil data dari server." };
    }
}
