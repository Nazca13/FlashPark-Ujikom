import { OwnerLayout } from "@/components/layouts/owner-layout";
import { getOwnerStats, getRevenueChartData } from "@/features/reports/actions";
import RevenueChart from "@/features/reports/components/revenue-chart";
import ExportButton from "@/components/ui/buttons/export-button";
import OwnerFilter from "@/features/reports/components/owner-filter";

export const dynamic = 'force-dynamic';

// Styling Card (Inline biar praktis)
const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
    flex: 1
};

export default async function OwnerDashboard({ searchParams }) {
    const params = await searchParams;
    // Fetch Data
    const stats = await getOwnerStats(params);
    const chartData = await getRevenueChartData(params);

    return (
        <OwnerLayout activePage="Dashboard">

            {/* HEADER SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '4px' }}>
                        Dashboard Owner
                    </h1>
                    <p style={{ color: '#6B7280' }}>Pantau performa bisnis parkir Anda hari ini.</p>
                </div>
                <ExportButton stats={stats} chartData={chartData} />
            </div>

            {/* FILTER SECTION */}
            <OwnerFilter />

            {/* SUMMARY CARDS */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                {/* 1. Pendapatan Hari Ini */}
                <div style={cardStyle}>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Pendapatan Hari Ini</p>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                        Rp {stats.today.toLocaleString()}
                    </h2>
                </div>

                {/* 2. Pendapatan Bulan Ini */}
                <div style={cardStyle}>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Pendapatan Bulan Ini</p>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#204DD2', margin: 0 }}>
                        Rp {stats.month.toLocaleString()}
                    </h2>
                </div>

                {/* 3. Total Transaksi */}
                <div style={cardStyle}>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>Total Kendaraan Keluar</p>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>
                        {stats.totalTransactions} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>Unit</span>
                    </h2>
                </div>
            </div>

            {/* CHART SECTION */}
            <div style={{ ...cardStyle, flex: 'none' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1F2937' }}>
                    Tren Pendapatan (7 Hari Terakhir)
                </h3>
                <RevenueChart data={chartData} />
            </div>

        </OwnerLayout>
    );
}
