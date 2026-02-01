import { PetugasLayout } from "@/components/layout/PetugasLayout";
import prisma from "@/lib/prisma";
import TransactionForm from "./TransactionForm";
import styles from "./petugas.module.css";

// Agar data selalu fresh saat dibuka (Dynamic Rendering)
export const dynamic = 'force-dynamic';

export default async function PetugasDashboard() {
    // 1. Ambil Data Master (Tarif & Area)
    const tarifData = await prisma.tb_tarif.findMany();
    const areaData = await prisma.tb_area_parkir.findMany();

    // 2. Ambil Data Transaksi Hari Ini (Buat List History di kanan)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentTx = await prisma.tb_transaksi.findMany({
        where: {
            waktu_masuk: { gte: today } // Transaksi dari jam 00:00 hari ini
        },
        orderBy: { waktu_masuk: 'desc' }, // Yang baru masuk paling atas
        take: 5,
        include: { tb_tarif: true }
    });

    // 3. Hitung Statistik Sederhana
    const totalKapasitas = areaData.reduce((acc, curr) => acc + curr.kapasitas, 0);
    const totalTerisi = areaData.reduce((acc, curr) => acc + (curr.terisi || 0), 0);
    const sisaSlot = totalKapasitas - totalTerisi;

    return (
        <PetugasLayout activePage="Dashboard">
            <div className={styles.container}>

                {/* KOLOM KIRI: Form Input Utama */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>⛔ Kendaraan Masuk</h2>
                    <TransactionForm
                        tarifList={tarifData}
                        areaList={areaData}
                        userId={1} // Nanti diganti session.user.id
                    />
                </div>

                {/* KOLOM KANAN: Statistik & History */}
                <div>
                    {/* Kartu Biru Besar (Sisa Slot) */}
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Kapasitas Tersedia</div>
                        <div className={styles.statNumber}>{sisaSlot}</div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>Dari total {totalKapasitas} slot</div>
                    </div>

                    {/* Kartu List Kendaraan Terakhir */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle} style={{ fontSize: '16px' }}>Baru Saja Masuk</h3>

                        {recentTx.length === 0 ? (
                            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>Belum ada kendaraan masuk.</p>
                        ) : (
                            recentTx.map((tx) => (
                                <div key={tx.id_parkir} className={styles.historyItem}>
                                    <div>
                                        <div className={styles.historyPlat}>{tx.plat_nomor}</div>
                                        <div className={styles.historyMeta}>
                                            {tx.tb_tarif.jenis_kendaraan} • {new Date(tx.waktu_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <span className={`${styles.badge} ${styles.badgeMasuk}`}>Masuk</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </PetugasLayout>
    );
}