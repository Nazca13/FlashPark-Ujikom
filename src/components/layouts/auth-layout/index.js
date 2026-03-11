/**
 * ============================================================================
 * AUTH LAYOUT - src/components/layouts/auth-layout/index.js
 * ============================================================================
 * Komponen layout khusus untuk halaman autentikasi (login/register).
 * Tampilan berbeda dari dashboard: centered di tengah layar dengan card putih.
 * 
 * Struktur tampilan:
 * ┌──────────────────────────────────┐
 * │           Background Abu         │
 * │      ┌─────────────────┐         │
 * │      │   Logo FlashPark │        │
 * │      └─────────────────┘         │
 * │      ┌─────────────────┐         │
 * │      │   Card Putih     │        │
 * │      │   (Form Login)   │        │
 * │      └─────────────────┘         │
 * └──────────────────────────────────┘
 * 
 * @module AuthLayout
 * @path /signin
 * ============================================================================
 */

// import Image dari Next.js untuk menampilkan logo dengan optimasi
import Image from "next/image";

// import CSS Module untuk styling
import styles from './styles.module.css';

/**
 * AuthLayout - Komponen Layout Halaman Login
 * 
 * @param {Object} props - Properties komponen
 * @param {React.ReactNode} props.children - Konten yang dibungkus (form login)
 * @returns {JSX.Element} - Layout dengan logo dan card putih di tengah layar
 */
export const AuthLayout = ({ children }) => (
    // container penuh layar, centered secara vertikal dan horizontal
    <div className={styles.container}>

        {/* ===== HEADER LOGO ===== */}
        {/* menampilkan logo FlashPark di atas card */}
        <div className={styles.header}>
            {/* container logo dengan ukuran tetap */}
            <div className={styles.logoContainer}>
                {/* Image Next.js dengan mode fill (mengisi container parent) */}
                {/* src mengarah ke file public/Logo (1).svg */}
                <Image
                    src="/Logo (1).svg"
                    alt="FlashPark Logo"
                    fill                               // mode fill: gambar mengisi container
                    style={{ objectFit: 'contain' }}    // contain: jaga proporsi, tidak dipotong
                />
            </div>
        </div>

        {/* ===== CARD PUTIH ===== */}
        {/* card berisi form login yang dibungkus dengan shadow dan border radius */}
        <div className={styles.card}>
            {/* children = konten form login (SignInPageView) */}
            {children}
        </div>
    </div>
);