// ===== IMPORT DEPENDENCIES =====

// Link = komponen buat navigasi antar halaman tanpa reload (SPA-style)
// bedanya sama <a> biasa: Link lebih cepet karena ga reload seluruh page
import Link from "next/link";

// Image = komponen gambar dari next.js, otomatis optimize ukuran gambar
// lebih bagus dari <img> biasa karena ada lazy loading & responsive
import Image from "next/image";

// import styling CSS module, nanti dipake jadi styles.namaClass
import styles from './petugas-layout.module.css';

// import fungsi logout dari actions.js
import { logoutAction } from "@/app/login/actions";

// ===== KOMPONEN UTAMA LAYOUT PETUGAS =====

// ini komponen layout yang membungkus semua halaman petugas
// children = isi konten halaman yang dibungkus
// activePage = nama halaman yang aktif, buat highlight menu
export const PetugasLayout = ({ children, activePage }) => {

    // daftar menu sidebar untuk petugas
    // setiap item punya: name (label), path (url), icon (nama file icon)
    const menuItems = [
        { name: "Dashboard", path: "/dashboard/petugas", icon: "dashboard-icon" },
        { name: "Transaksi Keluar", path: "/dashboard/petugas/keluar", icon: "checkout-icon" },
    ];

    // return = yang ditampilin ke browser
    return (
        // container utama, pake flexbox (sidebar + content)
        <div className={styles.container}>

            {/* ===== SIDEBAR (MENU SAMPING KIRI) ===== */}
            <aside className={styles.sidebar}>

                {/* bagian logo di atas */}
                <div className={styles.logoArea}>
                    {/* Image component dari next.js */}
                    {/* src = path file gambar (dari folder public) */}
                    {/* width & height = ukuran gambar */}
                    {/* priority = load duluan (penting banget) */}
                    <Image src="/Logo (1).svg" alt="FlashPark" width={160} height={60} priority />
                </div>

                {/* ===== BAGIAN MENU NAVIGASI ===== */}
                <div className={styles.menuGroup}>
                    {/* judul grup menu */}
                    <div className={styles.menuTitle}>Menu Petugas</div>

                    {/* loop semua item menu pake .map() */}
                    {/* .map() = fungsi buat ubah array jadi list komponen */}
                    {menuItems.map((item) => {

                        // cek apakah menu ini yg lagi aktif
                        // kalo activePage sama dgn item.name = true
                        const isActive = activePage === item.name;

                        // pilih icon yg sesuai (active = beda warna)
                        // kalo aktif pake icon-active.svg, kalo ga pake icon.svg
                        const iconSrc = isActive
                            ? `/sidebar/${item.icon}-active.svg`
                            : `/sidebar/${item.icon}.svg`;

                        // return komponen Link untuk setiap menu
                        return (
                            // Link = hyperlink tapi tanpa reload halaman
                            <Link
                                key={item.name} // key wajib di react, untuk identify item unik
                                href={item.path} // url tujuan
                                // className gabungan: style dasar + style aktif (kalo lagi aktif)
                                className={`${styles.menuItem} ${isActive ? styles.activeMenu : ''}`}
                            >
                                {/* container icon */}
                                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                    {/* Image fill = gambar ngikutin ukuran parent */}
                                    <Image
                                        src={iconSrc}
                                        alt={item.name}
                                        fill // fill = isi penuh container
                                        style={{ objectFit: 'contain' }} // contain = jaga proporsi
                                    />
                                </div>
                                {/* label menu */}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* ===== BAGIAN LOGOUT (DI BAWAH SIDEBAR) ===== */}
                <div className={styles.footer}>
                    {/* form logout, action langsung ke server action */}
                    <form action={logoutAction}>
                        {/* tombol submit yang di-style jadi kayak menu item */}
                        <button
                            type="submit"
                            className={styles.menuItem}
                            style={{
                                cursor: 'pointer', // cursor tangan
                                color: '#1A1A1A', // warna teks hitam
                                width: '100%', // lebar penuh
                                border: 'none', // tanpa border
                                textAlign: 'left', // teks rata kiri
                                fontSize: 'inherit', // ikutin font size parent
                                fontFamily: 'inherit', // ikutin font family parent
                                background: 'transparent' // background transparan
                            }}
                        >
                            {/* icon logout */}
                            <Image src="/sidebar/logout-icon.svg" alt="Logout" width={20} height={20} />
                            {/* label logout */}
                            <span style={{ marginLeft: '10px' }}>Log Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* ===== MAIN CONTENT (AREA KONTEN UTAMA) ===== */}
            <main className={styles.mainContent}>
                {/* children = isi halaman yang dibungkus layout ini */}
                {/* misal: <PetugasLayout><KontenDashboard /></PetugasLayout> */}
                {/* maka children = <KontenDashboard /> */}
                {children}
            </main>
        </div>
    );
};
