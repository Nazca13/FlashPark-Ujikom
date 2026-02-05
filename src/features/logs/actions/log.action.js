"use server";

import prisma from "@/lib/database/prisma";

export async function writeLog(id_user, aktivitas) {
    if (!id_user || !aktivitas) return;

    try {
        await prisma.tb_log_aktivitas.create({
            data: {
                id_user: parseInt(id_user),
                aktivitas: aktivitas,
                waktu_aktivitas: new Date()
            }
        });
    } catch (error) {
        console.error("Failed to write log:", error);
        // We don't want to break the main app flow if logging fails
    }
}
