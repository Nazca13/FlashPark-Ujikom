/**
 * ============================================================================
 * OWNER FILTER COMPONENT - src/features/reports/components/owner-filter/index.js
 * ============================================================================
 * Komponen filter tanggal untuk dashboard Owner (Client Component).
 * Memungkinkan owner memfilter data pendapatan berdasarkan range tanggal.
 * 
 * Fitur:
 * - Input "Dari Tanggal" dan "Sampai Tanggal"
 * - Tombol "Reset Filter" muncul otomatis saat ada filter aktif
 * - Menggunakan URL-based state management (filter disimpan di URL params)
 * 
 * @module OwnerFilter
 * @path /dashboard/owner
 * ============================================================================
 */

// "use client" = berjalan di browser (butuh interaksi user)
"use client";

// import hooks navigasi Next.js
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// import styling khusus untuk filter owner
import styles from "./styles.module.css";

/**
 * OwnerFilter - Komponen Filter Tanggal Dashboard Owner
 * 
 * @returns {JSX.Element} - Card berisi 2 input tanggal dan tombol reset
 */
export default function OwnerFilter() {
    // baca parameter URL saat ini
    const searchParams = useSearchParams();
    // ambil path halaman saat ini
    const pathname = usePathname();
    // fungsi replace untuk update URL
    const { replace } = useRouter();

    // ambil nilai filter tanggal dari URL params (kosong jika belum difilter)
    const startDate = searchParams.get("startDate") || "";  // tanggal mulai
    const endDate = searchParams.get("endDate") || "";      // tanggal selesai

    /**
     * handleFilterChange - Update filter di URL params
     * 
     * Fungsi generik: bisa dipakai untuk update parameter apapun (startDate/endDate).
     * 
     * @param {string} key - Nama parameter URL (contoh: "startDate", "endDate")
     * @param {string} value - Nilai parameter
     */
    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);     // set parameter dengan nilai baru
        } else {
            params.delete(key);          // hapus parameter jika kosong
        }
        // update URL dengan parameter baru (trigger re-render Server Component)
        replace(`${pathname}?${params.toString()}`);
    };

    /**
     * handleReset - Reset semua filter (kembali ke URL tanpa params)
     */
    const handleReset = () => {
        // ganti URL ke pathname saja (tanpa search params)
        replace(pathname);
    };

    return (
        // card container filter
        <div className={styles.cardContainer}>
            <div className={styles.filterRow}>

                {/* ===== INPUT TANGGAL MULAI ===== */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Dari Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={startDate}                                            // controlled input (nilai dari URL)
                        onChange={(e) => handleFilterChange("startDate", e.target.value)} // update saat berubah
                    />
                </div>

                {/* ===== INPUT TANGGAL SELESAI ===== */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Sampai Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={endDate}
                        onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    />
                </div>

                {/* ===== TOMBOL RESET ===== */}
                {/* Tombol ini HANYA muncul kalau ada filter aktif (startDate atau endDate terisi) */}
                {/* && = short-circuit: kalau kiri false, kanan tidak dirender */}
                {(startDate || endDate) && (
                    <button className={styles.btnReset} onClick={handleReset}>
                        Reset Filter
                    </button>
                )}
            </div>
        </div>
    );
}
