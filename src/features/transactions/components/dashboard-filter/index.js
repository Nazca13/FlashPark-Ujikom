/**
 * ============================================================================
 * DASHBOARD FILTER COMPONENT - src/features/transactions/components/dashboard-filter/index.js
 * ============================================================================
 * Komponen filter untuk dashboard Admin (Client Component).
 * Memungkinkan admin memfilter data transaksi berdasarkan:
 * 1. Tanggal
 * 2. Plat Nomor (pencarian teks dengan debounce)
 * 3. Jenis Kendaraan (dropdown: Semua/Mobil/Motor/Truk)
 * 
 * Menggunakan pola URL-based state management:
 * Filter disimpan sebagai URL search params (?query=...&date=...&vehicle=...)
 * Server Component membaca params ini untuk query database.
 * 
 * @module DashboardFilter
 * @path /dashboard/admin (bagian filter)
 * ============================================================================
 */

// "use client" = komponen ini berjalan di browser (butuh interaksi user)
"use client";

// import hooks navigasi Next.js
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// import custom hook debounce (menunda pencarian saat user masih mengetik)
import { useDebouncedCallback } from "@/hooks/use-debounce";

// import styling dari admin CSS Module
import styles from "@/app/dashboard/admin/admin.module.css";

/**
 * DashboardFilter - Komponen Filter Dashboard Admin
 * 
 * @returns {JSX.Element} - Card berisi 3 input filter: tanggal, plat nomor, jenis kendaraan
 */
export function DashboardFilter() {
    // baca parameter URL saat ini
    const searchParams = useSearchParams();
    // ambil path halaman saat ini
    const pathname = usePathname();
    // fungsi replace untuk update URL tanpa menambah history entry
    const { replace } = useRouter();

    /**
     * handleSearch - Filter berdasarkan plat nomor (debounced 300ms)
     * 
     * @param {string} term - Plat nomor yang dicari
     */
    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);      // set parameter pencarian
        } else {
            params.delete("query");          // hapus jika kosong
        }
        replace(`${pathname}?${params.toString()}`); // update URL
    }, 300); // tunggu 300ms setelah user berhenti mengetik

    /**
     * handleDateChange - Filter berdasarkan tanggal (langsung)
     * 
     * @param {string} date - Tanggal format YYYY-MM-DD
     */
    const handleDateChange = (date) => {
        const params = new URLSearchParams(searchParams);
        if (date) {
            params.set("date", date);       // set parameter tanggal
        } else {
            params.delete("date");           // hapus jika kosong
        }
        replace(`${pathname}?${params.toString()}`);
    };

    /**
     * handleVehicleChange - Filter berdasarkan jenis kendaraan (langsung)
     * 
     * @param {string} vehicle - Jenis kendaraan (Semua/Mobil/Motor/Truk)
     */
    const handleVehicleChange = (vehicle) => {
        const params = new URLSearchParams(searchParams);
        if (vehicle && vehicle !== "Semua") {
            params.set("vehicle", vehicle);  // set parameter kendaraan
        } else {
            params.delete("vehicle");        // hapus jika "Semua" (tidak perlu filter)
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        // card container filter
        <div className={styles.cardContainer} style={{ marginBottom: '20px', padding: '20px' }}>
            <div className={styles.filterRow}>

                {/* ===== FILTER TANGGAL ===== */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        defaultValue={searchParams.get("date")?.toString()}
                        onChange={(e) => handleDateChange(e.target.value)}
                    />
                </div>

                {/* ===== FILTER PLAT NOMOR (SEARCH) ===== */}
                <div className={styles.filterGroup} style={{ flex: 2 }}>
                    <label className={styles.label}>Plat Nomor</label>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Cari Plat Nomor..."
                            style={{ width: '100%' }}
                            defaultValue={searchParams.get("query")?.toString()}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {/* ikon search di kanan input */}
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>

                {/* ===== FILTER JENIS KENDARAAN (DROPDOWN) ===== */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Kendaraan</label>
                    <select
                        className={styles.input}
                        style={{ background: 'white', color: '#1F2937' }}
                        defaultValue={searchParams.get("vehicle")?.toString()}
                        onChange={(e) => handleVehicleChange(e.target.value)}
                    >
                        {/* pilihan jenis kendaraan */}
                        <option value="Semua">Semua</option>
                        <option value="Mobil">Mobil</option>
                        <option value="Motor">Motor</option>
                        <option value="Truk">Truk</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
