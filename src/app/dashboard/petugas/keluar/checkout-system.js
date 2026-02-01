"use client";
import { useState, useRef } from "react";
import { searchKendaraanMasuk, checkoutKendaraan } from "../actions";
import styles from "../petugas.module.css";
import { useReactToPrint } from "react-to-print";

export default function CheckoutSystem() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkoutDone, setCheckoutDone] = useState(false);

    // Ref untuk cetak struk
    const componentRef = useRef();

    // 1. CARI KENDARAAN
    async function handleSearch(e) {
        e.preventDefault();
        setLoading(true);
        setData(null);
        setCheckoutDone(false);

        const result = await searchKendaraanMasuk(search);
        if (result.success) {
            setData(result.data);
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    // 2. HITUNG BIAYA PARKIR
    const calculateCost = () => {
        if (!data) return 0;

        const masuk = new Date(data.waktu_masuk);
        const keluar = new Date(); // Anggap keluar sekarang
        const diffMs = keluar - masuk;
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Pembulatan ke atas (ex: 1 jam 1 menit = 2 jam)

        // Minimal 1 jam
        const jamBayar = diffHours < 1 ? 1 : diffHours;
        const tarif = data.tb_tarif.tarif_per_jam;
        const total = jamBayar * tarif;

        return {
            keluarTime: keluar,
            durasiJam: jamBayar,
            totalBayar: total
        };
    };

    // 3. PROSES CHECKOUT
    async function handleCheckout() {
        if (!confirm("Proses pembayaran dan checkout kendaraan ini?")) return;

        const { totalBayar } = calculateCost();
        setLoading(true);

        const res = await checkoutKendaraan(data.id_parkir, totalBayar, data.id_area);

        if (res.success) {
            setCheckoutDone(true);
            // Auto Update data lokal biar yang tampil data 'keluar'
            setData(prev => ({
                ...prev,
                waktu_keluar: new Date(),
                biaya_total: totalBayar,
                status: 'keluar'
            }));
        } else {
            alert("Gagal Checkout: " + res.error);
        }
        setLoading(false);
    }

    // 4. PRINT RECEIPT
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `STRUK-${data?.plat_nomor}`,
    });

    const info = data ? calculateCost() : null;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            {/* SEARCH BOX */}
            <div className={styles.card} style={{ marginBottom: '20px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        className={styles.inputPlat}
                        placeholder="Cari Plat Nomor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value.toUpperCase())}
                        required
                    />
                    <button type="submit" className={styles.btnSubmit} style={{ width: 'auto', padding: '0 20px' }} disabled={loading}>
                        {loading ? "..." : "Cari 🔍"}
                    </button>
                </form>
            </div>

            {/* RESULT SECTION */}
            {data && info && (
                <div className={styles.card}>
                    <div ref={componentRef} className={styles.receiptArea}>
                        <div style={{ textAlign: 'center', borderBottom: '2px dashed #ddd', paddingBottom: '15px', marginBottom: '15px' }}>
                            <h2 style={{ margin: 0 }}>FLASHPARK</h2>
                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Struk Parkir Resmi</p>
                        </div>

                        <div className={styles.receiptRow}>
                            <span>No. Karcis</span>
                            <span>#{data.id_parkir}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Plat Nomor</span>
                            <span style={{ fontWeight: 'bold' }}>{data.plat_nomor}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Jenis</span>
                            <span>{data.tb_tarif.jenis_kendaraan}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Masuk</span>
                            <span>{new Date(data.waktu_masuk).toLocaleString()}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Keluar</span>
                            <span>{info.keluarTime.toLocaleString()}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Durasi</span>
                            <span>{info.durasiJam} Jam</span>
                        </div>

                        <div style={{ borderTop: '2px dashed #ddd', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                            <span>TOTAL BAYAR</span>
                            <span>Rp {parseInt(info.totalBayar).toLocaleString()}</span>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
                            -- Terima Kasih --
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    {!checkoutDone ? (
                        <button onClick={handleCheckout} className={styles.btnSubmit} style={{ marginTop: '20px', backgroundColor: '#EF4444' }}>
                            💰 Bayar & Checkout
                        </button>
                    ) : (
                        <button onClick={handlePrint} className={styles.btnSubmit} style={{ marginTop: '20px', backgroundColor: '#10B981' }}>
                            🖨️ Cetak Struk
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
