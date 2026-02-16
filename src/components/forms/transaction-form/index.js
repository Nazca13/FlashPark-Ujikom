"use client";
import Image from "next/image";
import { useState } from "react";
import { checkInKendaraan } from "@/features/transactions/actions";
import styles from "@/app/dashboard/petugas/styles.module.css";

export default function TransactionForm({ tarifList, areaList, userId }) {
    const [loading, setLoading] = useState(false);
    const [plat, setPlat] = useState(""); // State untuk menyimpan text Plat
    const [selectedTarif, setSelectedTarif] = useState(null); // State untuk pilihan kendaraan

    // FUNGSI SAKTI: Auto Format Plat Nomor (Simplified)
    const handlePlatChange = (e) => {
        // Hanya paksa huruf besar, biarkan user mengetik spasi manual jika mau
        // atau kita bisa format sederhana saja
        let val = e.target.value.toUpperCase();
        setPlat(val);
    };

    async function handleSubmit(formData) {
        setLoading(true);
        const result = await checkInKendaraan(formData);

        if (result.success) {
            window.location.reload();
        } else {
            alert("Gagal: " + result.error);
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit}>
            {/* 1. INPUT PLAT NOMOR (Sudah Auto Format) */}
            <div>
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
                <input
                    className={styles.inputPlat}
                    name="plat_nomor"
                    type="text"
                    placeholder="D 1234 ABC"
                    required
                    autoComplete="off"
                    maxLength={11} // Membatasi panjang karakter biar ga kepanjangan
                    value={plat}   // Kunci: Nilai input diatur oleh State
                    onChange={handlePlatChange} // Panggil fungsi sakti tiap ngetik
                />
            </div>

            {/* 2. PILIHAN KENDARAAN */}
            <div className={styles.vehicleGroup}>
                {tarifList.map((item) => {
                    const isSelected = selectedTarif === item.id_tarif;
                    let iconType = 'lainnya'; // Default
                    const jenis = item.jenis_kendaraan.toLowerCase();

                    if (jenis.includes('mobil')) iconType = 'mobil';
                    else if (jenis.includes('motor')) iconType = 'motor';

                    const iconSrc = `/content/${iconType}-${isSelected ? 'on' : 'off'}.svg`;

                    return (
                        <label key={item.id_tarif} className={`${styles.vehicleOption} ${isSelected ? styles.selected : ''}`}>
                            <input
                                type="radio"
                                name="id_tarif"
                                value={item.id_tarif}
                                required
                                className={styles.vehicleRadio}
                                onChange={() => setSelectedTarif(item.id_tarif)}
                                checked={isSelected}
                            />
                            <div className={styles.vehicleCard}>
                                <div className={styles.vehicleIcon}>
                                    <Image
                                        src={iconSrc}
                                        alt={item.jenis_kendaraan}
                                        width={40}
                                        height={40}
                                        className={styles.vehicleImg}
                                    />
                                </div>
                                <div className={styles.vehicleLabel}>{item.jenis_kendaraan}</div>
                                <div className={styles.vehiclePrice}>Rp {parseInt(item.tarif_per_jam).toLocaleString()}/jam</div>
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* 3. PILIHAN AREA */}
            <select name="id_area" required className={styles.selectArea}>
                <option value="">-- Pilih Lokasi Parkir --</option>
                {areaList.map((area) => (
                    <option key={area.id_area} value={area.id_area}>
                        📍 {area.nama_area} — (Sisa: {area.kapasitas - (area.terisi || 0)})
                    </option>
                ))}
            </select>

            {/* HIDDEN INPUT */}
            <input type="hidden" name="id_user" value={userId} />

            {/* 4. TOMBOL SUBMIT */}
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? "Memproses..." : "Cetak Karcis Masuk"}
            </button>

        </form>
    );
}
