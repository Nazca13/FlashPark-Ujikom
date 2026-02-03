"use client";
import { useState, useRef } from "react";
import { searchKendaraanMasuk, checkoutKendaraan } from "../actions";
import styles from "../petugas.module.css";
import { useReactToPrint } from "react-to-print";

export default function CheckoutSystem({ initialParkedVehicles = [] }) {
    const [search, setSearch] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkoutDone, setCheckoutDone] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // State untuk list kendaraan parkir
    const [parkedVehicles, setParkedVehicles] = useState(initialParkedVehicles);
    const [listSearch, setListSearch] = useState("");

    const componentRef = useRef();

    // Filtered list based on search
    const filteredVehicles = parkedVehicles.filter(v =>
        v.plat_nomor.toLowerCase().includes(listSearch.toLowerCase())
    );

    // 1. CARI KENDARAAN (Sama tapi bisa dipanggil manual)
    async function handleSearch(manualPlat) {
        const platToSearch = typeof manualPlat === 'string' ? manualPlat : search;
        if (!platToSearch) return;

        setLoading(true);
        setErrorMsg("");
        setData(null);
        setCheckoutDone(false);

        const result = await searchKendaraanMasuk(platToSearch);
        if (result.success) {
            setData(result.data);
            setSearch(platToSearch); // Update input field
        } else {
            setErrorMsg(result.error);
        }
        setLoading(false);
    }

    // 2. HITUNG BIAYA PARKIR
    const calculateCost = () => {
        if (!data) return null;

        const masuk = new Date(data.waktu_masuk);
        const keluar = new Date();
        const diffMs = keluar - masuk;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

        const jamBayar = diffHours < 1 ? 1 : diffHours;
        const total = jamBayar * data.tb_tarif.tarif_per_jam;

        const d_h = Math.floor(diffMinutes / 60);
        const d_m = diffMinutes % 60;
        const durasiText = `${d_h} Jam ${d_m} Menit`;

        return {
            keluarTime: keluar,
            durasiJam: jamBayar,
            durasiText: durasiText,
            totalBayar: total
        };
    };

    // 3. PROSES CHECKOUT
    async function handleCheckout() {
        const info = calculateCost();
        if (!info) return;

        setLoading(true);
        const res = await checkoutKendaraan(data.id_parkir, info.totalBayar, data.id_area);

        if (res.success) {
            setCheckoutDone(true);
            setData(prev => ({
                ...prev,
                waktu_keluar: info.keluarTime,
                biaya_total: info.totalBayar,
                status: 'keluar'
            }));
            // Remove from local list
            setParkedVehicles(prev => prev.filter(v => v.id_parkir !== data.id_parkir));
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

    const resetForm = () => {
        setSearch("");
        setData(null);
        setCheckoutDone(false);
        setErrorMsg("");
    };

    const info = data ? calculateCost() : null;

    return (
        <div className={styles.checkoutGrid}>

            {/* SISI KIRI: FORM & DETAIL */}
            <div className={styles.leftSide}>
                {!data && (
                    <div className={styles.card} style={{ textAlign: 'center' }}>
                        <h3 className={styles.cardTitle}>Pencarian Kendaraan</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <input
                                type="text"
                                className={styles.inputPlat}
                                placeholder="D 1234 ABC"
                                value={search}
                                onChange={(e) => setSearch(e.target.value.toUpperCase())}
                                required
                            />
                            {errorMsg && (
                                <div style={{ marginTop: '15px', color: '#EF4444', fontWeight: '600' }}>
                                    {errorMsg}
                                </div>
                            )}
                            <button type="submit" className={styles.btnSubmit} disabled={loading}>
                                {loading ? "Mencari..." : "Cari Data Parkir"}
                            </button>
                        </form>
                    </div>
                )}

                {data && info && (
                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                                Detail: <span style={{ color: '#204DD2' }}>{data.plat_nomor}</span>
                            </h3>
                            {!checkoutDone && (
                                <button onClick={() => setData(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                    Cari Ulang
                                </button>
                            )}
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <p className={styles.infoLabel}>Waktu Masuk</p>
                                <p className={styles.infoValue}>{new Date(data.waktu_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <p className={styles.infoLabel}>Jenis Kendaraan</p>
                                <p className={styles.infoValue}>{data.tb_tarif.jenis_kendaraan}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <p className={styles.infoLabel}>Durasi Parkir</p>
                                <p className={styles.infoValue}>{info.durasiText}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <p className={styles.infoLabel}>Tarif Per Jam</p>
                                <p className={styles.infoValue}>Rp {data.tb_tarif.tarif_per_jam.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className={`${styles.priceBanner} ${checkoutDone ? styles.priceBannerSuccess : styles.priceBannerPending}`}>
                            <p className={styles.priceTitle} style={{ color: checkoutDone ? '#059669' : '#204DD2' }}>
                                {checkoutDone ? "TRANSAKSI BERHASIL" : "TOTAL PEMBAYARAN"}
                            </p>
                            <h2 className={styles.priceValue} style={{ color: checkoutDone ? '#059669' : '#111827' }}>
                                Rp {parseInt(info.totalBayar).toLocaleString()}
                            </h2>
                            {!checkoutDone && <p className={styles.priceMeta}>Silakan terima pembayaran dari pelanggan</p>}
                        </div>

                        {/* HIDDEN RECEIPT */}
                        <div style={{ display: 'none' }}>
                            <div ref={componentRef} style={{ padding: '40px', width: '380px', fontFamily: 'monospace' }}>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ margin: 0 }}>FLASHPARK</h2>
                                    <p>Sistem Parkir Modern</p>
                                    <p>--------------------------------</p>
                                </div>
                                <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>ID PARKIR:</span> <span>#{data.id_parkir}</span>
                                </div>
                                <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>PLAT NOMOR:</span> <span style={{ fontWeight: 'bold' }}>{data.plat_nomor}</span>
                                </div>
                                <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>JENIS:</span> <span>{data.tb_tarif.jenis_kendaraan}</span>
                                </div>
                                <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>MASUK:</span> <span>{new Date(data.waktu_masuk).toLocaleString()}</span>
                                </div>
                                <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>KELUAR:</span> <span>{info.keluarTime.toLocaleString()}</span>
                                </div>
                                <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>DURASI:</span> <span>{info.durasiJam} Jam</span>
                                </div>
                                <div style={{ borderTop: '1px dashed #000', margin: '15px 0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                                    <span>TOTAL:</span> <span>Rp {parseInt(info.totalBayar).toLocaleString()}</span>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                    <p>Terima Kasih</p>
                                    <p>Semoga Selamat Sampai Tujuan</p>
                                </div>
                            </div>
                        </div>

                        {!checkoutDone ? (
                            <button onClick={handleCheckout} className={styles.btnSubmit} disabled={loading} style={{ marginTop: '0px' }}>
                                {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
                            </button>
                        ) : (
                            <div className={styles.actionGroup}>
                                <button onClick={handlePrint} className={`${styles.btnSubmit} ${styles.btnSuccess}`} style={{ flex: 1, marginTop: 0 }}>
                                    Cetak Struk
                                </button>
                                <button onClick={resetForm} className={`${styles.btnSubmit} ${styles.btnSecondary}`} style={{ flex: 1, marginTop: 0 }}>
                                    Transaksi Baru
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SISI KANAN: LIST KENDARAAN PARKIR */}
            <div className={`${styles.card} ${styles.rightSide}`}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '15px' }}>Daftar Kendaraan Parkir</h3>

                <div className={styles.listSearchWrapper}>
                    <input
                        type="text"
                        placeholder="Cari Plat Nomor..."
                        className={styles.listSearchInput}
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value.toUpperCase())}
                    />
                </div>

                <div className={styles.parkedList}>
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((v) => (
                            <div
                                key={v.id_parkir}
                                onClick={() => handleSearch(v.plat_nomor)}
                                className={`${styles.parkedItem} ${data?.id_parkir === v.id_parkir ? styles.parkedItemActive : ''}`}
                            >
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemPlat}>{v.plat_nomor}</p>
                                    <p className={styles.itemMeta}>
                                        {v.tb_tarif.jenis_kendaraan} • {new Date(v.waktu_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div style={{ color: '#204DD2' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '50px' }}>
                            <p>Tidak ada kendaraan ditemukan</p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto', fontSize: '13px', color: '#6B7280', textAlign: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '15px' }}>
                    Total: <strong style={{ color: '#111827' }}>{parkedVehicles.length}</strong> Kendaraan
                </div>
            </div>

        </div>
    );
}
