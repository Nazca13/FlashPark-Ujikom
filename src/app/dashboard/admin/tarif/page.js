/**
 * ============================================================================
 * DATA TARIF PAGE - Halaman Kelola Tarif Parkir
 * ============================================================================
 * Halaman ini menampilkan daftar tarif parkir berdasarkan jenis kendaraan
 * dan memungkinkan admin untuk menambah atau mengedit tarif.
 * 
 * @module DataTarif
 * @path /dashboard/admin/tarif
 * ============================================================================
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getTarif, saveTarif } from "./actions";
import styles from "../DashboardPage.module.css";

/**
 * DataTarifPage - Komponen Halaman Data Tarif
 * 
 * @async - Server Component untuk mengambil data dari database
 * @returns {JSX.Element} - Halaman dengan tabel tarif dan form tambah/edit
 */
export default async function DataTarifPage() {
    // ==========================================================================
    // DATA FETCHING
    // ==========================================================================

    /**
     * Mengambil semua data tarif dari database
     * @const {Array} tarifList - Array berisi semua data tarif
     */
    const tarifList = await getTarif();

    // ==========================================================================
    // HELPER FUNCTIONS
    // ==========================================================================

    /**
     * formatRupiah - Memformat angka menjadi format mata uang Rupiah
     * @param {number} angka - Angka yang akan diformat
     * @returns {string} - Format Rupiah (contoh: "Rp5.000")
     */
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(angka);
    };

    // ==========================================================================
    // RENDER JSX
    // ==========================================================================

    return (
        <DashboardLayout activePage="Data Tarif">
            {/* Page Title */}
            <h1 className={styles.pageTitle}>Data Tarif</h1>

            {/* Form Tambah Tarif Baru */}
            <div className={styles.cardContainer} style={{ marginBottom: "24px" }}>
                <h2 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: "#1F2937"
                }}>
                    Tambah Tarif Baru
                </h2>

                <form action={saveTarif}>
                    <div className={styles.filterRow}>
                        {/* Input Jenis Kendaraan */}
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Jenis Kendaraan</label>
                            <input
                                type="text"
                                name="jenis_kendaraan"
                                placeholder="Contoh: Motor, Mobil"
                                required
                                className={styles.input}
                            />
                        </div>

                        {/* Input Tarif Per Jam */}
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Tarif Per Jam (Rp)</label>
                            <input
                                type="number"
                                name="tarif_per_jam"
                                placeholder="Contoh: 5000"
                                required
                                min="0"
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
                                + Tambah Tarif
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tabel Daftar Tarif */}
            <div className={styles.cardContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Jenis Kendaraan</th>
                            <th>Tarif Per Jam</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tarifList.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                    Belum ada data tarif.
                                </td>
                            </tr>
                        ) : (
                            tarifList.map((item, index) => (
                                <tr key={item.id_tarif}>
                                    <td>{index + 1}</td>
                                    <td>{item.jenis_kendaraan}</td>
                                    <td>{formatRupiah(item.tarif_per_jam)}</td>
                                    <td>
                                        {/* Form Edit Inline */}
                                        <form action={saveTarif} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <input type="hidden" name="id_tarif" value={item.id_tarif} />
                                            <input
                                                type="hidden"
                                                name="jenis_kendaraan"
                                                value={item.jenis_kendaraan}
                                            />
                                            <input
                                                type="number"
                                                name="tarif_per_jam"
                                                defaultValue={item.tarif_per_jam}
                                                min="0"
                                                style={{
                                                    width: "100px",
                                                    padding: "6px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #E5E7EB",
                                                    fontSize: "14px"
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                style={{
                                                    background: "#E0F2FE",
                                                    color: "#0284C7",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Update
                                            </button>
                                        </form>
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
