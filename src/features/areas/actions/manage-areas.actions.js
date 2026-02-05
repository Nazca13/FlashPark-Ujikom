"use server";

import prisma from "@/lib/database/prisma";
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
            terisi: 0
        },
    });
    revalidatePath("/dashboard/admin/area");
}

export async function toggleAreaStatus(formData) {
    const id = parseInt(formData.get("id_area"));
    const currentStatus = formData.get("is_active") === "true";

    await prisma.tb_area_parkir.update({
        where: { id_area: id },
        data: { is_active: !currentStatus }
    });

    revalidatePath("/dashboard/admin/area");
}
