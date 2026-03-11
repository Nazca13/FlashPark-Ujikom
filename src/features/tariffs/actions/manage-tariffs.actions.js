/**
 * ============================================================================
 * MANAGE TARIFFS ACTIONS - src/features/tariffs/actions/manage-tariffs.actions.js
 * ============================================================================
 * Server actions untuk mengelola data tarif parkir.
 * 
 * Fungsi-fungsi:
 * 1. getTarif() - Ambil semua data tarif dari database
 * 2. saveTarif() - Simpan tarif baru atau update tarif yang sudah ada
 * 3. createTarif() - Buat tarif baru (versi alternatif dari saveTarif)
 * 4. deleteTarif() - Hapus tarif dari database
 * 
 * @module ManageTariffsActions
 * @path /dashboard/admin/tarif
 * ============================================================================
 */

// direktif: fungsi ini hanya berjalan di server
"use server";

// import koneksi database Prisma (singleton instance)
import prisma from "@/lib/database/prisma";

// import revalidatePath untuk refresh cache halaman setelah data berubah
import { revalidatePath } from "next/cache";

/**
 * getTarif - Mengambil semua data tarif dari database
 * 
 * Dipanggil oleh halaman admin untuk menampilkan tabel tarif.
 * 
 * @returns {Promise<Array>} - Array berisi semua tarif [{id_tarif, jenis_kendaraan, tarif_per_jam}]
 */
export async function getTarif() {
    // findMany tanpa parameter = ambil SEMUA data dari tabel tb_tarif
    return await prisma.tb_tarif.findMany();
}

/**
 * saveTarif - Menyimpan tarif (bisa create baru atau update yang sudah ada)
 * 
 * Logika:
 * - Kalau ada id_tarif di form → UPDATE tarif yang sudah ada
 * - Kalau tidak ada id_tarif → CREATE tarif baru
 * 
 * @param {FormData} formData - Data form berisi id_tarif (opsional), jenis_kendaraan, tarif_per_jam
 */
export async function saveTarif(formData) {
    // ambil data dari form
    const id = formData.get("id_tarif");                // ID tarif (ada = update, kosong = create)
    const jenis = formData.get("jenis_kendaraan");       // jenis kendaraan (Motor/Mobil/Truk)
    const harga = formData.get("tarif_per_jam");          // harga per jam

    // cek apakah ada ID tarif?
    if (id) {
        // ADA ID → proses UPDATE data tarif yang sudah ada
        await prisma.tb_tarif.update({
            where: { id_tarif: parseInt(id) },                                         // cari berdasarkan ID
            data: { jenis_kendaraan: jenis, tarif_per_jam: parseFloat(harga) },        // update data
        });
    } else {
        // TIDAK ADA ID → proses CREATE tarif baru
        await prisma.tb_tarif.create({
            data: { jenis_kendaraan: jenis, tarif_per_jam: parseFloat(harga) },        // simpan data baru
        });
    }

    // refresh halaman tarif admin agar perubahan langsung terlihat
    revalidatePath("/dashboard/admin/tarif");
}

/**
 * createTarif - Membuat tarif baru (versi alternatif)
 * 
 * Fungsi ini khusus untuk CREATE saja (tidak bisa update).
 * Nama field berbeda dari saveTarif: "jenis" dan "tarif" (bukan "jenis_kendaraan" dan "tarif_per_jam").
 * 
 * @param {FormData} formData - Data form berisi jenis (nama kendaraan) dan tarif (harga per jam)
 */
export async function createTarif(formData) {
    // ambil data dari form
    const jenis = formData.get("jenis");            // jenis kendaraan
    const tarif = parseInt(formData.get("tarif"));  // tarif per jam (konversi ke integer)

    // simpan tarif baru ke database
    await prisma.tb_tarif.create({
        data: { jenis_kendaraan: jenis, tarif_per_jam: tarif }
    });

    // refresh halaman tarif admin
    revalidatePath("/dashboard/admin/tarif");
}

/**
 * deleteTarif - Menghapus tarif dari database
 * 
 * Dipanggil saat admin klik tombol "Hapus" di tabel tarif.
 * 
 * @param {FormData} formData - Data form berisi id_tarif yang akan dihapus
 */
export async function deleteTarif(formData) {
    // ambil ID tarif dari hidden input
    const id = parseInt(formData.get("id_tarif"));

    // hapus tarif dari database berdasarkan ID
    await prisma.tb_tarif.delete({ where: { id_tarif: id } });

    // refresh halaman agar tarif yang dihapus hilang dari tabel
    revalidatePath("/dashboard/admin/tarif");
}
