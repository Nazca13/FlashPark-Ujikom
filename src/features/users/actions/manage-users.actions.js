"use server";

import prisma from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUsers() {
    return await prisma.tb_user.findMany({
        orderBy: { id_user: "asc" },
    });
}

export async function createUser(prevState, formData) {
    const nama = formData.get("nama");
    const username = formData.get("username");
    const password = formData.get("password");
    const role = formData.get("role");

    try {
        await prisma.tb_user.create({
            data: {
                nama_lengkap: nama,
                username: username,
                password: password,
                role: role,
                status_aktif: 1,
            },
        });
    } catch (err) {
        return { error: "Gagal membuat user. Username mungkin sudah ada." };
    }

    revalidatePath("/dashboard/admin/users");
    redirect("/dashboard/admin/users");
}

export async function deleteUser(formData) {
    const id = formData.get("id");
    if (!id) return;

    try {
        await prisma.tb_user.delete({
            where: { id_user: parseInt(id) },
        });
    } catch (error) {
        console.error("Gagal hapus user:", error);
    }

    revalidatePath("/dashboard/admin/users");
}

export async function getUserById(id) {
    return await prisma.tb_user.findUnique({
        where: { id_user: parseInt(id) }
    });
}

export async function updateUser(prevState, formData) {
    const id = formData.get("id");
    const nama = formData.get("nama");
    const username = formData.get("username");
    const role = formData.get("role");
    const password = formData.get("password");

    try {
        const dataToUpdate = {
            nama_lengkap: nama,
            username: username,
            role: role,
        };

        if (password && password.trim() !== "") {
            dataToUpdate.password = password;
        }

        await prisma.tb_user.update({
            where: { id_user: parseInt(id) },
            data: dataToUpdate,
        });

    } catch (err) {
        return { error: "Gagal update. Username mungkin bentrok." };
    }

    revalidatePath("/dashboard/admin/users");
    return { success: true };
}
