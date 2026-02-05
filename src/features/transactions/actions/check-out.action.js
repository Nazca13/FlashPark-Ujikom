"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";

export async function checkoutKendaraan(id_parkir, total_bayar, id_area) {
    try {
        await prisma.tb_transaksi.update({
            where: { id_parkir: parseInt(id_parkir) },
            data: {
                waktu_keluar: new Date(),
                biaya_total: total_bayar,
                status: 'keluar'
            }
        });

        await prisma.tb_area_parkir.update({
            where: { id_area: parseInt(id_area) },
            data: {
                terisi: { decrement: 1 }
            }
        });

        revalidatePath("/dashboard/petugas/keluar");
        return { success: true };

    } catch (error) {
        console.error("Kesalahan sistem saat Checkout:", error);
        return { success: false, error: "Gagal memproses checkout." };
    }
}
