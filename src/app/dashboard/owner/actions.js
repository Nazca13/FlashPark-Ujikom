// file ini jalan di server, bukan di browser
"use server";

// import koneksi database prisma
import prisma from "@/lib/database/prisma";

// fungsi 1: ambil statistik ringkasan untuk card di dashboard owner
// params bisa berisi startDate dan endDate untuk filter tanggal
export async function getOwnerStats(params = {}) {
    // ambil parameter tanggal dari filter (kalau ada)
    const { startDate, endDate } = params;

    // kondisi awal: hanya ambil transaksi yang sudah keluar (sudah bayar)
    let whereClause = { status: 'keluar' };

    // kalau user pilih range tanggal tertentu
    if (startDate && endDate) {
        // filter transaksi berdasarkan waktu keluar
        whereClause.waktu_keluar = {
            gte: new Date(startDate), // dari tanggal mulai
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // sampai akhir hari tanggal selesai
        };
    } else {
        // kalau ga ada filter, default tampilkan data hari ini aja
        const today = new Date();
        today.setHours(0, 0, 0, 0); // set ke jam 00:00:00
        whereClause.waktu_keluar = { gte: today };
    }

    // hitung total pendapatan sesuai filter (hari ini atau range yang dipilih)
    const revenueStats = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true }, // jumlahkan semua biaya_total
        where: whereClause
    });

    // hitung pendapatan bulan ini (tetap tampil sebagai pembanding)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // tanggal 1 bulan ini
    const revenueMonth = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true },
        where: {
            waktu_keluar: { gte: startOfMonth }, // dari awal bulan
            status: 'keluar'
        }
    });

    // hitung total jumlah transaksi sesuai filter
    const totalTx = await prisma.tb_transaksi.count({
        where: whereClause
    });

    // return data statistik
    return {
        today: parseInt(revenueStats._sum.biaya_total || 0), // pendapatan hari ini/range
        month: parseInt(revenueMonth._sum.biaya_total || 0), // pendapatan bulan ini
        totalTransactions: totalTx // total kendaraan keluar
    };
}

// fungsi 2: ambil data untuk grafik pendapatan
export async function getRevenueChartData(params = {}) {
    const { startDate, endDate } = params;
    const chartData = []; // array untuk menyimpan data grafik

    // tentukan tanggal mulai dan selesai
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // kalau ga ada filter tanggal, default 7 hari terakhir
    if (!startDate) {
        start.setDate(start.getDate() - 6); // mundur 6 hari dari hari ini
    }

    // set waktu ke awal dan akhir hari
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // loop untuk setiap hari dalam range tanggal
    let current = new Date(start);
    while (current <= end) {
        const d = new Date(current);
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1); // hari berikutnya

        // hitung pendapatan untuk hari ini
        const revenue = await prisma.tb_transaksi.aggregate({
            _sum: { biaya_total: true },
            where: {
                waktu_keluar: {
                    gte: d, // dari jam 00:00 hari ini
                    lt: nextDay // sampai sebelum jam 00:00 hari besok
                },
                status: 'keluar'
            }
        });

        // tambahkan data ke array grafik
        chartData.push({
            date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }), // format: "09 Feb"
            revenue: parseInt(revenue._sum.biaya_total || 0) // pendapatan hari itu
        });

        // lanjut ke hari berikutnya
        current.setDate(current.getDate() + 1);
    }

    // return array data grafik
    return chartData;
}
