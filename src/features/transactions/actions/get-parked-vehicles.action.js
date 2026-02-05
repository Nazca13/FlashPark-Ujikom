"use server";

import prisma from "@/lib/database/prisma";

export async function getParkedVehicles() {
    try {
        const data = await prisma.tb_transaksi.findMany({
            where: { status: 'masuk' },
            include: {
                tb_tarif: true,
                tb_area_parkir: true
            },
            orderBy: { waktu_masuk: 'desc' }
        });

        const safeData = data.map(item => ({
            ...item,
            tb_tarif: {
                ...item.tb_tarif,
                tarif_per_jam: Number(item.tb_tarif.tarif_per_jam)
            }
        }));

        return { success: true, data: safeData };
    } catch (error) {
        console.error("Gagal mengambil daftar kendaraan parkir:", error);
        return { success: false, error: "Gagal mengambil data dari server." };
    }
}
