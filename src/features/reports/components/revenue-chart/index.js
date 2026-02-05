"use client";
// import komponen dari library recharts untuk membuat grafik
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// komponen grafik pendapatan
// menerima props data: array object { date, revenue }
export default function RevenueChart({ data }) {
    // cek kalau datanya kosong, tampilin pesan
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Belum ada data grafik.</div>;
    }

    return (
        // container pembungkus dengan tinggi tetap 300px
        <div style={{ width: '100%', height: 300 }}>
            {/* responsivecontainer bikin grafik menyesuaikan lebar layar otomatis */}
            <ResponsiveContainer>
                {/* barchart = jenis grafik batang */}
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    {/* cartesiangrid = garis bantu latar belakang (garis putus-putus) */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    {/* xaxis = sumbu horizontal (tanggal) */}
                    <XAxis
                        dataKey="date" // ambil data dari property 'date'
                        axisLine={false} // hilangin garis sumbu
                        tickLine={false} // hilangin garis strip kecil
                        tick={{ fontSize: 12, fill: '#6B7280' }} // styling teks
                        dy={10} // geser ke bawah dikit
                    />

                    {/* yaxis = sumbu vertikal (jumlah uang) */}
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        // format angka jadi 'Rp 500k' biar ringkas
                        tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                    />

                    {/* tooltip = info yang muncul pas kursor diarahkan ke batang */}
                    <Tooltip
                        cursor={{ fill: '#F3F4F6' }} // warna highlight background
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        // format angka di dalam tooltip (ribuan pake koma)
                        formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Pendapatan']}
                    />

                    {/* bar = batang grafiknya */}
                    <Bar
                        dataKey="revenue" // ambil nilai dari property 'revenue'
                        fill="#204DD2" // warna biru
                        radius={[4, 4, 0, 0]} // lengkungan sudut atas
                        barSize={40} // lebar batang
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
