/**
 * ============================================================================
 * AREAS ACTIONS BARREL EXPORT - src/features/areas/actions/index.js
 * ============================================================================
 * File barrel untuk meng-export semua server actions terkait area parkir.
 * 
 * Actions yang tersedia:
 * - getArea: Ambil semua data area parkir dari database
 * - createArea: Tambah area parkir baru
 * - toggleAreaStatus: Toggle status aktif/nonaktif area
 * 
 * @module AreasActionsBarrel
 * ============================================================================
 */

// re-export semua fungsi area dari file manage-areas.actions.js
export { getArea, createArea, toggleAreaStatus } from './manage-areas.actions.js';
