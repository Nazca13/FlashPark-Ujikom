/**
 * ============================================================================
 * TARIFFS ACTIONS BARREL EXPORT - src/features/tariffs/actions/index.js
 * ============================================================================
 * File barrel untuk meng-export semua server actions terkait tarif parkir.
 * 
 * Actions yang tersedia:
 * - getTarif: Ambil semua data tarif dari database
 * - saveTarif: Simpan/update tarif (create atau update)
 * - createTarif: Tambah tarif baru (versi khusus create)
 * - deleteTarif: Hapus tarif dari database
 * 
 * @module TariffsActionsBarrel
 * ============================================================================
 */

// re-export semua fungsi tarif dari file manage-tariffs.actions.js
export { getTarif, saveTarif, createTarif, deleteTarif } from './manage-tariffs.actions.js';
