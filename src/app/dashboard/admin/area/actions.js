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