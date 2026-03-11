/**
 * ============================================================================
 * SEARCH VEHICLE ACTION - src/features/transactions/actions/search-vehicle.action.js
 * ============================================================================
 * Server action untuk mencari kendaraan yang sedang parkir berdasarkan plat nomor.
 * Dipakai di halaman checkout petugas saat mengetik plat nomor untuk checkout.
 * 
 * @module SearchVehicleAction
 * @path /dashboard/petugas/keluar (fitur pencarian)
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

/**
 * searchKendaraanMasuk - Mencari kendaraan yang sedang parkir (status = "masuk")
 * 
 * Mencari di database berdasarkan plat nomor (partial match / "contains").
 * Hanya mencari kendaraan yang statusnya "masuk" (belum checkout).
 * 
 * @param {string} plat - Plat nomor yang dicari (bisa sebagian, misal "D 1234")
 * @returns {Object} - { success: true, data: {...} } jika ditemukan,
 *                      { success: false, error: "..." } jika tidak ditemukan
 */
export async function searchKendaraanMasuk(plat) {
    try {
        // cari kendaraan pertama yang cocok (findFirst = ambil 1 saja)
        const data = await prisma.tb_transaksi.findFirst({
            where: {
                plat_nomor: {
                    contains: plat.toUpperCase()   // pencarian partial match (berisi plat yang diketik)
                    // toUpperCase() = pastikan pencarian case-insensitive (huruf besar)
                },
                status: 'masuk'                     // hanya cari yang statusnya masih parkir
            },
            include: {
                tb_tarif: true,         // sertakan data tarif (jenis kendaraan, harga per jam)
                tb_area_parkir: true    // sertakan data area (nama area, kapasitas)
            }
        });

        // kalau tidak ditemukan, return error
        if (!data) {
            return { success: false, error: "Kendaraan tidak ditemukan atau sudah keluar." };
        }

        // ===== KONVERSI DATA DECIMAL KE NUMBER =====
        // Prisma mengembalikan tipe Decimal untuk kolom Decimal di database
        // Decimal tidak bisa langsung dikirim dari Server ke Client Component
        // Solusi: konversi ke Number/parseInt agar aman untuk serialisasi
        const safeData = {
            ...data,                    // copy semua field transaksi
            tb_tarif: {
                ...data.tb_tarif,       // copy semua field tarif
                tarif_per_jam: parseInt(data.tb_tarif.tarif_per_jam)  // konversi Decimal → Number
            }
        };

        // return data yang sudah aman untuk Client Component
        return { success: true, data: safeData };

    } catch (error) {
        // kalau ada error sistem, log dan return error message
        console.error("Kesalahan sistem saat mencari kendaraan:", error);
        return { success: false, error: "Terjadi kesalahan server." };
    }
}
