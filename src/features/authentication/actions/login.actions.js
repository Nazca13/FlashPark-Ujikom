// ini artinya fungsi ini jalan di server, bukan di browser user
"use server";

// import prisma = ambil koneksi database kita
import prisma from "@/lib/database/prisma";

// redirect = buat pindah halaman otomatis setelah login sukses
import { redirect } from "next/navigation";

// cookies = buat simpan data session user di browser (kayak tanda dia udah login)
import { cookies } from "next/headers";

import { writeLog } from "@/features/logs/actions/log.action";

// fungsi utama login, dipanggil pas user klik tombol "masuk"
// prevState = state sebelumnya (buat error handling)
// formData = data dari form (username & password)
export async function loginAction(prevState, formData) {
  // ambil username dari form
  const username = formData.get("username");
  // ambil password dari form
  const password = formData.get("password");

  // cek dulu, kalo ada yg kosong langsung tolak
  if (!username || !password) {
    return { error: "Username dan Password harus diisi!" };
  }

  // cari user di database berdasarkan username
  // findFirst = ambil data pertama yg cocok
  const user = await prisma.tb_user.findFirst({
    where: { username: username },
  });

  // kalo user ga ketemu ATAU password salah, tolak
  // ini validasi keamanan dasar
  if (!user || user.password !== password) {
    return { error: "Username atau Password salah!" };
  }

  // kalo sampe sini = login sukses!
  // sekarang simpan session ke cookie browser

  // ambil akses ke cookie store
  const cookieStore = await cookies();

  // simpan id user ke cookie, biar tau siapa yg login
  cookieStore.set("session_user_id", user.id_user.toString(), {
    httpOnly: true, // cookie ga bisa diakses javascript (lebih aman)
    secure: process.env.NODE_ENV === "production", // https only di production
    maxAge: 60 * 60 * 24 * 7, // berlaku 1 minggu
    path: "/", // berlaku di semua halaman
  });

  // simpan juga role user (admin/petugas/owner)
  cookieStore.set("session_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // catat log login
  await writeLog(user.id_user, "Login ke sistem");

  // sekarang redirect (pindah halaman) sesuai role user
  if (user.role === "admin") {
    // admin masuk ke dashboard admin
    redirect("/dashboard/admin");
  } else if (user.role === "petugas") {
    // petugas masuk ke dashboard petugas
    redirect("/dashboard/petugas");
  } else if (user.role === "owner") {
    // owner masuk ke dashboard owner
    redirect("/dashboard/owner");
  }

  // kalo role ga dikenali (harusnya ga mungkin sih)
  return { error: "Role tidak dikenali!" };
}

// fungsi logout, dipanggil pas user klik tombol keluar
export async function logoutAction() {
  const cookieStore = await cookies();

  // ambil user id sebelum dihapus buat log
  const userId = cookieStore.get("session_user_id")?.value;
  if (userId) {
    await writeLog(userId, "Logout dari sistem");
  }

  // hapus semua cookie session
  cookieStore.delete("session_user_id");
  cookieStore.delete("session_role");

  // balik ke halaman login
  redirect("/signin");
}