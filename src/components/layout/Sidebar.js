import Link from "next/link";
import Image from "next/image";
import styles from './Sidebar.module.css';
import { logoutAction } from "@/app/login/actions";

export const Sidebar = ({ activePage }) => {
  // Data Menu untuk memudahkan mapping dan maintenance
  const menuItems = [
    { name: "Dashboard", path: "/dashboard/admin", icon: "dashboard-icon" },
    { name: "Data User", path: "/dashboard/admin/users", icon: "data-user-icon" },
    // Asumsi nama file tarif mengikuti pola
    { name: "Data Tarif", path: "/dashboard/admin/tarif", icon: "data-tarif-icon" },
    { name: "Data Area", path: "/dashboard/admin/area", icon: "data-area-icon" },
    { name: "Log Aktivitas", path: "/dashboard/admin/logs", icon: "log-aktivitas-icon" },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* 1. Logo Section */}
      <div className={styles.logoArea}>
        <Image src="/Logo (1).svg" alt="FlashPark" width={160} height={60} priority />
      </div>

      {/* 2. Menu Navigation */}
      <div className={styles.menuGroup}>
        <div className={styles.menuTitle}>Main Menu</div>

        {menuItems.map((item) => {
          const isActive = activePage === item.name;

          // Logic: Jika aktif, ambil file *-active.svg, jika tidak ambil file .svg biasa
          const iconSrc = isActive
            ? `/sidebar/${item.icon}-active.svg`
            : `/sidebar/${item.icon}.svg`;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.menuItem} ${isActive ? styles.activeMenu : ''}`}
            >
              {/* Icon Image */}
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

      {/* 3. Logout Section */}
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
              fontFamily: 'inherit'
            }}
          >
            <Image src="/sidebar/logout-icon.svg" alt="Logout" width={20} height={20} />
            <span style={{ marginLeft: '10px' }}>Log Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
};