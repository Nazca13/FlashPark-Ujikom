/**
 * ============================================================================
 * USE DEBOUNCE HOOK - src/hooks/use-debounce.js
 * ============================================================================
 * Custom hooks untuk teknik "debounce" di React.
 * 
 * Debounce = menunda eksekusi fungsi sampai user berhenti mengetik/berinteraksi.
 * 
 * Contoh penggunaan:
 * - Search input: Baru cari setelah user berhenti mengetik selama 300ms
 * - Filter: Baru apply filter setelah user berhenti memilih selama 500ms
 * 
 * Tanpa debounce: Setiap ketikan = 1 request ke server (boros!)
 * Dengan debounce: Hanya request saat user berhenti ketik (efisien!)
 * 
 * @module UseDebounce
 * ============================================================================
 */

// import hooks React yang dibutuhkan
import { useEffect, useState, useRef } from 'react';

/**
 * useDebounce - Hook untuk debounce sebuah VALUE
 * 
 * Menunda perubahan value sampai user berhenti mengubahnya selama {delay} ms.
 * 
 * Contoh:
 *   const searchTerm = useDebounce(inputValue, 300);
 *   // searchTerm hanya berubah 300ms setelah inputValue berhenti berubah
 * 
 * @param {any} value - Nilai yang ingin di-debounce (biasanya dari input)
 * @param {number} delay - Waktu tunggu dalam milidetik (contoh: 300 = 0.3 detik)
 * @returns {any} - Nilai yang sudah di-debounce
 */
export function useDebounce(value, delay) {
    // state untuk menyimpan value yang sudah di-debounce
    const [debouncedValue, setDebouncedValue] = useState(value);

    // useEffect dijalankan setiap kali value atau delay berubah
    useEffect(() => {
        // set timeout: update debouncedValue setelah {delay} ms
        const handler = setTimeout(() => {
            setDebouncedValue(value); // baru update state setelah delay
        }, delay);

        // cleanup function: kalau value berubah lagi sebelum delay selesai,
        // batalkan timeout sebelumnya dan mulai countdown ulang
        return () => {
            clearTimeout(handler); // batalkan timeout sebelumnya
        };
    }, [value, delay]); // dependency array: jalankan ulang kalau value atau delay berubah

    // return nilai yang sudah di-debounce
    return debouncedValue;
}

/**
 * useDebouncedCallback - Hook untuk debounce sebuah FUNGSI (callback)
 * 
 * Menunda pemanggilan callback sampai user berhenti memicunya selama {delay} ms.
 * 
 * Contoh:
 *   const debouncedSearch = useDebouncedCallback((query) => {
 *     fetchSearchResults(query);
 *   }, 500);
 *   // panggil: debouncedSearch("motor") -> hanya execute setelah 500ms tanpa panggilan baru
 * 
 * @param {Function} callback - Fungsi yang ingin di-debounce
 * @param {number} delay - Waktu tunggu dalam milidetik
 * @returns {Function} - Versi debounced dari callback
 */
export function useDebouncedCallback(callback, delay) {
    // useRef untuk menyimpan ID timeout antar render
    // useRef tidak trigger re-render seperti useState
    const timeoutRef = useRef(null);

    // return fungsi baru yang sudah di-debounce
    return (...args) => {
        // kalau ada timeout yang sedang jalan, batalkan dulu
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // set timeout baru: panggil callback setelah delay
        timeoutRef.current = setTimeout(() => {
            callback(...args); // panggil callback asli dengan argumen yang diberikan
        }, delay);
    };
}
