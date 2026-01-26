"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkInKendaraan(formData) {
  const plat = formData.get("plat_nomor").toUpperCase();
  const idTarif = parseInt(formData.get("id_tarif"));
  const idArea = parseInt(formData.get("id_area"));
  const idUser = parseInt(formData.get("id_user")); // ID Petugas yang login

  try {
    // 1. Simpan transaksi baru
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

    // 2. Update kapasitas terisi di tb_area_parkir
    await prisma.tb_area_parkir.update({
      where: { id_area: idArea },
      data: { terisi: { increment: 1 } },
    });

    revalidatePath("/dashboard/petugas");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memproses kendaraan masuk." };
  }
}