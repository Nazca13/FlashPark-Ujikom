import { DashboardLayout } from "@/components/layouts/admin-layout";
import { StatCard } from "@/components/ui/stats/stat-card";
import { getDashboardData } from "@/features/reports/actions";
import styles from "./admin.module.css";
import { DashboardFilter } from "@/features/transactions/components/dashboard-filter";

export default async function AdminDashboard({ searchParams }) {
  // Await searchParams before using it (Next.js 15+ requirement, good practice)
  const params = await searchParams;
  const { transaksi, stats } = await getDashboardData(params);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "-";
    return new Date(dateObj).toLocaleDateString("id-ID");
  };

  const formatTime = (dateObj) => {
    if (!dateObj) return "-";
    return new Date(dateObj).toLocaleTimeString("id-ID", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout activePage="Dashboard">
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Pendapatan"
          value={formatRupiah(stats.pendapatan)}
          iconPath="/content/pendapatan-icon.svg"
        />
        <StatCard
          title="Kendaraan Masuk"
          value={stats.kendaraanMasuk}
          iconPath="/content/kendaraan-masuk-icon.svg"
        />
        <StatCard
          title="Sisa Slot"
          value={stats.sisaSlot}
          iconPath="/content/sisa-slot-icon.svg"
        />
        <StatCard
          title="Total Petugas"
          value={stats.totalPetugas}
          iconPath="/content/total-petugas-icon.svg"
        />
      </div>

      {/* ================================================================== */}
      {/* FILTER SECTION (Client Component) */}
      {/* ================================================================== */}
      <DashboardFilter />
      <div className={styles.cardContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Petugas</th>
              <th>Kendaraan</th>
              <th>Plat Nomor</th>
              <th>Tanggal</th>
              <th>Jam Masuk</th>
              <th>Jam Keluar</th>
              <th>Total Biaya</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Belum ada data transaksi.
                </td>
              </tr>
            ) : (
              transaksi.map((item, index) => (
                <tr key={item.id_parkir}>
                  <td>{index + 1}</td>
                  <td>{item.tb_user?.nama_lengkap || "Sistem"}</td>
                  <td>{item.tb_tarif?.jenis_kendaraan || "Kendaraan"}</td>
                  <td>{item.plat_nomor}</td>
                  <td>{formatDate(item.waktu_masuk)}</td>
                  <td>{formatTime(item.waktu_masuk)}</td>
                  <td>{formatTime(item.waktu_keluar)}</td>
                  <td>{item.biaya_total ? formatRupiah(item.biaya_total) : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout >
  );
}