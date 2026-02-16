// import styling dari file css module
import styles from "../admin.module.css";

import prisma from "@/lib/database/prisma";

import { deleteUser } from "@/features/users/actions";

import { DashboardLayout } from "@/components/layouts/admin-layout";
import { AddUserForm } from "./add-user-form";

// ini server component (jalan di server)
// makanya bisa langsung pake async/await
export default async function UsersPage() {
  // ambil semua user dari database
  // orderBy desc = urutkan dari yg terbaru (id paling besar dulu)
  const users = await prisma.tb_user.findMany({ orderBy: { id_user: 'desc' } });

  return (
    // bungkus pake layout dashboard, activePage buat highlight menu
    <DashboardLayout activePage="Data User">
      {/* judul halaman */}
      <h1 className={styles.pageTitle}>Kelola Pengguna</h1>

      {/* ===== BAGIAN FORM TAMBAH USER BARU ===== */}
      <div className={styles.cardContainer} style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1A1A1A' }}>+ Tambah User Baru</h3>
        <AddUserForm />
      </div>

      {/* ===== BAGIAN TABEL DATA USER ===== */}
      <div className={styles.cardContainer}>
        <table className={styles.table}>
          {/* header tabel */}
          <thead>
            <tr>
              <th width="50">ID</th>
              <th>Nama Lengkap</th>
              <th>Username</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          {/* body tabel, diisi pake loop dari data users */}
          <tbody>
            {users.map((u) => (
              // setiap baris pake id_user sebagai key (wajib di react)
              <tr key={u.id_user}>
                <td>#{u.id_user}</td>
                <td>{u.nama_lengkap}</td>
                <td>{u.username}</td>
                <td>
                  {/* badge role, warna beda buat admin vs petugas */}
                  <span className={`${styles.badge} ${u.role === 'admin' ? styles.badgeBlue : styles.badgeGreen}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {/* form buat hapus user, langsung ke server action deleteUser */}
                  <form action={deleteUser}>
                    {/* hidden input = kirim id_user ke server tanpa user lihat */}
                    <input type="hidden" name="id_user" value={u.id_user} />
                    <button className={styles.btnDanger}>Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}