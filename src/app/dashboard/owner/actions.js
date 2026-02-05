"use server";
import prisma from "@/lib/database/prisma";

// 1. Ambil Statistik Ringkasan (Card Atas)
export async function getOwnerStats(params = {}) {
    const { startDate, endDate } = params;

    let whereClause = { status: 'keluar' };

    // Jika ada filter tanggal
    if (startDate && endDate) {
        whereClause.waktu_keluar = {
            gte: new Date(startDate),
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        };
    } else {
        // Default: Hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        whereClause.waktu_keluar = { gte: today };
    }

    // Pendapatan dalam Range/Hari Ini
    const revenueStats = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: whereClause
    });

    // Pendapatan Bulan Ini (Tetap tampilkan sebagai pembanding stabil)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueMonth = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: {
            waktu_keluar: { gte: startOfMonth },
            status: 'keluar'
        }
    });

    // Total Transaksi (Sesuai Filter)
    const totalTx = await prisma.tb_transaksi.count({
        where: whereClause
    });

    return {
        today: parseInt(revenueStats._sum.biaya_total || 0),
        month: parseInt(revenueMonth._sum.biaya_total || 0),
        totalTransactions: totalTx
    };
}

// 2. Ambil Data Grafik
export async function getRevenueChartData(params = {}) {
    const { startDate, endDate } = params;
    const chartData = [];

    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    if (!startDate) {
        start.setDate(start.getDate() - 6); // Default 7 hari terakhir
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Loop setiap hari dalam range
    let current = new Date(start);
    while (current <= end) {
        const d = new Date(current);
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);

        const revenue = await prisma.tb_transaksi.aggregate({
            _sum: { biaya_total: true },
            where: {
                waktu_keluar: {
                    gte: d,
                    lt: nextDay
                },
                status: 'keluar'
            }
        });

        chartData.push({
            date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            revenue: parseInt(revenue._sum.biaya_total || 0)
        });

        current.setDate(current.getDate() + 1);
    }

    return chartData;
}
