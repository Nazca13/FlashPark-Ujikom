/**
 * ============================================================================
 * TRANSACTION FORM - src/components/forms/transaction-form/index.js
 * ============================================================================
 * Komponen form untuk proses CHECK-IN kendaraan masuk parkir (Client Component).
 * Ditampilkan di halaman dashboard petugas.
 * 
 * Form terdiri dari 4 bagian:
 * 1. Input plat nomor (auto uppercase, max 11 karakter)
 * 2. Pilihan jenis kendaraan (radio button dengan ikon visual)
 * 3. Pilihan area/lokasi parkir (dropdown dengan info sisa slot)
 * 4. Tombol "Cetak Karcis Masuk"
 * 
 * Setelah submit berhasil, halaman otomatis reload untuk refresh data.
 * 
 * @module TransactionForm
 * @path /dashboard/petugas (form kendaraan masuk)
 * ============================================================================
 */

// "use client" = komponen ini berjalan di browser (butuh interaksi: ketik, klik, pilih)
"use client";

// import Image dari Next.js untuk ikon kendaraan
import Image from "next/image";

// import useState untuk state management lokal (loading, plat, selectedTarif)
import { useState } from "react";

// import server action checkInKendaraan untuk proses kendaraan masuk
import { checkInKendaraan } from "@/features/transactions/actions";

// import styling dari halaman petugas
import styles from "@/app/dashboard/petugas/styles.module.css";

/**
 * TransactionForm - Komponen Form Check-In Kendaraan
 * 
 * @param {Object} props - Properties komponen
 * @param {Array} props.tarifList - Daftar tarif dari database [{id_tarif, jenis_kendaraan, tarif_per_jam}]
 * @param {Array} props.areaList - Daftar area parkir [{id_area, nama_area, kapasitas, terisi}]
 * @param {number} props.userId - ID petugas yang sedang bertugas (dari session)
 * @returns {JSX.Element} - Form check-in dengan input plat, pilihan kendaraan, area, dan tombol submit
 */
