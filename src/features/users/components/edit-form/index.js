"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import { updateUser } from "@/features/users/actions";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/inputs/input";
import { redirect } from "next/navigation";

export function EditForm({ user }) {
  const [state, formAction] = useActionState(updateUser, null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect balik kalau sukses
  if (state?.success) {
    redirect("/dashboard/admin/users");
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}

      {/* ID Tersembunyi (Wajib ada buat tau siapa yg diedit) */}
      <input type="hidden" name="id" value={user.id_user} />

      {/* Input Nama (Default Value dari Database) */}
      <Input
        label="Nama Lengkap"
        name="nama"
        defaultValue={user.nama_lengkap}
        required
      />

      <Input
        label="Username"
        name="username"
        defaultValue={user.username}
        required
      />

      {/* Password (Opsional) */}
      <div className="w-full">
        <label className="block text-sm font-bold text-[#1A1A1A] mb-2 ml-1">
          Password Baru (Kosongkan jika tidak diubah)
        </label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="***"
            className="w-full h-12 px-4 bg-[#F1F1F1] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#204DD2]"
          />
          <button
            type="button"
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
            <Image
              src={showPassword ? "/content/password-on.svg" : "/content/password-off.svg"}
              alt={showPassword ? "Hide password" : "Show password"}
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* Role */}
      <div className="w-full">
        <label className="block text-sm font-bold text-[#1A1A1A] mb-2 ml-1">Role</label>
        <select
          name="role"
          defaultValue={user.role}
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

      <div style={{ marginTop: "10px" }}>
        <Button type="submit">Update Data</Button>
      </div>
    </form>
  );
}