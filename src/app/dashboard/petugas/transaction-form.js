"use client";
import { useState } from "react";
import { checkInKendaraan } from "./actions";
import styles from "./petugas.module.css";

export default function TransactionForm({ tarifList, areaList, userId }) {
    const [loading, setLoading] = useState(false);
    const [plat, setPlat] = useState(""); // State untuk menyimpan text Plat

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
                <label style={{ display: 'none' }}>Plat Nomor</label>
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
                {tarifList.map((item) => (
                    <label key={item.id_tarif} className={styles.vehicleOption}>
                        <input
                            type="radio"
                            name="id_tarif"
                            value={item.id_tarif}
                            required
                            className={styles.vehicleRadio}
                        />
                        <div className={styles.vehicleCard}>
                            <div className={styles.vehicleIcon}>
                                {item.jenis_kendaraan.toLowerCase().includes('mobil') ? '🚗' : '🏍️'}
                            </div>
                            <div className={styles.vehicleLabel}>{item.jenis_kendaraan}</div>
                            <div className={styles.vehiclePrice}>Rp {parseInt(item.tarif_per_jam).toLocaleString()}/jam</div>
                        </div>
                    </label>
                ))}
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