export default function TransactionForm({ tarifList, areaList, userId }) {
    // state loading: true saat form sedang diproses
    const [loading, setLoading] = useState(false);

    // state plat: menyimpan teks plat nomor (controlled input)
    const [plat, setPlat] = useState("");

    // state selectedTarif: menyimpan ID tarif yang dipilih (untuk highlight visual)
    const [selectedTarif, setSelectedTarif] = useState(null);

    /**
     * handlePlatChange - Handler untuk input plat nomor
     * Otomatis konversi ke huruf besar (uppercase) saat mengetik.
     * 
     * @param {Event} e - Event dari input onChange
     */
    const handlePlatChange = (e) => {
        // paksa semua huruf jadi uppercase (contoh: "d 1234 abc" → "D 1234 ABC")
        let val = e.target.value.toUpperCase();
        setPlat(val); // simpan ke state
    };

    /**
     * handleSubmit - Handler saat form di-submit
     * Memanggil server action checkInKendaraan dan handle hasilnya.
     * 
     * @param {FormData} formData - Data form yang dikirim
     */
    async function handleSubmit(formData) {
        setLoading(true);  // tampilkan loading state

        // panggil server action check-in
        const result = await checkInKendaraan(formData);

        if (result.success) {
            // berhasil: reload halaman untuk refresh data
            window.location.reload();
        } else {
            // gagal: tampilkan error dan matikan loading
            alert("Gagal: " + result.error);
            setLoading(false);
        }
    }

    return (
        // form dengan action = handleSubmit (Next.js progressive enhancement)
        <form action={handleSubmit}>

            {/* ===== 1. INPUT PLAT NOMOR ===== */}
            <div>
                {/* label untuk input plat nomor */}
                <label
                    className={styles.platLabel}
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        fontWeight: '800',
                        marginBottom: '10px',
                        color: '#000000',
                        fontSize: '16px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                >
                    MASUKKAN PLAT NOMOR
                </label>
                {/* input teks untuk plat nomor */}
                <input
                    className={styles.inputPlat}
                    name="plat_nomor"             // nama field untuk FormData
                    type="text"
                    placeholder="D 1234 ABC"      // placeholder contoh plat nomor
                    required                       // wajib diisi
                    autoComplete="off"             // matikan autocomplete browser
                    maxLength={11}                 // maksimal 11 karakter (format: D 1234 ABC)
                    value={plat}                   // controlled input: nilai dari state
                    onChange={handlePlatChange}     // panggil handler saat ketik
                />
            </div>

            {/* ===== 2. PILIHAN JENIS KENDARAAN (RADIO BUTTON VISUAL) ===== */}
            <div className={styles.vehicleGroup}>
                {/* loop setiap tarif dan tampilkan sebagai card yang bisa dipilih */}
                {tarifList.map((item) => {
                    // cek apakah tarif ini yang sedang dipilih
                    const isSelected = selectedTarif === item.id_tarif;

                    // tentukan jenis ikon berdasarkan nama kendaraan
                    let iconType = 'lainnya'; // default: ikon lainnya
                    const jenis = item.jenis_kendaraan.toLowerCase();

                    // deteksi jenis kendaraan dari nama
                    if (jenis.includes('mobil')) iconType = 'mobil';       // kalau mengandung "mobil"
                    else if (jenis.includes('motor')) iconType = 'motor';  // kalau mengandung "motor"

                    // pilih file ikon sesuai status selected
                    // selected: ikon warna biru (*-on.svg), belum selected: ikon abu-abu (*-off.svg)
                    const iconSrc = `/content/${iconType}-${isSelected ? 'on' : 'off'}.svg`;

                    return (
                        // label membungkus radio button (klik di mana saja pada card = pilih radio)
                        <label key={item.id_tarif} className={`${styles.vehicleOption} ${isSelected ? styles.selected : ''}`}>
                            {/* radio button tersembunyi (visual card menggantikan) */}
                            <input
                                type="radio"
                                name="id_tarif"                          // nama field untuk FormData
                                value={item.id_tarif}                    // nilai = ID tarif
                                required                                  // wajib pilih salah satu
                                className={styles.vehicleRadio}          // styling (biasanya hidden)
                                onChange={() => setSelectedTarif(item.id_tarif)} // update state saat dipilih
                                checked={isSelected}                      // controlled: centang sesuai state
                            />
                            {/* card visual kendaraan */}
                            <div className={styles.vehicleCard}>
                                {/* ikon kendaraan */}
                                <div className={styles.vehicleIcon}>
                                    <Image
                                        src={iconSrc}
                                        alt={item.jenis_kendaraan}
                                        width={40}
                                        height={40}
                                        className={styles.vehicleImg}
                                    />
                                </div>
                                {/* nama jenis kendaraan */}
                                <div className={styles.vehicleLabel}>{item.jenis_kendaraan}</div>
                                {/* harga tarif per jam */}
                                <div className={styles.vehiclePrice}>Rp {parseInt(item.tarif_per_jam).toLocaleString()}/jam</div>
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* ===== 3. PILIHAN AREA PARKIR (DROPDOWN) ===== */}
            <select name="id_area" required className={styles.selectArea}>
                {/* opsi default (belum pilih) */}
                <option value="">-- Pilih Lokasi Parkir --</option>
                {/* loop setiap area dan tampilkan sebagai opsi */}
                {areaList.map((area) => (
                    <option key={area.id_area} value={area.id_area}>
                        {/* tampilkan nama area + sisa slot yang tersedia */}
                        📍 {area.nama_area} — (Sisa: {area.kapasitas - (area.terisi || 0)})
                    </option>
                ))}
            </select>

            {/* ===== HIDDEN INPUT: ID PETUGAS ===== */}
            {/* input tersembunyi berisi ID petugas yang sedang login */}
            {/* dikirim ke server action untuk dicatat siapa yang melayani */}
            <input type="hidden" name="id_user" value={userId} />

            {/* ===== 4. TOMBOL SUBMIT ===== */}
            {/* disabled saat loading agar tidak bisa diklik 2x */}
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {/* teks berubah saat loading */}
                {loading ? "Memproses..." : "Cetak Karcis Masuk"}
            </button>

        </form>
    );
}
