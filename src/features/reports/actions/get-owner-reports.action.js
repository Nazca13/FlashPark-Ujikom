"use server";

import prisma from "@/lib/database/prisma";

// fungsi untuk ambil statistik ringkasan (hari ini, bulan ini, total transaksi)
export async function getOwnerStats(params = {}) {
    const { startDate, endDate } = params;

    // default filter: hanya transaksi yang statusnya 'keluar' (sudah bayar)
    let whereClause = { status: 'keluar' };

    // logika filter tanggal (kalau ada input dari user)
    if (startDate && endDate) {
        whereClause.waktu_keluar = {
            gte: new Date(startDate), // lebih besar dari start date
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // sampai akhir hari end date
        };
    } else {
        // default: filter data hari ini saja
        const today = new Date();
        today.setHours(0, 0, 0, 0); // set jam ke 00:00:00
        whereClause.waktu_keluar = { gte: today };
    }

    // hitung total pendapatan berdasarkan filter (hari ini atau range tanggal)
    const revenueStats = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true }, // jumlahkan kolom biaya_total
        where: whereClause
    });

    // hitung pendapatan bulan ini (selalu dihitung terpisah dari filter tanggalcustom)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // tanggal 1 bulan ini
    const revenueMonth = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: {
            waktu_keluar: { gte: startOfMonth },
            status: 'keluar'
        }
    });

    // hitung total jumlah transaksi kendaraan
    const totalTx = await prisma.tb_transaksi.count({
        where: whereClause
    });

    // kembalikan object statistik
    return {
        today: parseInt(revenueStats._sum.biaya_total || 0),
        month: parseInt(revenueMonth._sum.biaya_total || 0),
        totalTransactions: totalTx
    };
}

// fungsi untuk ambil data grafik pendapatan (default 7 hari terakhir)
export async function getRevenueChartData(params = {}) {
    const { startDate, endDate } = params;
    const chartData = [];

    // tentukan range tanggal grafik
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // kalau ga ada filter, default ambil 7 hari ke belakang dari hari ini
    if (!startDate) {
        start.setDate(start.getDate() - 6);
    }

    // reset jam start ke awal hari & end ke akhir hari
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // loop setiap hari dari start sumpai end date
    let current = new Date(start);
    while (current <= end) {
        const d = new Date(current);
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1); // hari esok

        // query total pendapatan user specific tanggal 'd'
        const revenue = await prisma.tb_transaksi.aggregate({
            _sum: { biaya_total: true },
            where: {
                waktu_keluar: {
                    gte: d, // mulai dari jam 00:00 hari ini
                    lt: nextDay // sampai sebelum jam 00:00 besok
                },
                status: 'keluar'
            }
        });

        // format tanggal jadi "30 Jan" (sesuai request)
        // push data ke array chartData
        chartData.push({
            date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            revenue: parseInt(revenue._sum.biaya_total || 0)
        });

        // geser ke hari berikutnya
        current.setDate(current.getDate() + 1);
    }

    return chartData;
}
