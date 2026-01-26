"use client";
import { useState } from "react";
import { checkInKendaraan } from "./action"; // Panggil mesin yang sudah dibuat
import { Button } from "@/components/ui/Button"; // Sesuaikan lokasi komponen UI kamu

export default function TransactionForm({ tarifList, areaList, userId }) {
    const [loading, setLoading] = useState(false);
    const [pesan, setPesan] = useState("");

    async function handleSubmit(formData) {
        setLoading(true);
        setPesan("");

        // Panggil Server Action
        const result = await checkInKendaraan(formData);

        if (result.success) {
            setPesan("✅ Berhasil! Karcis dicetak.");
            // Reset form manual atau reload halaman
            window.location.reload();
        } else {
            setPesan("❌ Gagal: " + result.error);
        }
        setLoading(false);
    }

    return (
        <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* 1. Input Plat Nomor */}
            <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Plat Nomor</label>
                <input
                    name="plat_nomor"
                    type="text"
                    placeholder="D 1234 ABC"
                    required
                    style={{
                        width: "100%", height: "60px", fontSize: "24px", textAlign: "center", textTransform: "uppercase",
                        borderRadius: "12px", border: "2px solid #E5E7EB", fontWeight: "bold"
                    }}
                />
            </div>

            {/* 2. Pilih Jenis Kendaraan (Radio Button tapi gaya Tombol) */}
            <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Jenis Kendaraan</label>
                <div style={{ display: "flex", gap: "10px" }}>
                    {tarifList.map((item) => (
                        <label key={item.id_tarif} style={{ flex: 1, cursor: "pointer" }}>
                            <input type="radio" name="id_tarif" value={item.id_tarif} required style={{ display: "none" }} />
                            <div className="pilihan-kendaraan" style={{
                                padding: "15px", borderRadius: "10px", border: "1px solid #E5E7EB",
                                textAlign: "center", fontWeight: "bold"
                            }}>
                                {item.jenis_kendaraan.toUpperCase()}
                                <div style={{ fontSize: "12px", fontWeight: "normal" }}>Rp {item.tarif_per_jam}/jam</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* 3. Pilih Area Parkir */}
            <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Lokasi Parkir</label>
                <select name="id_area" required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <option value="">-- Pilih Area --</option>
                    {areaList.map((area) => (
                        <option key={area.id_area} value={area.id_area}>
                            {area.nama_area} (Sisa: {area.kapasitas - (area.terisi || 0)})
                        </option>
                    ))}
                </select>
            </div>

            {/* ID Petugas (Hidden) - Sementara kita hardcode dulu atau ambil dari props */}
            <input type="hidden" name="id_user" value={userId || 1} />

            {/* Tombol Submit */}
            <button
                type="submit"
                disabled={loading}
                style={{
                    background: "#204DD2", color: "white", padding: "15px", borderRadius: "12px",
                    fontSize: "16px", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "10px"
                }}
            >
                {loading ? "Mencetak..." : "Cetak Karcis & Masuk 🖨️"}
            </button>

            {/* Pesan Sukses/Gagal */}
            {pesan && <div style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>{pesan}</div>}

            {/* Style tambahan buat efek klik radio button */}
            <style jsx>{`
        input[type="radio"]:checked + div {
          background-color: #E0F2FE;
          border-color: #204DD2 !important;
          color: #204DD2;
        }
      `}</style>
        </form>
    );
}