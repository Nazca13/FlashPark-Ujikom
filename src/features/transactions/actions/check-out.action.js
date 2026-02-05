"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { writeLog } from "@/features/logs/actions/log.action";
import { cookies } from "next/headers";

export async function checkoutKendaraan(id_parkir, total_bayar, id_area) {
    try {
        const res = await prisma.tb_transaksi.update({
            where: { id_parkir: parseInt(id_parkir) },
            data: {
                waktu_keluar: new Date(),
                biaya_total: total_bayar,
                status: 'keluar'
            },
            // include plat nomor buat log
            select: { plat_nomor: true }
        });

        await prisma.tb_area_parkir.update({
            where: { id_area: parseInt(id_area) },
            data: {
                terisi: { decrement: 1 }
            }
        });

        // ambil id user dari session cookie buat log
        const cookieStore = await cookies();
        const userId = cookieStore.get("session_user_id")?.value;

        if (userId) {
            await writeLog(userId, `Check-Out Kendaraan: ${res.plat_nomor}`);
        }

        revalidatePath("/dashboard/petugas/keluar");
        return { success: true };

    } catch (error) {
        console.error("Kesalahan sistem saat Checkout:", error);
        return { success: false, error: "Gagal memproses checkout." };
    }
}
