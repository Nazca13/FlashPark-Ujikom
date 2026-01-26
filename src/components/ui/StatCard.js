import Image from "next/image";
import styles from './StatCard.module.css';

export const StatCard = ({ title, value, iconPath }) => {
  return (
    <div className={styles.card}>
      <div className={styles.textGroup}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <div className={styles.iconWrapper}>
        {/* Icon sudah punya background sendiri */}
        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
          <Image
            src={iconPath}
            alt={title}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};