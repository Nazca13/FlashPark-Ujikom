/**
 * ============================================================================
 * REVENUE CHART COMPONENT - src/features/reports/components/revenue-chart/index.js
 * ============================================================================
 * Komponen grafik batang (bar chart) untuk menampilkan tren pendapatan harian.
 * Menggunakan library Recharts untuk visualisasi data.
 * 
 * Data yang ditampilkan:
 * - Sumbu X (horizontal): Tanggal (format: "09 Feb")
 * - Sumbu Y (vertikal): Jumlah pendapatan dalam Rupiah
 * - Tooltip: Info detail saat hover di atas batang
 * 
 * @module RevenueChart
 * @path /dashboard/owner (bagian grafik)
 * ============================================================================
 */

// "use client" = berjalan di browser (Recharts butuh DOM browser untuk render grafik)
"use client";

// import komponen dari library Recharts
// BarChart     = container utama grafik batang
// Bar          = elemen batang individual
// XAxis        = sumbu horizontal (tanggal)
// YAxis        = sumbu vertikal (nilai uang)
// CartesianGrid = garis bantu latar belakang
// Tooltip      = popup info saat hover
// ResponsiveContainer = wrapper agar grafik responsif (menyesuaikan lebar layar)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * RevenueChart - Komponen Grafik Pendapatan Harian
 * 
 * @param {Object} props - Properties komponen
 * @param {Array} props.data - Array data grafik: [{date: "09 Feb", revenue: 150000}, ...]
 * @returns {JSX.Element} - Grafik batang atau pesan "Belum ada data"
 */
export default function RevenueChart({ data }) {
    // kalau data kosong atau tidak ada, tampilkan pesan
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Belum ada data grafik.</div>;
    }

    return (
        // container dengan tinggi tetap 300px untuk grafik
        <div style={{ width: '100%', height: 300 }}>

            {/* ResponsiveContainer = wrapper yang membuat grafik menyesuaikan lebar container */}
            {/* Tanpa ini, grafik akan overflow atau tidak sesuai lebar */}
            <ResponsiveContainer>

                {/* BarChart = tipe grafik batang */}
                {/* data = array data yang akan divisualisasikan */}
                {/* margin = jarak dari tepi container */}
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>

                    {/* CartesianGrid = garis bantu horizontal (putus-putus) */}
                    {/* strokeDasharray="3 3" = pola garis putus-putus (3px garis, 3px jeda) */}
                    {/* vertical={false} = hanya tampilkan garis horizontal, tanpa vertikal */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    {/* XAxis = sumbu horizontal (menampilkan tanggal) */}
                    <XAxis
                        dataKey="date"                                // ambil data dari property 'date'
                        axisLine={false}                              // hilangkan garis sumbu
                        tickLine={false}                              // hilangkan garis strip kecil di bawah label
                        tick={{ fontSize: 12, fill: '#6B7280' }}      // styling teks label (kecil, abu-abu)
                        dy={10}                                       // geser label 10px ke bawah (biar tidak nempel ke batang)
                    />

                    {/* YAxis = sumbu vertikal (menampilkan jumlah uang) */}
                    <YAxis
                        axisLine={false}                              // hilangkan garis sumbu
                        tickLine={false}                              // hilangkan garis strip
                        tick={{ fontSize: 12, fill: '#6B7280' }}      // styling teks label
                        // tickFormatter = format tampilan angka di sumbu Y
                        // contoh: 500000 → "Rp 500k" (lebih ringkas dan mudah dibaca)
                        tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                    />

                    {/* Tooltip = popup info yang muncul saat hover di atas batang */}
                    <Tooltip
                        cursor={{ fill: '#F3F4F6' }}                  // highlight area hover (abu-abu terang)
                        contentStyle={{                                // styling kotak tooltip
                            borderRadius: '8px',                       // sudut bulat
                            border: 'none',                            // tanpa border
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'   // shadow halus
                        }}
                        // formatter = format tampilan angka di dalam tooltip
                        // [nilai, label] → ["Rp 150.000", "Pendapatan"]
                        formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Pendapatan']}
                    />

                    {/* Bar = elemen batang grafik */}
                    <Bar
                        dataKey="revenue"                              // ambil nilai dari property 'revenue'
                        fill="#204DD2"                                  // warna batang: biru FlashPark
                        radius={[4, 4, 0, 0]}                         // sudut bulat di atas batang [kiriAtas, kananAtas, kananBawah, kiriBawah]
                        barSize={40}                                   // lebar setiap batang 40px
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
