// import styling dari file css module
import styles from "../admin.module.css";

// import koneksi database prisma
import prisma from "@/lib/prisma";

// import fungsi createUser dan deleteUser dari actions.js
import { createUser, deleteUser } from "../actions";

// import layout dashboard (sidebar + header)
import { DashboardLayout } from "@/components/layout/dashboard-layout";

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
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>+ Tambah User Baru</h3>

        {/* form ini langsung connect ke server action createUser */}
        <form action={createUser} className={styles.filterRow} style={{ alignItems: 'flex-end' }}>

          {/* input nama lengkap */}
          <div className={styles.filterGroup} style={{ flex: 2 }}>
            <label className={styles.label}>Nama Lengkap</label>
            <input name="nama" className={styles.input} placeholder="Contoh: Budi Santoso" required />
          </div>

          {/* input username */}
          <div className={styles.filterGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Username</label>
            <input name="username" className={styles.input} placeholder="user123" required />
          </div>

          {/* input password */}
          <div className={styles.filterGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Password</label>
            <input name="password" type="password" className={styles.input} placeholder="******" required />
          </div>

          {/* dropdown pilih role */}
          <div className={styles.filterGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Role</label>
            <select name="role" className={styles.input} style={{ background: 'white' }}>
              <option value="petugas">Petugas</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {/* tombol submit */}
          <button type="submit" className={styles.btnPrimary}>Simpan</button>
        </form>
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