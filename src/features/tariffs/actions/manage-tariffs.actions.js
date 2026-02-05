"use server";

// import prisma client untuk akses database
import prisma from "@/lib/database/prisma";
// import revalidatePath untuk refresh data di halaman tertentu setelah ada perubahan
import { revalidatePath } from "next/cache";

// fungsi untuk mengambil semua data tarif dari database
// ini dipake buat nampilin daftar tarif di tabel admin
export async function getTarif() {
    // cari semua data di tabel tb_tarif dan kembalikan hasilnya
    return await prisma.tb_tarif.findMany();
}

// fungsi untuk menyimpan data tarif (bisa insert baru atau update yang ada)
// menerima input berupa formdata dari form frontend
export async function saveTarif(formData) {
    // ambil nilai id, jenis kendaraan, dan harga dari form
    const id = formData.get("id_tarif");
    const jenis = formData.get("jenis_kendaraan");
    const harga = formData.get("tarif_per_jam");

    // cek apakah ada id tarif?
    if (id) {
        // kalau ada id, berarti ini proses update data lama
        await prisma.tb_tarif.update({
            where: { id_tarif: parseInt(id) }, // cari data berdasarkan id
            data: { jenis_kendaraan: jenis, tarif_per_jam: parseFloat(harga) }, // update datanya
        });
    } else {
        // kalau tidak ada id, berarti ini buat data baru
        await prisma.tb_tarif.create({
            data: { jenis_kendaraan: jenis, tarif_per_jam: parseFloat(harga) }, // simpan data baru
        });
    }
    // refresh halaman tarif admin biar data terbaru langsung muncul
    revalidatePath("/dashboard/admin/tarif");
}

// fungsi khusus untuk buat tarif baru (alternatif lain dari saveTarif)
export async function createTarif(formData) {
    // ambil data inputan
    const jenis = formData.get("jenis");
    const tarif = parseInt(formData.get("tarif"));

    // simpan ke database
    await prisma.tb_tarif.create({
        data: { jenis_kendaraan: jenis, tarif_per_jam: tarif }
    });

    // refresh halaman
    revalidatePath("/dashboard/admin/tarif");
}

// fungsi untuk menghapus data tarif
export async function deleteTarif(formData) {
    // ambil id tarif yang mau dihapus dari form
    const id = parseInt(formData.get("id_tarif"));

    // hapus data dari database berdasarkan id
    await prisma.tb_tarif.delete({ where: { id_tarif: id } });

    // refresh halaman biar data yang dihapus hilang dari tampilan
    revalidatePath("/dashboard/admin/tarif");
}
