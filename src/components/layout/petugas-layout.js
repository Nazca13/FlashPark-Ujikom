import Link from "next/link";
import Image from "next/image";
import styles from './PetugasLayout.module.css';
import { logoutAction } from "@/app/login/actions";

export const PetugasLayout = ({ children, activePage }) => {
    // Menu khusus untuk Petugas
    const menuItems = [
        { name: "Dashboard", path: "/dashboard/petugas", icon: "dashboard-icon" },
    ];

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                {/* Logo Section */}
                <div className={styles.logoArea}>
                    <Image src="/Logo (1).svg" alt="FlashPark" width={160} height={60} priority />
                </div>

                {/* Menu Navigation */}
                <div className={styles.menuGroup}>
                    <div className={styles.menuTitle}>Menu Petugas</div>

                    {menuItems.map((item) => {
                        const isActive = activePage === item.name;
                        const iconSrc = isActive
                            ? `/sidebar/${item.icon}-active.svg`
                            : `/sidebar/${item.icon}.svg`;

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`${styles.menuItem} ${isActive ? styles.activeMenu : ''}`}
                            >
                                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                    <Image
                                        src={iconSrc}
                                        alt={item.name}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Logout Section */}
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
                                background: 'transparent'
                            }}
                        >
                            <Image src="/sidebar/logout-icon.svg" alt="Logout" width={20} height={20} />
                            <span style={{ marginLeft: '10px' }}>Log Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};
