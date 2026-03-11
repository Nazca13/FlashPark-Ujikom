/**
 * ============================================================================
 * GET DASHBOARD DATA ACTION - src/features/reports/actions/get-dashboard-data.action.js
 * ============================================================================
 * Server action untuk mengambil data statistik dashboard Admin.
 * Menyediakan data untuk:
 * 1. Kartu statistik (pendapatan, kendaraan masuk, sisa slot, total petugas)
 * 2. Tabel 5 transaksi terbaru (dengan filter opsional)
 * 
 * Filter yang didukung:
 * - query: pencarian plat nomor (partial match)
 * - date: filter tanggal tertentu
 * - vehicle: filter jenis kendaraan (Mobil/Motor/Truk)
 * 
 * @module GetDashboardDataAction
 * @path /dashboard/admin
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

// import revalidatePath (tersedia tapi tidak dipakai di fungsi ini)
import { revalidatePath } from "next/cache";

/**
 * getDashboardData - Mengambil data lengkap untuk dashboard admin
 * 
 * @param {Object} params - Parameter filter dari URL search params
 * @param {string} [params.query] - Pencarian plat nomor (opsional)
 * @param {string} [params.date] - Filter tanggal format YYYY-MM-DD (opsional)
 * @param {string} [params.vehicle] - Filter jenis kendaraan (opsional)
 * @returns {Object} - { transaksi: [...], stats: { pendapatan, kendaraanMasuk, sisaSlot, totalPetugas } }
 */
export async function getDashboardData(params = {}) {
    // destructure parameter filter dari URL
    const { query, date, vehicle } = params;

    // ===== 1. BANGUN FILTER QUERY =====
    // whereClause = object filter dinamis untuk Prisma query
    const whereClause = {};

    // filter pencarian plat nomor (jika ada)
    if (query) {
        // contains = pencarian partial match (plat nomor mengandung teks yang dicari)
        whereClause.plat_nomor = { contains: query };
    }

    // filter tanggal (jika ada)
    if (date) {
        // buat range tanggal: dari jam 00:00:00 sampai 23:59:59 di tanggal yang dipilih
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);        // awal hari (00:00:00.000)
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);      // akhir hari (23:59:59.999)

        // filter transaksi berdasarkan waktu masuk dalam range tanggal
        whereClause.waktu_masuk = {
            gte: startDate,    // gte = greater than or equal (>=)
            lte: endDate       // lte = less than or equal (<=)
        };
    }

    // filter jenis kendaraan (jika bukan "Semua")
    if (vehicle && vehicle !== 'Semua') {
        // filter melalui relasi tb_tarif (jenis kendaraan ada di tabel tarif)
        whereClause.tb_tarif = {
            jenis_kendaraan: vehicle
        };
    }

    // ===== 2. AMBIL 5 TRANSAKSI TERBARU =====
    // Untuk tabel transaksi di dashboard (dengan filter yang berlaku)
    const transaksiTerbaru = await prisma.tb_transaksi.findMany({
        where: whereClause,                   // terapkan filter
        take: 5,                               // ambil maksimal 5 data
        orderBy: {
            waktu_masuk: 'desc',               // urutkan dari yang terbaru
        },
        include: {
            tb_user: true,                     // sertakan data petugas (nama)
            tb_tarif: true                     // sertakan data tarif (jenis kendaraan)
        }
    });

    // ===== 3. HITUNG STATISTIK =====

    // Total Pendapatan: jumlahkan semua biaya_total dari seluruh transaksi
    const totalPendapatan = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true }            // aggregate SUM pada kolom biaya_total
    });

    // Kendaraan Masuk: hitung jumlah transaksi dengan status "masuk"
    const kendaraanMasuk = await prisma.tb_transaksi.count({
        where: { status: 'masuk' }             // hanya yang sedang parkir
    });

    // Total Petugas: hitung jumlah user dengan role "petugas"
    const totalPetugas = await prisma.tb_user.count({
        where: { role: 'petugas' }             // hanya yang role-nya petugas
    });

    // Sisa Slot: hitung dari selisih kapasitas total - total terisi di semua area
    const areaData = await prisma.tb_area_parkir.aggregate({
        _sum: {
            kapasitas: true,                   // jumlahkan semua kapasitas area
            terisi: true                       // jumlahkan semua slot yang terisi
        }
    });

    // hitung sisa slot = total kapasitas - total terisi
    // || 0 = fallback ke 0 jika null/undefined
    const sisaSlot = (areaData._sum.kapasitas || 0) - (areaData._sum.terisi || 0);

    // ===== 4. RETURN DATA =====
    return {
        transaksi: transaksiTerbaru,           // array 5 transaksi terbaru
        stats: {
            pendapatan: totalPendapatan._sum.biaya_total || 0,  // total pendapatan (Rp)
            kendaraanMasuk,                    // jumlah kendaraan yang sedang parkir
            sisaSlot,                          // sisa kapasitas parkir
            totalPetugas                       // jumlah petugas terdaftar
        }
    };
}
