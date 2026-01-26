"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Mengambil semua data tarif (Kriteria 1.1)
export async function getTarif() {
  return await prisma.tb_tarif.findMany();
}

// Menambah atau Update Tarif (Kriteria 1.8)
export async function saveTarif(formData) {
  const id = formData.get("id_tarif"); // Jika ada ID, berarti update
  const jenis = formData.get("jenis_kendaraan");
  const harga = formData.get("tarif_per_jam");

  if (id) {
    await prisma.tb_tarif.update({
      where: { id_tarif: parseInt(id) },
      data: { jenis_kendaraan: jenis, tarif_per_jam: parseFloat(harga) },
    });
  } else {
    await prisma.tb_tarif.create({
      data: { jenis_kendaraan: jenis, tarif_per_jam: parseFloat(harga) },
    });
  }
  revalidatePath("/dashboard/admin/tarif");
}