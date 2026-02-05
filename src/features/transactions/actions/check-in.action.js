"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { writeLog } from "@/features/logs/actions/log.action";

export async function checkInKendaraan(formData) {
    const plat = formData.get("plat_nomor").toUpperCase();
    const idTarif = parseInt(formData.get("id_tarif"));
    const idArea = parseInt(formData.get("id_area"));
    const idUser = parseInt(formData.get("id_user"));

    if (!plat || !idTarif || !idArea) {
        return { success: false, error: "Data tidak lengkap! Mohon isi semua field." };
    }

    try {
        await prisma.tb_transaksi.create({
            data: {
                plat_nomor: plat,
                id_tarif: idTarif,
                id_area: idArea,
                id_user: idUser,
                status: "masuk",
                waktu_masuk: new Date(),
            },
        });

        await prisma.tb_area_parkir.update({
            where: { id_area: idArea },
            data: { terisi: { increment: 1 } },
        });

        // catat log aktivitas
        await writeLog(idUser, `Check-In Kendaraan: ${plat}`);

        revalidatePath("/dashboard/petugas");

        return { success: true };

    } catch (error) {
        console.error("Kesalahan sistem saat Check-In:", error);
        return { success: false, error: "Gagal memproses check-in. Coba lagi." };
    }
}
