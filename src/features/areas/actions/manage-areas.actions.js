/**
 * ============================================================================
 * MANAGE AREAS ACTIONS - src/features/areas/actions/manage-areas.actions.js
 * ============================================================================
 * Server actions untuk mengelola data area parkir.
 * "use server" = kode ini HANYA berjalan di server, tidak di browser user.
 * 
 * Fungsi-fungsi:
 * 1. getArea() - Ambil semua data area parkir
 * 2. createArea() - Tambah area parkir baru
 * 3. toggleAreaStatus() - Toggle aktif/nonaktif area
 * 
 * @module ManageAreasActions
 * @path /dashboard/admin/area
 * ============================================================================
 */

// "use server" = direktif Next.js yang menandakan semua fungsi di file ini
// hanya berjalan di server. Aman untuk query database & operasi sensitif.
"use server";

// import koneksi database Prisma (singleton instance)
import prisma from "@/lib/database/prisma";

// import revalidatePath = fungsi Next.js untuk "refresh" cache halaman tertentu
// setelah data berubah (create/update/delete), halaman perlu di-refresh
import { revalidatePath } from "next/cache";

/**
 * getArea - Mengambil semua data area parkir dari database
 * 
 * Dipanggil oleh halaman admin untuk menampilkan daftar area parkir.
 * 
 * @returns {Promise<Array>} - Array berisi semua data area parkir
 */
export async function getArea() {
    // findMany() tanpa parameter = ambil SEMUA data dari tabel tb_area_parkir
    return await prisma.tb_area_parkir.findMany();
}

/**
 * createArea - Menambah area parkir baru ke database
 * 
 * Dipanggil saat admin submit form "Tambah Area Baru".
 * 
 * @param {FormData} formData - Data form berisi nama_area dan kapasitas
 */
export async function createArea(formData) {
    // ambil nama area dari input form (contoh: "Zona A")
    const nama = formData.get("nama_area");

    // ambil kapasitas dari input form (tipe string, perlu parseInt)
    const kapasitas = formData.get("kapasitas");

    // simpan data area baru ke database
    await prisma.tb_area_parkir.create({
        data: {
            nama_area: nama,                   // nama area parkir
            kapasitas: parseInt(kapasitas),     // konversi string ke integer
            terisi: 0                          // area baru = belum ada kendaraan (0 terisi)
        },
    });

    // refresh halaman area agar data baru langsung muncul di tabel
    revalidatePath("/dashboard/admin/area");
}

/**
 * toggleAreaStatus - Mengubah status area (aktif ↔ nonaktif)
 * 
 * Dipanggil saat admin klik tombol "Aktifkan" atau "Nonaktifkan".
 * Status di-toggle: jika aktif → jadi nonaktif, jika nonaktif → jadi aktif.
 * 
 * @param {FormData} formData - Data form berisi id_area dan is_active (status saat ini)
 */
export async function toggleAreaStatus(formData) {
    // ambil ID area dari hidden input
    const id = parseInt(formData.get("id_area"));

    // ambil status saat ini (string "true"/"false" dari hidden input)
    // konversi ke boolean: "true" === "true" → true, selain itu → false
    const currentStatus = formData.get("is_active") === "true";

    // update status area: dibalik dengan operator NOT (!)
    // kalau sekarang true → jadi false, kalau false → jadi true
    await prisma.tb_area_parkir.update({
        where: { id_area: id },             // cari area berdasarkan ID
        data: { is_active: !currentStatus } // balik status
    });

    // refresh halaman agar perubahan terlihat
    revalidatePath("/dashboard/admin/area");
}
