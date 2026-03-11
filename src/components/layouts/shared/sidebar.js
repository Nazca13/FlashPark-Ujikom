/**
 * ============================================================================
 * SIDEBAR COMPONENT - src/components/layouts/shared/sidebar.js
 * ============================================================================
 * Komponen sidebar navigasi untuk dashboard Admin.
 * Menampilkan logo, daftar menu navigasi, dan tombol logout.
 * 
 * Sidebar ini "shared" karena polanya sama (logo + menu + logout),
 * tapi menu items-nya khusus untuk Admin.
 * Owner dan Petugas punya sidebar sendiri di layout masing-masing.
 * 
 * Fitur:
 * - Menu aktif di-highlight warna biru dengan ikon -active.svg
 * - Menu non-aktif memakai ikon biasa (.svg)
 * - Tombol logout langsung memanggil server action logoutAction
 * 
 * @module Sidebar
 * @path Dipakai di admin-layout/index.js
 * ============================================================================
 */

// import Link dari Next.js untuk navigasi antar halaman tanpa reload
// Link otomatis prefetch halaman tujuan (lebih cepat daripada <a href>)
import Link from "next/link";

// import Image dari Next.js untuk optimasi gambar (lazy loading, format modern)
import Image from "next/image";

// import CSS Module untuk styling sidebar
import styles from './sidebar.module.css';

// import server action logout untuk proses keluar dari sistem
import { logoutAction } from "@/features/authentication/actions";

/**
 * Sidebar - Komponen Navigasi Samping Dashboard Admin
 * 
 * @param {Object} props - Properties komponen
 * @param {string} props.activePage - Nama halaman yang sedang aktif (untuk highlight menu)
 *                                     Contoh: "Dashboard", "Data User", "Data Tarif"
 * @returns {JSX.Element} - Sidebar dengan logo, menu navigasi, dan tombol logout
 */
export const Sidebar = ({ activePage }) => {
  // ===== DATA MENU NAVIGASI =====
  // Array berisi daftar menu yang ditampilkan di sidebar
  // Setiap item punya: name (label), path (URL tujuan), icon (nama file ikon)
  const menuItems = [
    { name: "Dashboard", path: "/dashboard/admin", icon: "dashboard-icon" },
    { name: "Data User", path: "/dashboard/admin/users", icon: "data-user-icon" },
    { name: "Data Tarif", path: "/dashboard/admin/tarif", icon: "data-tarif-icon" },
    { name: "Data Area", path: "/dashboard/admin/area", icon: "data-area-icon" },
    { name: "Log Aktivitas", path: "/dashboard/admin/logs", icon: "log-aktivitas-icon" },
  ];

  return (
    // <aside> = elemen HTML semantik untuk konten samping (sidebar)
    <aside className={styles.sidebar}>

      {/* ===== 1. SECTION LOGO ===== */}
      {/* Menampilkan logo FlashPark di bagian atas sidebar */}
      <div className={styles.logoArea}>
        {/* priority = load gambar ini lebih dulu (karena selalu terlihat) */}
        <Image src="/Logo (1).svg" alt="FlashPark" width={160} height={60} priority />
      </div>

      {/* ===== 2. SECTION MENU NAVIGASI ===== */}
      <div className={styles.menuGroup}>
        {/* label kecil "Main Menu" di atas daftar menu */}
        <div className={styles.menuTitle}>Main Menu</div>

        {/* loop setiap item menu dan render sebagai Link */}
        {menuItems.map((item) => {
          // cek apakah menu ini sedang aktif (halaman yang dibuka = nama menu)
          const isActive = activePage === item.name;

          // pilih file ikon sesuai status aktif/tidak
          // aktif: pakai ikon putih (*-active.svg), tidak aktif: ikon biasa (.svg)
          const iconSrc = isActive
            ? `/sidebar/${item.icon}-active.svg`   // ikon versi aktif (putih)
            : `/sidebar/${item.icon}.svg`;          // ikon versi normal (abu-abu)

          return (
            // Link = navigasi Next.js (client-side navigation, tanpa full page reload)
            <Link
              key={item.name}       // key wajib di React untuk list rendering
              href={item.path}      // URL tujuan
              className={`${styles.menuItem} ${isActive ? styles.activeMenu : ''}`}
            // kalau aktif, tambahkan class activeMenu (background biru)
            >
              {/* Container ikon menu (20x20px) */}
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <Image
                  src={iconSrc}                          // path ikon
                  alt={item.name}                        // alt text = nama menu
                  fill                                    // mode fill: isi container
                  style={{ objectFit: 'contain' }}        // maintain aspect ratio
                />
              </div>
              {/* label teks menu */}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* ===== 3. SECTION LOGOUT ===== */}
      {/* tombol logout di bagian paling bawah sidebar */}
      <div className={styles.footer}>
        {/* form yang langsung memanggil server action logoutAction */}
        <form action={logoutAction}>
          <button
            type="submit"            // tipe submit: kirim form saat diklik
            className={styles.menuItem}
            style={{
              cursor: 'pointer',     // cursor tangan saat hover
              color: '#1A1A1A',      // warna teks hitam
              width: '100%',         // lebar penuh
              border: 'none',        // tanpa border
              textAlign: 'left',     // teks rata kiri
              fontSize: 'inherit',   // ukuran font mengikuti parent
              fontFamily: 'inherit'  // font mengikuti parent
            }}
          >
            {/* ikon logout */}
            <Image src="/sidebar/logout-icon.svg" alt="Logout" width={20} height={20} />
            {/* label teks "Log Out" */}
            <span style={{ marginLeft: '10px' }}>Log Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
};