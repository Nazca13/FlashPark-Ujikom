import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getUsers, deleteUser } from './actions';
import styles from './page.module.css';

/**
 * Halaman Data Admin Users
 * Menampilkan daftar user yang terdaftar dalam sistem.
 */
export default async function UsersPage() {
  const users = await getUsers();

  return (
    <DashboardLayout activePage="Data User">
      <h1 className={styles.pageTitle}>Data User</h1>

      <div className={styles.cardContainer}>
        {/* Tombol Tambah User */}
        <div style={{ marginBottom: '24px' }}>
          <Link href="/dashboard/admin/users/add" style={{
            background: '#4F46E5',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            + Tambah User
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                  Belum ada data user.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id_user}>
                  <td>{index + 1}</td>
                  <td>{user.nama_lengkap}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: user.status_aktif ? '#DCFCE7' : '#FEE2E2',
                      color: user.status_aktif ? '#166534' : '#991B1B'
                    }}>
                      {user.status_aktif ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <Link href={`/dashboard/admin/users/edit/${user.id_user}`}>
                        <button style={{
                          background: "#E0F2FE", color: "#0284C7", border: "none",
                          padding: "6px 12px", borderRadius: "8px", fontSize: "12px",
                          fontWeight: "600", cursor: "pointer"
                        }}>
                          Edit
                        </button>
                      </Link>

                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={user.id_user} />
                        <button type="submit" style={{
                          background: "#FEE2E2", color: "#B91C1C", border: "none",
                          padding: "6px 12px", borderRadius: "8px", fontSize: "12px",
                          fontWeight: "600", cursor: "pointer"
                        }}>
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}