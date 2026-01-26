import { PetugasLayout } from "@/components/layout/PetugasLayout";
import prisma from "@/lib/prisma";
import TransactionForm from "./TransactionForm"; // Import komponen yang baru dibuat

import { cookies } from "next/headers";

export default async function PetugasDashboard() {
    // 1. Ambil Data Master dari Database
    const tarifData = await prisma.tb_tarif.findMany();
    const areaData = await prisma.tb_area_parkir.findMany();

    // Ambil ID User dari session
    const cookieStore = await cookies();
    const userId = cookieStore.get("session_user_id")?.value;

    // (Opsional) Hitung total slot tersedia buat statistik
    const totalKapasitas = areaData.reduce((acc, curr) => acc + curr.kapasitas, 0);
    const totalTerisi = areaData.reduce((acc, curr) => acc + (curr.terisi || 0), 0);
    const sisaSlot = totalKapasitas - totalTerisi;

    return (
        <PetugasLayout activePage="Dashboard">
            <div style={{ display: "flex", gap: "30px", flexDirection: "row", flexWrap: "wrap" }}>

                {/* KIRI: Form Input (Component) */}
                <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                        ⛔ Kendaraan Masuk
                    </h2>

                    {/* Kita pasang form di sini & kirim datanya */}
                    <TransactionForm
                        tarifList={tarifData}
                        areaList={areaData}
                        userId={userId}
                    />
                </div>

                {/* KANAN: Info Statistik Real-Time */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    {/* Kartu Sisa Slot */}
                    <div style={{ background: "#204DD2", color: "white", padding: "30px", borderRadius: "16px", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "18px", opacity: 0.9, marginBottom: "5px" }}>Slot Tersedia</h3>
                        <div style={{ fontSize: "56px", fontWeight: "bold", lineHeight: "1" }}>
                            {sisaSlot} <span style={{ fontSize: "20px", fontWeight: "normal" }}>Unit</span>
                        </div>
                        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
                            Dari total {totalKapasitas} kapasitas
                        </div>
                    </div>

                    {/* List Area Parkir Detail */}
                    <div style={{ background: "white", padding: "20px", borderRadius: "16px" }}>
                        <h3 style={{ fontWeight: "bold", marginBottom: "15px" }}>Status Area</h3>
                        {areaData.map(area => (
                            <div key={area.id_area} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>{area.nama_area}</div>
                                    <div style={{ fontSize: "12px", color: "#888" }}>Kap: {area.kapasitas}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontWeight: "bold", color: (area.kapasitas - (area.terisi || 0)) < 5 ? "red" : "green" }}>
                                        {area.kapasitas - (area.terisi || 0)} Kosong
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </PetugasLayout>
    );
}