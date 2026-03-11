/**
 * ============================================================================
 * LOGIN ACTIONS - src/features/authentication/actions/login.actions.js
 * ============================================================================
 * Server actions untuk proses autentikasi (login & logout).
 * 
 * Alur Login:
 * 1. Validasi input (username & password tidak boleh kosong)
 * 2. Cari user di database berdasarkan username
 * 3. Cocokkan password
 * 4. Simpan session ke cookie browser (user_id dan role)
 * 5. Catat log "Login ke sistem"
 * 6. Redirect ke dashboard sesuai role (admin/petugas/owner)
 * 
 * Alur Logout:
 * 1. Ambil user ID dari cookie (untuk log)
 * 2. Catat log "Logout dari sistem"
 * 3. Hapus semua cookie session
 * 4. Redirect ke halaman login
 * 
 * CATATAN KEAMANAN: Password disimpan plain text (tanpa hash)
 * karena ini proyek untuk ujikom. Di production, gunakan bcrypt!
 * 
 * @module LoginActions
 * @path /signin (login), semua halaman (logout)
 * ============================================================================
 */

// direktif: fungsi ini hanya jalan di server, bukan di browser user
"use server";

// import koneksi database Prisma (singleton)
import prisma from "@/lib/database/prisma";

// import redirect = fungsi Next.js untuk pindah halaman secara otomatis dari server
import { redirect } from "next/navigation";

// import cookies = fungsi Next.js untuk membaca/menulis cookie browser dari server
// cookie dipakai sebagai "session" (tanda bahwa user sudah login)
import { cookies } from "next/headers";

// import fungsi writeLog untuk mencatat aktivitas login/logout
import { writeLog } from "@/features/logs/actions/log.action";

/**
 * loginAction - Proses login user
 * 
 * Dipanggil saat user submit form login (via useActionState).
 * 
 * @param {Object} prevState - State sebelumnya (berisi error message jika ada)
 * @param {FormData} formData - Data form berisi username dan password
 * @returns {Object} - { error: "..." } jika gagal, tidak return apa-apa jika berhasil (redirect)
 */
export async function loginAction(prevState, formData) {
  // ===== 1. AMBIL DATA DARI FORM =====
  const username = formData.get("username");   // ambil username dari input
  const password = formData.get("password");   // ambil password dari input

  // ===== 2. VALIDASI INPUT =====
  // cek apakah username dan password terisi
  if (!username || !password) {
    return { error: "Username dan Password harus diisi!" };
  }

  // ===== 3. CARI USER DI DATABASE =====
  // findFirst = cari 1 data pertama yang cocok berdasarkan username
  const user = await prisma.tb_user.findFirst({
    where: { username: username },
  });

  // ===== 4. VALIDASI USER & PASSWORD =====
  // kalau user tidak ditemukan ATAU password tidak cocok → tolak
  if (!user || user.password !== password) {
    return { error: "Username atau Password salah!" };
  }

  // ===== 5. SIMPAN SESSION KE COOKIE =====
  // kalau sampai sini = login BERHASIL!
  // simpan data session ke cookie browser agar server tahu siapa yang login

  // ambil akses ke cookie store
  const cookieStore = await cookies();

  // simpan ID user ke cookie "session_user_id"
  cookieStore.set("session_user_id", user.id_user.toString(), {
    httpOnly: true,                                // cookie tidak bisa diakses JavaScript browser (mencegah XSS)
    secure: process.env.NODE_ENV === "production", // hanya kirim lewat HTTPS di production
    maxAge: 60 * 60 * 24 * 7,                      // berlaku 7 hari (60s × 60m × 24h × 7d = 604800 detik)
    path: "/",                                     // berlaku di semua halaman
  });

  // simpan role user ke cookie "session_role"
  cookieStore.set("session_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // ===== 6. CATAT LOG AKTIVITAS =====
  // simpan catatan bahwa user berhasil login
  await writeLog(user.id_user, "Login ke sistem");

  // ===== 7. REDIRECT KE DASHBOARD SESUAI ROLE =====
  // setiap role punya dashboard sendiri dengan fitur berbeda
  if (user.role === "admin") {
    redirect("/dashboard/admin");       // admin → kelola user, tarif, area, log
  } else if (user.role === "petugas") {
    redirect("/dashboard/petugas");     // petugas → check-in/checkout kendaraan
  } else if (user.role === "owner") {
    redirect("/dashboard/owner");       // owner → lihat laporan keuangan
  }

  // fallback: kalau role tidak dikenali (seharusnya tidak terjadi karena enum)
  return { error: "Role tidak dikenali!" };
}

/**
 * logoutAction - Proses logout user
 * 
 * Dipanggil saat user klik tombol "Log Out" di sidebar.
 * Menghapus semua cookie session dan redirect ke halaman login.
 */
export async function logoutAction() {
  // ambil akses ke cookie store
  const cookieStore = await cookies();

  // ambil user ID dari cookie sebelum dihapus (untuk mencatat log)
  const userId = cookieStore.get("session_user_id")?.value;
  // ?. = optional chaining: kalau cookie tidak ada, return undefined

  // catat log logout (hanya kalau ada user ID)
  if (userId) {
    await writeLog(userId, "Logout dari sistem");
  }

  // hapus semua cookie session
  cookieStore.delete("session_user_id");   // hapus ID user
  cookieStore.delete("session_role");       // hapus role

  // redirect ke halaman login
  redirect("/signin");
}