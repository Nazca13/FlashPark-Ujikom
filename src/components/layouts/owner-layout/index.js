/**
 * ============================================================================
 * OWNER LAYOUT COMPONENT - src/components/layouts/owner-layout/index.js
 * ============================================================================
 * Komponen layout untuk halaman dashboard Owner (pemilik parkir).
 * Struktur mirip dengan admin layout: sidebar di kiri + konten di kanan.
 * Bedanya di daftar menu yang lebih sederhana (hanya Dashboard).
 * 
 * @module OwnerLayout
 * @path /dashboard/owner/*
 * ============================================================================
 */

// import Link dari Next.js untuk navigasi antar halaman
import Link from "next/link";

// import Image dari Next.js untuk optimasi gambar
import Image from "next/image";

// import CSS Module untuk styling layout owner
import styles from './styles.module.css';

// import server action logout
import { logoutAction } from "@/features/authentication/actions";

/**
 * OwnerLayout - Komponen Layout Dashboard Owner
 * 
 * @param {Object} props - Properties komponen
 * @param {React.ReactNode} props.children - Konten halaman yang dibungkus
 * @param {string} props.activePage - Nama halaman aktif (untuk highlight menu)
 * @returns {JSX.Element} - Layout dengan sidebar owner dan area konten
 */
export const OwnerLayout = ({ children, activePage }) => {

    // ===== DATA MENU KHUSUS OWNER =====
    // Owner hanya punya 1 menu: Dashboard (laporan keuangan)
    // Bisa ditambah menu lain seperti "Laporan Detail" jika perlu
    const menuItems = [
        { name: "Dashboard", path: "/dashboard/owner", icon: "dashboard-icon" },
    ];

    return (
        // container utama: sidebar + konten horizontal
        <div className={styles.container}>

            {/* ===== SIDEBAR NAVIGASI OWNER ===== */}
            <aside className={styles.sidebar}>

                {/* Logo FlashPark di atas sidebar */}
                <div className={styles.logoArea}>
                    <Image src="/Logo (1).svg" alt="FlashPark" width={160} height={60} priority />
                </div>

                {/* Menu navigasi */}
                <div className={styles.menuGroup}>
                    {/* label grup menu */}
                    <div className={styles.menuTitle}>Menu Owner</div>

                    {/* render setiap item menu */}
                    {menuItems.map((item) => {
                        // cek apakah menu ini aktif
                        const isActive = activePage === item.name;

                        // pilih ikon aktif/normal berdasarkan status
                        const iconSrc = isActive
                            ? `/sidebar/${item.icon}-active.svg`  // ikon putih saat aktif
                            : `/sidebar/${item.icon}.svg`;         // ikon normal

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`${styles.menuItem} ${isActive ? styles.activeMenu : ''}`}
                            >
                                {/* container ikon 20x20px */}
                                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                    <Image
                                        src={iconSrc}
                                        alt={item.name}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                                {/* label menu */}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Tombol logout di bagian bawah */}
                <div className={styles.footer}>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className={styles.menuItem}
                            style={{
                                cursor: 'pointer',
                                color: '#1A1A1A',
                                width: '100%',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: 'inherit',
                                fontFamily: 'inherit',
                                background: 'transparent' // tanpa background agar seamless dengan sidebar
                            }}
                        >
                            <Image src="/sidebar/logout-icon.svg" alt="Logout" width={20} height={20} />
                            <span style={{ marginLeft: '10px' }}>Log Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* ===== AREA KONTEN UTAMA ===== */}
            {/* children = konten halaman yang dibungkus layout ini */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};
