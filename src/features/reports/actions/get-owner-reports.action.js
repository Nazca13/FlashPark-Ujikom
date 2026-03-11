/**
 * ============================================================================
 * GET OWNER REPORTS ACTION - src/features/reports/actions/get-owner-reports.action.js
 * ============================================================================
 * Server actions untuk mengambil data laporan keuangan dashboard Owner.
 * 
 * Fungsi-fungsi:
 * 1. getOwnerStats() - Statistik ringkasan (pendapatan hari ini/bulan, total transaksi)
 * 2. getRevenueChartData() - Data grafik pendapatan harian (bar chart)
 * 
 * Kedua fungsi mendukung filter range tanggal (startDate - endDate).
 * 
 * @module GetOwnerReportsAction
 * @path /dashboard/owner
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

/**
 * getOwnerStats - Mengambil statistik ringkasan pendapatan untuk dashboard owner
 * 
 * Mengembalikan 3 data utama:
 * - Pendapatan hari ini (atau pendapatan dalam range filter)
 * - Pendapatan bulan ini (selalu dihitung dari awal bulan)
 * - Total transaksi kendaraan keluar
 * 
 * @param {Object} params - Parameter filter (opsional)
 * @param {string} [params.startDate] - Tanggal mulai filter (YYYY-MM-DD)
 * @param {string} [params.endDate] - Tanggal selesai filter (YYYY-MM-DD)
 * @returns {Object} - { today: number, month: number, totalTransactions: number }
 */
export async function getOwnerStats(params = {}) {
    // ambil parameter tanggal dari filter (jika ada)
    const { startDate, endDate } = params;

    // ===== BANGUN FILTER QUERY =====
    // default: hanya transaksi yang sudah keluar (sudah bayar)
    let whereClause = { status: 'keluar' };

    // logika filter tanggal
    if (startDate && endDate) {
        // kalau user pilih range tanggal tertentu
        whereClause.waktu_keluar = {
            gte: new Date(startDate),                                     // dari tanggal mulai (jam 00:00)
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))    // sampai akhir hari tanggal selesai
        };
    } else {
        // default: filter hanya data hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);                   // set ke jam 00:00:00
        whereClause.waktu_keluar = { gte: today };      // dari jam 00:00 hari ini sampai sekarang
    }

    // ===== QUERY 1: TOTAL PENDAPATAN (SESUAI FILTER) =====
    // aggregate _sum = jumlahkan semua biaya_total yang sesuai filter
    const revenueStats = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: whereClause
    });

    // ===== QUERY 2: PENDAPATAN BULAN INI =====
    // Selalu dihitung dari tanggal 1 bulan ini (tidak terpengaruh filter tanggal custom)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // tanggal 1 bulan ini
    const revenueMonth = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: {
            waktu_keluar: { gte: startOfMonth },  // dari awal bulan
            status: 'keluar'                        // hanya yang sudah keluar
        }
    });

    // ===== QUERY 3: TOTAL JUMLAH TRANSAKSI =====
    const totalTx = await prisma.tb_transaksi.count({
        where: whereClause                          // hitung sesuai filter yang sama
    });

    // ===== RETURN DATA STATISTIK =====
    return {
        today: parseInt(revenueStats._sum.biaya_total || 0),     // pendapatan sesuai filter (default: hari ini)
        month: parseInt(revenueMonth._sum.biaya_total || 0),     // pendapatan bulan ini
        totalTransactions: totalTx                                // total kendaraan keluar
    };
}

/**
 * getRevenueChartData - Mengambil data untuk grafik pendapatan harian
 * 
 * Mengembalikan array data pendapatan per hari untuk ditampilkan sebagai bar chart.
 * Default: 7 hari terakhir. Bisa difilter dengan startDate dan endDate.
 * 
 * @param {Object} params - Parameter filter (opsional)
 * @param {string} [params.startDate] - Tanggal mulai (YYYY-MM-DD)
 * @param {string} [params.endDate] - Tanggal selesai (YYYY-MM-DD)
 * @returns {Array} - Array: [{ date: "09 Feb", revenue: 150000 }, ...]
 */
export async function getRevenueChartData(params = {}) {
    const { startDate, endDate } = params;
    const chartData = [];     // array untuk menyimpan data grafik

    // ===== TENTUKAN RANGE TANGGAL =====
    // kalau ada filter, pakai filter. kalau tidak, default hari ini
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // kalau tidak ada filter startDate, mundur 6 hari dari hari ini (total 7 hari)
    if (!startDate) {
        start.setDate(start.getDate() - 6);    // 6 hari lalu
    }

    // set waktu ke awal hari (start) dan akhir hari (end)
    start.setHours(0, 0, 0, 0);                // 00:00:00.000
    end.setHours(23, 59, 59, 999);              // 23:59:59.999

    // ===== LOOP SETIAP HARI DALAM RANGE =====
    let current = new Date(start);
    while (current <= end) {
        // tanggal hari ini dalam loop
        const d = new Date(current);
        // tanggal besok (untuk filter "kurang dari besok")
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);

        // ===== QUERY PENDAPATAN UNTUK HARI INI =====
        // aggregate _sum biaya_total untuk transaksi keluar di hari ini
        const revenue = await prisma.tb_transaksi.aggregate({
            _sum: { biaya_total: true },
            where: {
                waktu_keluar: {
                    gte: d,         // dari jam 00:00 hari ini
                    lt: nextDay     // sampai sebelum jam 00:00 besok (lt = less than)
                },
                status: 'keluar'    // hanya transaksi yang sudah selesai
            }
        });

        // ===== TAMBAHKAN DATA KE ARRAY GRAFIK =====
        chartData.push({
            // format tanggal jadi "09 Feb" (Indonesia format)
            date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            // pendapatan hari itu (konversi Decimal → integer, default 0 jika null)
            revenue: parseInt(revenue._sum.biaya_total || 0)
        });

        // geser ke hari berikutnya
        current.setDate(current.getDate() + 1);
    }

    // return array data grafik
    return chartData;
}
