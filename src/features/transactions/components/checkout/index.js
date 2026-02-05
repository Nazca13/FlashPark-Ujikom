"use client";
import { useState, useRef } from "react";
// import server action untuk cari data kendaraan dan proses checkout
import { searchKendaraanMasuk, checkoutKendaraan } from "@/features/transactions/actions";
// import styles dari module css
import styles from "@/app/dashboard/petugas/styles.module.css";
// import library untuk fitur print struk
import { useReactToPrint } from "react-to-print";

// komponen utama sistem checkout (keluar parkir)
// menerima props initialparkedvehicles: data awal kendaraan yg sedang parkir
export default function CheckoutSystem({ initialParkedVehicles = [] }) {
    // state untuk input pencarian plat nomor
    const [search, setSearch] = useState("");
    // state untuk menyimpan data kendaraan yang ditemukan
    const [data, setData] = useState(null);
    // state untuk indikator loading saat proses data
    const [loading, setLoading] = useState(false);
    // state untuk menandai apakah transaksi checkout sudah berhasil atau belum
    const [checkoutDone, setCheckoutDone] = useState(false);
    // state untuk menyimpan pesan error jika ada
    const [errorMsg, setErrorMsg] = useState("");

    // state untuk menyimpan daftar kendaraan yang sedang parkir
    // (biar bisa update realtime tanpa refresh halaman)
    const [parkedVehicles, setParkedVehicles] = useState(initialParkedVehicles);
    // state untuk filter pencarian di list sebelah kanan
    const [listSearch, setListSearch] = useState("");

    // ref untuk elemen struk yang akan diprint
    const componentRef = useRef();

    // logika untuk menyaring daftar kendaraan berdasarkan input pencarian list
    const filteredVehicles = parkedVehicles.filter(v =>
        v.plat_nomor.toLowerCase().includes(listSearch.toLowerCase())
    );

    // 1. cari kendaraan (bisa dari input manual atau klik list)
    async function handleSearch(manualPlat) {
        // tentukan plat nomor mana yang mau dicari (dari parameter atau state search)
        const platToSearch = typeof manualPlat === 'string' ? manualPlat : search;

        // kalau kosong, ga usah jalanin apa-apa
        if (!platToSearch) return;

        // mulai loading, reset error dan data sebelumnya
        setLoading(true);
        setErrorMsg("");
        setData(null);
        setCheckoutDone(false);

        // panggil server action untuk cari data di database
        const result = await searchKendaraanMasuk(platToSearch);

        if (result.success) {
            // kalau ketemu, simpan datanya ke state
            setData(result.data);
            setSearch(platToSearch); // update tampilan input field
        } else {
            // kalau ga ketemu, tampilkan pesan error
            setErrorMsg(result.error);
        }
        // selesai loading
        setLoading(false);
    }

    // 2. hitung biaya parkir
    const calculateCost = () => {
        // kalau ga ada data kendaraan, stop
        if (!data) return null;

        // hitung selisih waktu masuk dan waktu sekarang (keluar)
        const masuk = new Date(data.waktu_masuk);
        const keluar = new Date();
        const diffMs = keluar - masuk; // selisih dalam milidetik
        const diffMinutes = Math.floor(diffMs / (1000 * 60)); // konversi ke menit
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // konversi ke jam (pembulatan ke atas)

        // minimal bayar 1 jam, meskipun baru 10 menit
        const jamBayar = diffHours < 1 ? 1 : diffHours;

        // hitung total bayar: durasi jam x tarif per jam
        const total = jamBayar * data.tb_tarif.tarif_per_jam;

        // format durasi untuk ditampilkan (jam & menit)
        const d_h = Math.floor(diffMinutes / 60);
        const d_m = diffMinutes % 60;
        const durasiText = `${d_h} Jam ${d_m} Menit`;

        // kembalikan hasil perhitungan
        return {
            keluarTime: keluar,
            durasiJam: jamBayar,
            durasiText: durasiText,
            totalBayar: total
        };
    };

    // 3. proses checkout (simpan transaksi)
    async function handleCheckout() {
        // kalkulasi dulu biayanya
        const info = calculateCost();
        if (!info) return;

        setLoading(true);

        // panggil server action untuk simpan data checkout ke database
        const res = await checkoutKendaraan(data.id_parkir, info.totalBayar, data.id_area);

        if (res.success) {
            // kalau sukses
            setCheckoutDone(true); // tandai selesai

            // update data lokal biar tampilan berubah (ada status keluar & struk muncul)
            setData(prev => ({
                ...prev,
                waktu_keluar: info.keluarTime,
                biaya_total: info.totalBayar,
                status: 'keluar'
            }));

            // hapus kendaraan dari daftar parkir di sebelah kanan (karena udah keluar)
            setParkedVehicles(prev => prev.filter(v => v.id_parkir !== data.id_parkir));
        } else {
            // kalau gagal, munculin alert
            alert("Gagal Checkout: " + res.error);
        }
        setLoading(false);
    }

    // 4. print receipt (cetak struk)
    // menggunakan hook useReactToPrint
    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current, // elemen mana yang mau diprint
    //     documentTitle: `STRUK-${data?.plat_nomor}`, // nama file kalau disave pdf
    // });

    // fungsi reset form untuk transaksi baru
    const resetForm = () => {
        setSearch("");
        setData(null);
        setCheckoutDone(false);
        setErrorMsg("");
        setShowReceipt(false); // reset juga status struk
    };

    // hitung info biaya kalau data tersedia
    const info = data ? calculateCost() : null;

    return (
        <div className={styles.checkoutGrid}>

            {/* sisi kiri: form & detail */}
            <div className={styles.leftSide}>

                {/* tampilkan form pencarian kalau belum ada data yang dipilih */}
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
                                maxLength={12}
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

                {/* tampilkan detail kendaraan & pembayaran kalau data sudah ada */}
                {data && info && (
                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                                Detail: <span style={{ color: '#204DD2' }}>{data.plat_nomor}</span>
                            </h3>
                            {/* tombol cari ulang (batal) kalau belum checkout */}
                            {!checkoutDone && (
                                <button onClick={() => setData(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                    Cari Ulang
                                </button>
                            )}
                        </div>

                        {/* grid informasi detail parkir */}
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

                        {/* banner harga total */}
                        <div className={`${styles.priceBanner} ${checkoutDone ? styles.priceBannerSuccess : styles.priceBannerPending}`}>
                            <p className={styles.priceTitle} style={{ color: checkoutDone ? '#059669' : '#204DD2' }}>
                                {checkoutDone ? "TRANSAKSI BERHASIL" : "TOTAL PEMBAYARAN"}
                            </p>
                            <h2 className={styles.priceValue} style={{ color: checkoutDone ? '#059669' : '#111827' }}>
                                Rp {parseInt(info.totalBayar).toLocaleString()}
                            </h2>
                            {!checkoutDone && <p className={styles.priceMeta}>Silakan terima pembayaran dari pelanggan</p>}
                        </div>

                        {/* hidden receipt (struk rahasia) - cuma dirender buat diprint, ga tampil di layar */}
                        {/* Removed as per instruction, as useReactToPrint is no longer used */}
                        {/* <div style={{ display: 'none' }}>
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
                        </div> */}

                        {/* tombol aksi */}
                        {!checkoutDone ? (
                            // kalau belum checkout, tombolnya "konfirmasi pembayaran"
                            <button onClick={handleCheckout} className={styles.btnSubmit} disabled={loading} style={{ marginTop: '0px' }}>
                                {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
                            </button>
                        ) : (
                            // kalau sudah checkout, tombolnya "cetak struk" dan "transaksi baru"
                            <div className={styles.actionGroup}>
                                <button onClick={() => setShowReceipt(true)} className={`${styles.btnSubmit} ${styles.btnSuccess}`} style={{ flex: 1, marginTop: 0 }}>
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

            {/* sisi kanan: daftar kendaraan parkir */}
            <div className={`${styles.card} ${styles.rightSide}`}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '15px' }}>Daftar Kendaraan Parkir</h3>

                {/* input pencarian filter list */}
                <div className={styles.listSearchWrapper}>
                    <input
                        type="text"
                        placeholder="Cari Plat Nomor..."
                        className={styles.listSearchInput}
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value.toUpperCase())}
                    />
                </div>

                {/* daftar list kendaraan */}
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
                        // tampilan kalau list kosong
                        <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '50px' }}>
                            <p>Tidak ada kendaraan ditemukan</p>
                        </div>
                    )}
                </div>

                {/* footer total kendaraan */}
                <div style={{ marginTop: 'auto', fontSize: '13px', color: '#6B7280', textAlign: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '15px' }}>
                    Total: <strong style={{ color: '#111827' }}>{parkedVehicles.length}</strong> Kendaraan
                </div>
            </div>

            {/* ===== POP-UP STRUK ONLINE ===== */}
            {showReceipt && data && info && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Struk Parkir Online</h2>
                            <p>FlashPark - Parkir Modern & Aman</p>
                        </div>

                        <div className={styles.receiptPaper}>
                            <div className={styles.receiptItem}>
                                <span className={styles.receiptLabel}>Plat Nomor</span>
                                <span className={styles.receiptValue}>{data.plat_nomor}</span>
                            </div>
                            <div className={styles.receiptItem}>
                                <span className={styles.receiptLabel}>Jenis</span>
                                <span className={styles.receiptValue}>{data.tb_tarif.jenis_kendaraan}</span>
                            </div>
                            <div className={styles.receiptDivider} />
                            <div className={styles.receiptItem}>
                                <span className={styles.receiptLabel}>Waktu Masuk</span>
                                <span className={styles.receiptValue}>{new Date(data.waktu_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={styles.receiptItem}>
                                <span className={styles.receiptLabel}>Waktu Keluar</span>
                                <span className={styles.receiptValue}>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={styles.receiptItem}>
                                <span className={styles.receiptLabel}>Durasi</span>
                                <span className={styles.receiptValue}>{info.durasiText}</span>
                            </div>
                            <div className={styles.receiptDivider} />
                            <div className={styles.receiptTotal}>
                                <span>TOTAL BAYAR</span>
                                <span>Rp {parseInt(info.totalBayar).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.btnOk} onClick={() => setShowReceipt(false)}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
