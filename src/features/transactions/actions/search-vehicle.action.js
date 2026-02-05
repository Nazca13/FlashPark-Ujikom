"use server";

import prisma from "@/lib/database/prisma";

export async function searchKendaraanMasuk(plat) {
    try {
        const data = await prisma.tb_transaksi.findFirst({
            where: {
                plat_nomor: {
                    contains: plat.toUpperCase()
                },
                status: 'masuk'
            },
            include: {
                tb_tarif: true,
                tb_area_parkir: true
            }
        });

        if (!data) {
            return { success: false, error: "Kendaraan tidak ditemukan atau sudah keluar." };
        }

        const safeData = {
            ...data,
            tb_tarif: {
                ...data.tb_tarif,
                tarif_per_jam: parseInt(data.tb_tarif.tarif_per_jam)
            }
        };

        return { success: true, data: safeData };

    } catch (error) {
        console.error("Kesalahan sistem saat mencari kendaraan:", error);
        return { success: false, error: "Terjadi kesalahan server." };
    }
}
