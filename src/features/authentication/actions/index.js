/**
 * ============================================================================
 * AUTHENTICATION ACTIONS BARREL - src/features/authentication/actions/index.js
 * ============================================================================
 * File barrel untuk meng-export semua server actions terkait autentikasi.
 * 
 * Actions yang tersedia:
 * - loginAction: Proses login user (cek username & password)
 * - logoutAction: Proses logout user (redirect ke halaman login)
 * 
 * @module AuthActionsBarrel
 * ============================================================================
 */

// re-export fungsi login dan logout dari file login.actions.js
export { loginAction, logoutAction } from './login.actions.js';
