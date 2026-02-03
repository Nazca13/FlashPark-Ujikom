"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from "./owner-filter.module.css";

export default function OwnerFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        replace(pathname);
    };

    return (
        <div className={styles.cardContainer}>
            <div className={styles.filterRow}>
                {/* Start Date */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Dari Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={startDate}
                        onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    />
                </div>

                {/* End Date */}
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Sampai Tanggal</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={endDate}
                        onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    />
                </div>

                {/* Reset Button */}
                {(startDate || endDate) && (
                    <button className={styles.btnReset} onClick={handleReset}>
                        Reset Filter
                    </button>
                )}
            </div>
        </div>
    );
}
