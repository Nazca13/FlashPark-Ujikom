// ===== import dependencies =====

// link = komponen buat navigasi antar halaman tanpa reload (spa-style)
// bedanya sama <a> biasa: link lebih cepet karena ga reload seluruh page
import Link from "next/link";

// image = komponen gambar dari next.js, otomatis optimize ukuran gambar
// lebih bagus dari <img> biasa karena ada lazy loading & responsive
import Image from "next/image";

// import styling css module, nanti dipake jadi styles.namaclass
import styles from './styles.module.css';

// import fungsi logout dari actions.js
import { logoutAction } from "@/features/authentication/actions";

// ===== komponen utama layout petugas =====

// ini komponen layout yang membungkus semua halaman petugas
// children = isi konten halaman yang dibungkus
// activepage = nama halaman yang aktif, buat highlight menu
export const PetugasLayout = ({ children, activePage }) => {

    // daftar menu sidebar untuk petugas
    // setiap item punya: name (label), path (url), icon (nama file icon)
    const menuItems = [
        { name: "Dashboard", path: "/dashboard/petugas", icon: "dashboard-icon" },
        { name: "Transaksi Keluar", path: "/dashboard/petugas/keluar", icon: "transaction" },
    ];

    // return = yang ditampilin ke browser
    return (
        // container utama, pake flexbox (sidebar + content)
        <div className={styles.container}>

            {/* ===== sidebar (menu samping kiri) ===== */}
            <aside className={styles.sidebar}>

                {/* bagian logo di atas */}
                <div className={styles.logoArea}>
                    {/* image component dari next.js */}
                    {/* src = path file gambar (dari folder public) */}
                    {/* width & height = ukuran gambar */}
                    {/* priority = load duluan (penting banget) */}
                    <Image src="/Logo (1).svg" alt="FlashPark" width={160} height={60} priority />
                </div>

                {/* ===== bagian menu navigasi ===== */}
                <div className={styles.menuGroup}>
                    {/* judul grup menu */}
                    <div className={styles.menuTitle}>Menu Petugas</div>

                    {/* loop semua item menu pake .map() */}
                    {/* .map() = fungsi buat ubah array jadi list komponen */}
                    {menuItems.map((item) => {

                        // cek apakah menu ini yg lagi aktif
                        // kalo activepage sama dgn item.name = true
                        const isActive = activePage === item.name;

                        // pilih icon yg sesuai (active = beda warna)
                        // kalo aktif pake icon-active.svg, kalo ga pake icon.svg
                        const iconSrc = isActive
                            ? `/sidebar/${item.icon}-active.svg`
                            : `/sidebar/${item.icon}.svg`;

                        // return komponen link untuk setiap menu
                        return (
                            // link = hyperlink tapi tanpa reload halaman
                            <Link
                                key={item.name} // key wajib di react, untuk identify item unik
                                href={item.path} // url tujuan
                                // classname gabungan: style dasar + style aktif (kalo lagi aktif)
                                className={`${styles.menuItem} ${isActive ? styles.activeMenu : ''}`}
                            >
                                {/* container icon */}
                                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                    {/* image fill = gambar ngikutin ukuran parent */}
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

                {/* ===== bagian logout (di bawah sidebar) ===== */}
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

            {/* ===== main content (area konten utama) ===== */}
            <main className={styles.mainContent}>
                {/* children = isi halaman yang dibungkus layout ini */}
                {/* misal: <Petugaslayout><Kontendashboard /></Petugaslayout> */}
                {/* maka children = <Kontendashboard /> */}
                {children}
            </main>
        </div>
    );
};
