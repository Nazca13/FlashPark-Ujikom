/**
 * ============================================================================
 * DATA AREA PARKIR PAGE - Halaman Kelola Area Parkir
 * ============================================================================
 * Halaman ini menampilkan daftar area parkir beserta kapasitas dan status
 * terisi, serta memungkinkan admin untuk menambah area baru.
 * 
 * @module DataArea
 * @path /dashboard/admin/area
 * ============================================================================
 */

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getArea, createArea, toggleAreaStatus } from "./actions";
import styles from "../admin.module.css";

/**
 * DataAreaPage - Komponen Halaman Data Area Parkir
 * 
 * @async - Server Component untuk mengambil data dari database
 * @returns {JSX.Element} - Halaman dengan tabel area parkir dan form tambah
 */
export default async function DataAreaPage() {
    // ==========================================================================
    // DATA FETCHING
    // ==========================================================================

    /**
     * Mengambil semua data area parkir dari database
     * @const {Array} areaList - Array berisi semua data area
     */
    const areaList = await getArea();

    // ==========================================================================
    // CALCULATED VALUES
    // ==========================================================================

    /**
     * Menghitung total kapasitas dan total terisi dari semua area
     */
    const totalKapasitas = areaList.reduce((sum, area) => sum + area.kapasitas, 0);
    const totalTerisi = areaList.reduce((sum, area) => sum + (area.terisi || 0), 0);
    const totalTersedia = totalKapasitas - totalTerisi;

    // ==========================================================================
    // RENDER JSX
    // ==========================================================================

    return (
        <DashboardLayout activePage="Data Area">
            {/* Page Title */}
            <h1 className={styles.pageTitle}>Data Area Parkir</h1>

            {/* Stats Summary Cards */}
            <div className={styles.statsGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {/* Total Kapasitas */}
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                }}>
                    <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>
                        Total Kapasitas
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1F2937" }}>
                        {totalKapasitas} <span style={{ fontSize: "14px", fontWeight: "normal" }}>slot</span>
                    </div>
                </div>

                {/* Total Terisi */}
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                }}>
                    <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>
                        Total Terisi
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#EF4444" }}>
                        {totalTerisi} <span style={{ fontSize: "14px", fontWeight: "normal" }}>slot</span>
                    </div>
                </div>

                {/* Total Tersedia */}
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                }}>
                    <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>
                        Total Tersedia
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10B981" }}>
                        {totalTersedia} <span style={{ fontSize: "14px", fontWeight: "normal" }}>slot</span>
                    </div>
                </div>
            </div>

            {/* Form Tambah Area Baru */}
            <div className={styles.cardContainer} style={{ marginBottom: "24px" }}>
                <h2 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: "#1F2937"
                }}>
                    Tambah Area Baru
                </h2>

                <form action={createArea}>
                    <div className={styles.filterRow}>
                        {/* Input Nama Area */}
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Nama Area</label>
                            <input
                                type="text"
                                name="nama_area"
                                placeholder="Contoh: Zona A, Lantai 1"
                                required
                                className={styles.input}
                            />
                        </div>

                        {/* Input Kapasitas */}
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Kapasitas (slot)</label>
                            <input
                                type="number"
                                name="kapasitas"
                                placeholder="Contoh: 50"
                                required
                                min="1"
                                className={styles.input}
                            />
                        </div>

                        {/* Tombol Submit */}
                        <div className={styles.filterGroup} style={{ justifyContent: "flex-end" }}>
                            <button
                                type="submit"
                                style={{
                                    background: "#10B981",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    height: "44px"
                                }}
                            >
                                + Tambah Area
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tabel Daftar Area */}
            <div className={styles.cardContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Area</th>
                            <th>Kapasitas</th>
                            <th>Terisi</th>
                            <th>Tersedia</th>
                            <th>Status Kapasitas</th>
                            <th>Status Aktif</th>
                            <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {areaList.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center" }}>
                                    Belum ada data area parkir.
                                </td>
                            </tr>
                        ) : (
                            areaList.map((item, index) => {
                                const tersedia = item.kapasitas - (item.terisi || 0);
                                const persen = Math.round(((item.terisi || 0) / item.kapasitas) * 100);

                                // Tentukan status berdasarkan persentase terisi
                                let statusColor, statusText;
                                if (persen >= 90) {
                                    statusColor = "#EF4444"; // Merah - Hampir Penuh
                                    statusText = "Hampir Penuh";
                                } else if (persen >= 50) {
                                    statusColor = "#F59E0B"; // Kuning - Sedang
                                    statusText = "Sedang";
                                } else {
                                    statusColor = "#10B981"; // Hijau - Tersedia
                                    statusText = "Tersedia";
                                }

                                return (
                                    <tr key={item.id_area}>
                                        <td>{index + 1}</td>
                                        <td style={{ fontWeight: "500" }}>{item.nama_area}</td>
                                        <td>{item.kapasitas} slot</td>
                                        <td>{item.terisi || 0} slot</td>
                                        <td style={{ color: tersedia > 0 ? "#10B981" : "#EF4444" }}>
                                            {tersedia} slot
                                        </td>
                                        <td>
                                            {/* Status Badge */}
                                            <span style={{
                                                background: `${statusColor}20`,
                                                color: statusColor,
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}>
                                                {statusText} ({persen}%)
                                            </span>
                                        </td>
                                        <td>
                                            {/* Status Aktif/Nonaktif */}
                                            <span style={{
                                                background: item.is_active ? "#10B98120" : "#6B728020",
                                                color: item.is_active ? "#10B981" : "#6B7280",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}>
                                                {item.is_active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {/* Tombol Toggle Status */}
                                            <form action={toggleAreaStatus} style={{ display: 'inline' }}>
                                                <input type="hidden" name="id_area" value={item.id_area} />
                                                <input type="hidden" name="is_active" value={item.is_active} />
                                                <button
                                                    className={item.is_active ? styles.btnDanger : styles.btnPrimary}
                                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                                >
                                                    {item.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
