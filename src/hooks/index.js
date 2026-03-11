/**
 * ============================================================================
 * HOOKS BARREL EXPORT - src/hooks/index.js
 * ============================================================================
 * File barrel untuk meng-export semua custom hooks dari satu tempat.
 * 
 * Custom hooks = fungsi React khusus yang bisa dipakai ulang.
 * Nama hooks selalu dimulai dengan "use" (konvensi React).
 * 
 * @module HooksBarrel
 * ============================================================================
 */

// re-export custom hook useDebounce dari file use-debounce.js
// useDebounce = hook untuk menunda perubahan nilai (mencegah terlalu banyak request)
export { useDebounce } from './use-debounce.js';
