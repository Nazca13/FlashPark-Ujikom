"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fungsi untuk Memproses Kendaraan Masuk (Check-In)
export async function checkInKendaraan(formData) {
  // Ambil data dari form
  const plat = formData.get("plat_nomor").toUpperCase();
  const idTarif = parseInt(formData.get("id_tarif"));
  const idArea = parseInt(formData.get("id_area"));
  const idUser = parseInt(formData.get("id_user")); // ID Petugas yang sedang login

  // Validasi sederhana (opsional)
  if (!plat || !idTarif || !idArea) {
    return { success: false, error: "Data tidak lengkap!" };
  }

  try {
    // 1. Simpan data ke tabel Transaksi
    await prisma.tb_transaksi.create({
      data: {
        plat_nomor: plat,
        id_tarif: idTarif,
        id_area: idArea,
        id_user: idUser,
        status: "masuk",     // Status awal pasti 'masuk'
        waktu_masuk: new Date(), // Waktu otomatis 'SEKARANG'
      },
    });

    // 2. Kurangi Slot Parkir (Update tb_area_parkir)
    // Kita tambah kolom 'terisi' + 1
    await prisma.tb_area_parkir.update({
      where: { id_area: idArea },
      data: { terisi: { increment: 1 } },
    });

    // 3. Refresh halaman agar data terbaru muncul
    revalidatePath("/dashboard/petugas");

    return { success: true };

  } catch (error) {
    console.error("Gagal Check-In:", error);
    return { success: false, error: "Gagal menyimpan ke database." };
  }
}