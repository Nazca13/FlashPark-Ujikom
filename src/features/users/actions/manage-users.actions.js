/**
 * ============================================================================
 * MANAGE USERS ACTIONS - src/features/users/actions/manage-users.actions.js
 * ============================================================================
 * Server actions untuk mengelola data user (pengguna sistem).
 * Dipakai oleh halaman admin untuk CRUD user (Create, Read, Update, Delete).
 * 
 * Fungsi-fungsi:
 * 1. getUsers() - Ambil semua user
 * 2. createUser() - Tambah user baru
 * 3. deleteUser() - Hapus user
 * 4. getUserById() - Ambil 1 user berdasarkan ID
 * 5. updateUser() - Update data user
 * 
 * @module ManageUsersActions
 * @path /dashboard/admin/users
 * ============================================================================
 */

// direktif: fungsi-fungsi ini hanya jalan di server
"use server";

// import koneksi database
import prisma from "@/lib/database/prisma";

// import revalidatePath untuk refresh cache halaman setelah data berubah
import { revalidatePath } from "next/cache";

// import redirect untuk pindah halaman setelah operasi selesai
import { redirect } from "next/navigation";

/**
 * getUsers - Mengambil semua data user dari database
 * 
 * @returns {Promise<Array>} - Array berisi semua user, diurutkan berdasarkan ID ascending
 */
export async function getUsers() {
    // findMany = ambil banyak data, orderBy id_user asc = urutkan dari ID terkecil
    return await prisma.tb_user.findMany({
        orderBy: { id_user: "asc" },
    });
}

/**
 * createUser - Menambah user baru ke database
 * 
 * Dipanggil saat admin submit form tambah user.
 * Setelah berhasil, redirect ke halaman daftar user.
 * 
 * @param {Object} prevState - State sebelumnya (untuk useActionState)
 * @param {FormData} formData - Data form berisi nama, username, password, role
 * @returns {Object|void} - Return error object jika gagal, redirect jika berhasil
 */
export async function createUser(prevState, formData) {
    // ambil data dari form input
    const nama = formData.get("nama");         // nama lengkap user
    const username = formData.get("username");  // username untuk login
    const password = formData.get("password");  // password
    const role = formData.get("role");          // role: admin/petugas/owner

    try {
        // simpan user baru ke database
        await prisma.tb_user.create({
            data: {
                nama_lengkap: nama,    // simpan nama lengkap
                username: username,     // simpan username
                password: password,     // simpan password (plain text untuk ujikom)
                role: role,            // simpan role
                status_aktif: 1,       // default aktif (1 = aktif, 0 = nonaktif)
            },
        });
    } catch (err) {
        // kalau gagal (biasanya karena username sudah ada / duplikat)
        // return error message ke frontend
        return { error: "Gagal membuat user. Username mungkin sudah ada." };
    }

    // refresh cache halaman users
    revalidatePath("/dashboard/admin/users");

    // redirect ke halaman daftar user setelah berhasil
    redirect("/dashboard/admin/users");
}

/**
 * deleteUser - Menghapus user dari database
 * 
 * Dipanggil saat admin klik tombol "Hapus" di tabel user.
 * 
 * @param {FormData} formData - Data form berisi id user yang mau dihapus
 */
export async function deleteUser(formData) {
    // ambil ID user dari hidden input
    const id = formData.get("id");

    // validasi: kalau id kosong, langsung return (jangan lanjut)
    if (!id) return;

    try {
        // hapus user dari database berdasarkan ID
        await prisma.tb_user.delete({
            where: { id_user: parseInt(id) }, // konversi string ID ke integer
        });
    } catch (error) {
        // kalau gagal hapus (misal user masih punya relasi ke transaksi)
        console.error("Gagal hapus user:", error);
    }

    // refresh cache halaman users agar user yang dihapus hilang dari tabel
    revalidatePath("/dashboard/admin/users");
}

/**
 * getUserById - Mengambil 1 data user berdasarkan ID
 * 
 * Dipanggil saat admin membuka halaman edit user.
 * Data user ini ditampilkan di form sebagai default value.
 * 
 * @param {string|number} id - ID user yang dicari
 * @returns {Promise<Object|null>} - Data user atau null jika tidak ditemukan
 */
export async function getUserById(id) {
    // findUnique = cari 1 data yang cocok (id harus unik)
    return await prisma.tb_user.findUnique({
        where: { id_user: parseInt(id) } // konversi ID ke integer
    });
}

/**
 * updateUser - Mengupdate data user yang sudah ada
 * 
 * Dipanggil saat admin submit form edit user.
 * Password hanya diupdate kalau diisi (tidak kosong).
 * 
 * @param {Object} prevState - State sebelumnya (untuk useActionState)
 * @param {FormData} formData - Data form berisi id, nama, username, role, password (opsional)
 * @returns {Object} - { success: true } jika berhasil, { error: "..." } jika gagal
 */
export async function updateUser(prevState, formData) {
    // ambil semua data dari form
    const id = formData.get("id");             // ID user yang diedit
    const nama = formData.get("nama");         // nama lengkap baru
    const username = formData.get("username");  // username baru
    const role = formData.get("role");          // role baru
    const password = formData.get("password");  // password baru (opsional)

    try {
        // siapkan object data yang mau diupdate
        const dataToUpdate = {
            nama_lengkap: nama,     // update nama
            username: username,     // update username
            role: role,            // update role
        };

        // cek apakah password diisi? (tidak kosong dan bukan spasi doang)
        // kalau diisi = update password, kalau kosong = password lama tetap
        if (password && password.trim() !== "") {
            dataToUpdate.password = password; // tambahkan password ke data update
        }

        // jalankan update ke database
        await prisma.tb_user.update({
            where: { id_user: parseInt(id) },  // cari user berdasarkan ID
            data: dataToUpdate,                 // update dengan data baru
        });

    } catch (err) {
        // kalau gagal (biasanya username bentrok/duplikat)
        return { error: "Gagal update. Username mungkin bentrok." };
    }

    // refresh cache halaman users
    revalidatePath("/dashboard/admin/users");

    // return success indicator ke frontend
    return { success: true };
}
