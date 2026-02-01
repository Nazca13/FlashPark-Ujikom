import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { createUser, deleteUser } from "../actions";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function UsersPage() {
  const users = await prisma.tb_user.findMany({ orderBy: { id_user: 'desc' } });

  return (
    <DashboardLayout activePage="Data User">
      <h1 className={styles.pageTitle}>Kelola Pengguna</h1>

      {/* FORM TAMBAH USER */}
      <div className={styles.cardContainer} style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>+ Tambah User Baru</h3>
        <form action={createUser} className={styles.filterRow} style={{ alignItems: 'flex-end' }}>

          <div className={styles.filterGroup} style={{ flex: 2 }}>
            <label className={styles.label}>Nama Lengkap</label>
            <input name="nama" className={styles.input} placeholder="Contoh: Budi Santoso" required />
          </div>

          <div className={styles.filterGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Username</label>
            <input name="username" className={styles.input} placeholder="user123" required />
          </div>

          <div className={styles.filterGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Password</label>
            <input name="password" type="password" className={styles.input} placeholder="******" required />
          </div>

          <div className={styles.filterGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Role</label>
            <select name="role" className={styles.input} style={{ background: 'white' }}>
              <option value="petugas">Petugas</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <button type="submit" className={styles.btnPrimary}>Simpan</button>
        </form>
      </div>

      {/* TABEL DATA USER */}
      <div className={styles.cardContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th width="50">ID</th>
              <th>Nama Lengkap</th>
              <th>Username</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id_user}>
                <td>#{u.id_user}</td>
                <td>{u.nama_lengkap}</td>
                <td>{u.username}</td>
                <td>
                  <span className={`${styles.badge} ${u.role === 'admin' ? styles.badgeBlue : styles.badgeGreen}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <form action={deleteUser}>
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