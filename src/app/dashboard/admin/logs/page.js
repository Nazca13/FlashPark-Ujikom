import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LogsFilter } from "./LogsFilter";

export default async function LogsPage({ searchParams }) {
    const params = await searchParams;
    const { query, date } = params;

    // Build Filter
    const whereClause = {};

    if (query) {
        whereClause.OR = [
            { aktivitas: { contains: query } },
            { tb_user: { nama_lengkap: { contains: query } } }
        ];
    }

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        whereClause.waktu_aktivitas = {
            gte: startDate,
            lte: endDate
        };
    }

    // Ambil 50 log terakhir (Filtered)
    const logs = await prisma.tb_log_aktivitas.findMany({
        where: whereClause,
        take: 50,
        orderBy: { waktu_aktivitas: 'desc' },
        include: { tb_user: true } // Join ke tabel user untuk ambil nama
    });

    return (
        <DashboardLayout activePage="Log Aktivitas">
            <h1 className={styles.pageTitle}>Log Aktivitas Sistem</h1>

            {/* FILTER SECTION */}
            <LogsFilter />

            <div className={styles.cardContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            <th>User / Petugas</th>
                            <th>Aktivitas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr><td colSpan={3} style={{ textAlign: 'center', padding: '30px' }}>Belum ada aktivitas yang cocok.</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id_log}>
                                    <td style={{ color: '#6B7280' }}>
                                        {new Date(log.waktu_aktivitas).toLocaleString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td style={{ fontWeight: '600' }}>
                                        {log.tb_user ? log.tb_user.nama_lengkap : 'Sistem/Unknown'}
                                    </td>
                                    <td>{log.aktivitas}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}