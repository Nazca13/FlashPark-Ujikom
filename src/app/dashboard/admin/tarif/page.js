import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { createTarif, deleteTarif } from "../actions";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function TarifPage() {
    const tarifList = await prisma.tb_tarif.findMany({ orderBy: { id_tarif: 'asc' } });

    return (
        <DashboardLayout activePage="Data Tarif">
            <h1 className={styles.pageTitle}>Data Tarif Parkir</h1>

            {/* FORM TAMBAH TARIF */}
            <div className={styles.cardContainer} style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>+ Set Tarif Baru</h3>
                <form action={createTarif} className={styles.filterRow} style={{ alignItems: 'flex-end' }}>

                    <div className={styles.filterGroup} style={{ flex: 2 }}>
                        <label className={styles.label}>Jenis Kendaraan</label>
                        <input name="jenis" className={styles.input} placeholder="Contoh: TRUK / BUS" required />
                    </div>

                    <div className={styles.filterGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Tarif Per Jam (Rp)</label>
                        <input name="tarif" type="number" className={styles.input} placeholder="5000" required />
                    </div>

                    <button type="submit" className={styles.btnPrimary}>Tambah</button>
                </form>
            </div>

            {/* TABEL TARIF */}
            <div className={styles.cardContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th width="80">ID</th>
                            <th>Jenis Kendaraan</th>
                            <th>Harga / Jam</th>
                            <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tarifList.map((t) => (
                            <tr key={t.id_tarif}>
                                <td>#{t.id_tarif}</td>
                                <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t.jenis_kendaraan}</td>
                                <td>Rp {parseInt(t.tarif_per_jam).toLocaleString('id-ID')}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {/* Kita proteksi agar Mobil & Motor (ID 1 & 2) tidak sengaja terhapus */}
                                    {t.jenis_kendaraan.toLowerCase() !== 'mobil' && t.jenis_kendaraan.toLowerCase() !== 'motor' ? (
                                        <form action={deleteTarif}>
                                            <input type="hidden" name="id_tarif" value={t.id_tarif} />
                                            <button className={styles.btnDanger}>Hapus</button>
                                        </form>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Default</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}