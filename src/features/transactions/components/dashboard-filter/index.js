"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import styles from "@/app/dashboard/admin/admin.module.css";

export function DashboardFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleDateChange = (date) => {
        const params = new URLSearchParams(searchParams);
        if (date) {
            params.set("date", date);
        } else {
            params.delete("date");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleVehicleChange = (vehicle) => {
        const params = new URLSearchParams(searchParams);
        if (vehicle && vehicle !== "Semua") {
            params.set("vehicle", vehicle);
        } else {
            params.delete("vehicle");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={styles.cardContainer} style={{ marginBottom: '20px', padding: '20px' }}>
            <div className={styles.filterRow}>
                {/* Filter Tanggal */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        defaultValue={searchParams.get("date")?.toString()}
                        onChange={(e) => handleDateChange(e.target.value)}
                    />
                </div>

                {/* Filter Plat Nomor */}
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
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>

                {/* Filter Kendaraan */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Kendaraan</label>
                    <select
                        className={styles.input}
                        style={{ background: 'white', color: '#1F2937' }}
                        defaultValue={searchParams.get("vehicle")?.toString()}
                        onChange={(e) => handleVehicleChange(e.target.value)}
                    >
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
