/**
 * ============================================================================
 * LOGS FILTER COMPONENT - src/features/logs/components/logs-filter/index.js
 * ============================================================================
 * Komponen filter untuk halaman Log Aktivitas (Client Component).
 * Memungkinkan admin memfilter log berdasarkan tanggal dan kata kunci.
 * 
 * Cara kerja:
 * 1. User mengetik di search → update URL params (debounced 300ms)
 * 2. User pilih tanggal → update URL params (langsung)
 * 3. Server Component membaca URL params → query database → render ulang
 * 
 * Pattern ini disebut "URL-based state management":
 * State disimpan di URL (bukan di useState), sehingga bisa di-share/bookmark.
 * 
 * @module LogsFilter
 * @path /dashboard/admin/logs
 * ============================================================================
 */

// "use client" = komponen ini berjalan di browser (butuh interaksi: ketik, pilih tanggal)
"use client";

// import hooks navigasi Next.js
// useRouter = untuk navigasi programmatik (replace URL)
// usePathname = mendapatkan path halaman saat ini (contoh: "/dashboard/admin/logs")
// useSearchParams = membaca parameter URL saat ini (contoh: ?query=login&date=2024-01-15)
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// import custom hook debounce (mencegah terlalu banyak URL update saat mengetik)
import { useDebouncedCallback } from "@/hooks/use-debounce";

// import styling dari admin.module.css (pakai styling yang sama dengan halaman admin lain)
import styles from "@/app/dashboard/admin/admin.module.css";

/**
 * LogsFilter - Komponen Filter Log Aktivitas
 * 
 * @returns {JSX.Element} - Card berisi input tanggal dan search field
 */
export function LogsFilter() {
    // baca parameter URL saat ini
    const searchParams = useSearchParams();

    // ambil path halaman saat ini (untuk mempertahankan path saat update params)
    const pathname = usePathname();

    // destructure fungsi replace dari useRouter
    // replace = ganti URL tanpa menambah entry ke browser history (back button tidak kembali ke filter sebelumnya)
    const { replace } = useRouter();

    /**
     * handleSearch - Menangani pencarian teks (debounced 300ms)
     * 
     * Menunggu 300ms setelah user berhenti mengetik sebelum update URL.
     * Ini mencegah request berlebihan ke server saat user masih mengetik.
     * 
     * @param {string} term - Kata kunci yang dicari
     */
    const handleSearch = useDebouncedCallback((term) => {
        // buat URLSearchParams baru berdasarkan params yang sudah ada
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("query", term);     // set parameter "query" dengan kata kunci
        } else {
            params.delete("query");         // kalau kosong, hapus parameter "query"
        }

        // ganti URL dengan parameter baru (trigger re-render Server Component)
        replace(`${pathname}?${params.toString()}`);
    }, 300); // 300ms delay

    /**
     * handleDateChange - Menangani perubahan filter tanggal (langsung, tanpa debounce)
     * 
     * @param {string} date - Tanggal dalam format YYYY-MM-DD dari input type="date"
     */
    const handleDateChange = (date) => {
        const params = new URLSearchParams(searchParams);

        if (date) {
            params.set("date", date);       // set parameter "date"
        } else {
            params.delete("date");           // kalau kosong, hapus parameter
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        // card container untuk filter
        <div className={styles.cardContainer} style={{ marginBottom: '20px', padding: '20px' }}>
            <div className={styles.filterRow}>

                {/* ===== FILTER TANGGAL ===== */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Tanggal</label>
                    <input
                        type="date"                                              // input tipe tanggal
                        className={styles.input}                                 // styling dari admin CSS
                        defaultValue={searchParams.get("date")?.toString()}      // nilai default dari URL
                        onChange={(e) => handleDateChange(e.target.value)}        // panggil saat tanggal berubah
                    />
                </div>

                {/* ===== FILTER PENCARIAN TEKS ===== */}
                <div className={styles.filterGroup} style={{ flex: 2 }}>
                    <label className={styles.label}>Cari Aktivitas / User</label>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"                                          // input tipe teks
                            className={styles.input}
                            placeholder="Cari log aktivitas..."                  // placeholder hint
                            style={{ width: '100%' }}
                            defaultValue={searchParams.get("query")?.toString()} // nilai default dari URL
                            onChange={(e) => handleSearch(e.target.value)}        // panggil saat ketik (debounced)
                        />
                        {/* ikon search di kanan input */}
                        <span className={styles.searchIcon}><img src="/content/search-icon.svg" alt="search" style={{ width: '18px', height: '18px' }} /></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
