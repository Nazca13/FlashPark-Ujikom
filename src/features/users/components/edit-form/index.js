/**
 * ============================================================================
 * EDIT USER FORM - src/features/users/components/edit-form/index.js
 * ============================================================================
 * Komponen form untuk mengedit data user yang sudah ada (Client Component).
 * Form ini menampilkan data user saat ini sebagai default value,
 * dan memungkinkan admin mengubah nama, username, password, dan role.
 * 
 * Fitur:
 * - Data user saat ini ditampilkan sebagai default value
 * - Password opsional (kosongkan jika tidak ingin diubah)
 * - Toggle show/hide password
 * - Auto-redirect ke daftar user setelah berhasil
 * 
 * @module EditForm
 * @path /dashboard/admin/users/edit/[id]
 * ============================================================================
 */

// "use client" = komponen ini berjalan di browser
"use client";

// import hooks React
import { useActionState, useState } from "react";

// import Image untuk ikon toggle password
import Image from "next/image";

// import server action updateUser untuk proses update ke database
import { updateUser } from "@/features/users/actions";

// import komponen UI reusable
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/inputs/input";

// import redirect untuk pindah halaman setelah berhasil
import { redirect } from "next/navigation";

/**
 * EditForm - Komponen Form Edit User
 * 
 * @param {Object} props - Properties komponen
 * @param {Object} props.user - Data user yang akan diedit (dari database)
 * @param {number} props.user.id_user - ID user
 * @param {string} props.user.nama_lengkap - Nama lengkap user
 * @param {string} props.user.username - Username user
 * @param {string} props.user.role - Role user (admin/petugas/owner)
 * @returns {JSX.Element} - Form edit user dengan default values
 */
export function EditForm({ user }) {
  // useActionState: hubungkan form ke server action updateUser
  // state berisi { success: true } atau { error: "..." } dari server
  const [state, formAction] = useActionState(updateUser, null);

  // state lokal untuk toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // ===== AUTO REDIRECT SETELAH SUKSES =====
  // kalau server return { success: true }, langsung redirect ke daftar user
  if (state?.success) {
    redirect("/dashboard/admin/users");
  }

  return (
    // form yang terhubung ke server action via formAction
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

      {/* ===== ERROR MESSAGE ===== */}
      {/* Tampilkan pesan error jika update gagal */}
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}

      {/* ===== HIDDEN INPUT: ID USER ===== */}
      {/* ID user dikirim ke server agar tahu user mana yang diedit */}
      <input type="hidden" name="id" value={user.id_user} />

      {/* ===== INPUT NAMA LENGKAP ===== */}
      {/* defaultValue = isian awal dari data user saat ini */}
      <Input
        label="Nama Lengkap"
        name="nama"
        defaultValue={user.nama_lengkap}
        required
      />

      {/* ===== INPUT USERNAME ===== */}
      <Input
        label="Username"
        name="username"
        defaultValue={user.username}
        required
      />

      {/* ===== INPUT PASSWORD (OPSIONAL) ===== */}
      {/* Kosongkan jika tidak ingin mengubah password */}
      <div className="w-full">
        <label className="block text-sm font-bold text-[#1A1A1A] mb-2 ml-1">
          Password Baru (Kosongkan jika tidak diubah)
        </label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}  // toggle tipe input
            name="password"
            placeholder="***"
            className="w-full h-12 px-4 bg-[#F1F1F1] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#204DD2]"
          />
          {/* ===== TOMBOL TOGGLE PASSWORD ===== */}
          <button
            type="button"    // type="button" agar tidak submit form
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "50%",
              transition: "background-color 0.2s"
            }}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {/* ikon mata toggle */}
            <Image
              src={showPassword ? "/content/password-on.svg" : "/content/password-off.svg"}
              alt={showPassword ? "Hide password" : "Show password"}
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* ===== DROPDOWN ROLE ===== */}
      {/* Pilihan role: Petugas, Admin, atau Owner */}
      <div className="w-full">
        <label className="block text-sm font-bold text-[#1A1A1A] mb-2 ml-1">Role</label>
        <select
          name="role"
          defaultValue={user.role}   // default = role user saat ini
          style={{
            width: "100%", height: "48px", padding: "0 16px",
            background: "#F1F1F1", border: "none", borderRadius: "12px",
            color: "#1F2937"
          }}
        >
          <option value="petugas">Petugas</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* ===== TOMBOL SUBMIT ===== */}
      <div style={{ marginTop: "10px" }}>
        <Button type="submit">Update Data</Button>
      </div>
    </form>
  );
}