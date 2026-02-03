import Image from "next/image";
import styles from './auth-layout.module.css';

export const AuthLayout = ({ children }) => (
    <div className={styles.container}>
        {/* Header Logo */}
        <div className={styles.header}>
            <div className={styles.logoContainer}>
                {/* Mengarah ke public/Logo (1).svg */}
                <Image
                    src="/Logo (1).svg"
                    alt="FlashPark Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>

        {/* Card Putih */}
        <div className={styles.card}>
            {children}
        </div>
    </div>
);