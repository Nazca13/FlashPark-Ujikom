"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";

export async function getDashboardData(params = {}) {
    const { query, date, vehicle } = params;

    const whereClause = {};

    if (query) {
        whereClause.plat_nomor = { contains: query };
    }

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        whereClause.waktu_masuk = {
            gte: startDate,
            lte: endDate
        };
    }

    if (vehicle && vehicle !== 'Semua') {
        whereClause.tb_tarif = {
            jenis_kendaraan: vehicle
        };
    }

    const transaksiTerbaru = await prisma.tb_transaksi.findMany({
        where: whereClause,
        take: 5,
        orderBy: {
            waktu_masuk: 'desc',
        },
        include: {
            tb_user: true,
            tb_tarif: true
        }
    });

    const totalPendapatan = await prisma.tb_transaksi.aggregate({
        _sum: { biaya_total: true }
    });

    const kendaraanMasuk = await prisma.tb_transaksi.count({
        where: { status: 'masuk' }
    });

    const totalPetugas = await prisma.tb_user.count({
        where: { role: 'petugas' }
    });

    const areaData = await prisma.tb_area_parkir.aggregate({
        _sum: {
            kapasitas: true,
            terisi: true
        }
    });

    const sisaSlot = (areaData._sum.kapasitas || 0) - (areaData._sum.terisi || 0);

    return {
        transaksi: transaksiTerbaru,
        stats: {
            pendapatan: totalPendapatan._sum.biaya_total || 0,
            kendaraanMasuk,
            sisaSlot,
            totalPetugas
        }
    };
}
