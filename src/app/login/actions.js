"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return { error: "Username dan Password harus diisi!" };
  }

  // 1. Cek User di Database (Kriteria 1.1)
  const user = await prisma.tb_user.findFirst({
    where: { username: username },
  });

  // 2. Validasi Keberadaan User & Password (Kriteria 1.8)
  if (!user || user.password !== password) {
    return { error: "Username atau Password salah!" };
  }

  // Set Session Cookie
  const cookieStore = await cookies();
  cookieStore.set("session_user_id", user.id_user.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 minggu
    path: "/",
  });
  cookieStore.set("session_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 minggu
    path: "/",
  });

  // 3. Pengecekan Role & Redirect sesuai Flowchart
  if (user.role === "admin") {
    redirect("/dashboard/admin");
  } else if (user.role === "petugas") {
    redirect("/dashboard/petugas");
  } else if (user.role === "owner") {
    redirect("/dashboard/owner");
  }

  return { error: "Role tidak dikenali!" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user_id");
  cookieStore.delete("session_role");
  redirect("/signin");
}