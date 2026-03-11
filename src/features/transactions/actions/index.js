/**
 * ============================================================================
 * TRANSACTIONS ACTIONS BARREL - src/features/transactions/actions/index.js
 * ============================================================================
 * File barrel untuk meng-export semua server actions terkait transaksi parkir.
 * 
 * Actions yang tersedia:
 * - checkInKendaraan: Proses kendaraan masuk (catat ke database + update slot)
 * - checkoutKendaraan: Proses kendaraan keluar (hitung biaya + update slot)
 * - searchKendaraanMasuk: Cari kendaraan yang sedang parkir berdasarkan plat nomor
 * - getParkedVehicles: Ambil daftar semua kendaraan yang sedang parkir
 * 
 * @module TransactionsActionsBarrel
 * ============================================================================
 */

// export fungsi check-in dari file check-in.action.js
export { checkInKendaraan } from './check-in.action.js';

// export fungsi checkout dari file check-out.action.js
export { checkoutKendaraan } from './check-out.action.js';

// export fungsi pencarian kendaraan dari file search-vehicle.action.js
export { searchKendaraanMasuk } from './search-vehicle.action.js';

// export fungsi ambil daftar kendaraan parkir dari file get-parked-vehicles.action.js
export { getParkedVehicles } from './get-parked-vehicles.action.js';
