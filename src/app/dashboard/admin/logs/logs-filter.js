"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import styles from "../admin.module.css";

export function LogsFilter() {
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

    return (
        <div className={styles.cardContainer} style={{ marginBottom: '20px', padding: '20px' }}>
            <div className={styles.filterRow}>
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        defaultValue={searchParams.get("date")?.toString()}
                        onChange={(e) => handleDateChange(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup} style={{ flex: 2 }}>
                    <label className={styles.label}>Cari Aktivitas / User</label>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Cari log aktivitas..."
                            style={{ width: '100%' }}
                            defaultValue={searchParams.get("query")?.toString()}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
