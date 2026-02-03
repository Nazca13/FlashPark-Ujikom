"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getArea() {
  return await prisma.tb_area_parkir.findMany();
}

export async function createArea(formData) {
  const nama = formData.get("nama_area");
  const kapasitas = formData.get("kapasitas");

  await prisma.tb_area_parkir.create({
    data: {
      nama_area: nama,
      kapasitas: parseInt(kapasitas),
      terisi: 0 // Default saat dibuat masih kosong
    },
  });
  revalidatePath("/dashboard/admin/area");
}

// fungsi toggle status area parkir (aktif/nonaktif)
export async function toggleAreaStatus(formData) {
  // ambil id area dan status saat ini
  const id = parseInt(formData.get("id_area"));
  const currentStatus = formData.get("is_active") === "true";

  // toggle status (kalo aktif jadi nonaktif, vice versa)
  await prisma.tb_area_parkir.update({
    where: { id_area: id },
    data: { is_active: !currentStatus }
  });

  // refresh halaman
  revalidatePath("/dashboard/admin/area");
}