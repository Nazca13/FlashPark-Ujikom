// import styling dari css module
import styles from "../admin.module.css";

// import koneksi database
import prisma from "@/lib/prisma";

// import fungsi createTarif dan deleteTarif dari actions.js
import { createTarif, deleteTarif } from "../actions";

// import layout dashboard
import { DashboardLayout } from "@/components/layout/dashboard-layout";

// ini server component, makanya bisa langsung async
export default async function TarifPage() {
    // ambil semua data tarif dari database
    // orderBy asc = urutkan dari id kecil ke besar
    const tarifList = await prisma.tb_tarif.findMany({ orderBy: { id_tarif: 'asc' } });

    return (
        // bungkus pake layout dashboard
        <DashboardLayout activePage="Data Tarif">
            {/* judul halaman */}
            <h1 className={styles.pageTitle}>Data Tarif Parkir</h1>

            {/* ===== FORM TAMBAH TARIF BARU ===== */}
            <div className={styles.cardContainer} style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>+ Set Tarif Baru</h3>

                {/* form langsung connect ke server action createTarif */}
                <form action={createTarif} className={styles.filterRow} style={{ alignItems: 'flex-end' }}>

                    {/* input jenis kendaraan */}
                    <div className={styles.filterGroup} style={{ flex: 2 }}>
                        <label className={styles.label}>Jenis Kendaraan</label>
                        <input name="jenis" className={styles.input} placeholder="Contoh: TRUK / BUS" required />
                    </div>

                    {/* input harga per jam */}
                    <div className={styles.filterGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Tarif Per Jam (Rp)</label>
                        <input name="tarif" type="number" className={styles.input} placeholder="5000" required />
                    </div>

                    {/* tombol submit */}
                    <button type="submit" className={styles.btnPrimary}>Tambah</button>
                </form>
            </div>

            {/* ===== TABEL DATA TARIF ===== */}
            <div className={styles.cardContainer}>
                <table className={styles.table}>
                    {/* header tabel */}
                    <thead>
                        <tr>
                            <th width="80">ID</th>
                            <th>Jenis Kendaraan</th>
                            <th>Harga / Jam</th>
                            <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    {/* body tabel, loop dari data tarifList */}
                    <tbody>
                        {tarifList.map((t) => (
                            <tr key={t.id_tarif}>
                                <td>#{t.id_tarif}</td>
                                {/* uppercase biar keliatan rapi */}
                                <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t.jenis_kendaraan}</td>
                                {/* format harga pake toLocaleString biar ada titik pemisah ribuan */}
                                <td>Rp {parseInt(t.tarif_per_jam).toLocaleString('id-ID')}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {/* proteksi: tarif default (motor/mobil) ga boleh dihapus */}
                                    {t.jenis_kendaraan.toLowerCase() !== 'mobil' && t.jenis_kendaraan.toLowerCase() !== 'motor' ? (
                                        // kalo bukan motor/mobil, tampilin tombol hapus
                                        <form action={deleteTarif}>
                                            <input type="hidden" name="id_tarif" value={t.id_tarif} />
                                            <button className={styles.btnDanger}>Hapus</button>
                                        </form>
                                    ) : (
                                        // kalo motor/mobil, tampilin text "Default" aja
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