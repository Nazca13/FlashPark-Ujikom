/**
 * ============================================================================
 * REPORTS ACTIONS BARREL - src/features/reports/actions/index.js
 * ============================================================================
 * File barrel untuk meng-export semua server actions terkait laporan/report.
 * 
 * Actions yang tersedia:
 * - getDashboardData: Ambil data statistik untuk dashboard admin
 * - getOwnerStats: Ambil statistik pendapatan untuk dashboard owner
 * - getRevenueChartData: Ambil data grafik pendapatan harian untuk owner
 * 
 * @module ReportsActionsBarrel
 * ============================================================================
 */

// export fungsi data dashboard admin
export { getDashboardData } from './get-dashboard-data.action.js';

// export fungsi statistik dan data grafik untuk owner
export { getOwnerStats, getRevenueChartData } from './get-owner-reports.action.js';
