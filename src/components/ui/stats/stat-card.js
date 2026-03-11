/**
 * ============================================================================
 * STAT CARD COMPONENT - src/components/ui/stats/stat-card.js
 * ============================================================================
 * Komponen kartu statistik reusable untuk menampilkan data ringkasan.
 * Dipakai di dashboard admin untuk menampilkan info seperti:
 * - Total Pendapatan
 * - Kendaraan Masuk
 * - Sisa Slot
 * - Total Petugas
 * 
 * Cara pakai:
 *   <StatCard title="Total Pendapatan" value="Rp 500.000" iconPath="/content/icon.svg" />
 * 
 * @module StatCard
 * ============================================================================
 */

// import Image dari Next.js untuk optimasi gambar
import Image from "next/image";

// import CSS Module untuk styling card
import styles from './stat-card.module.css';

/**
 * StatCard - Komponen Kartu Statistik
 * 
 * @param {Object} props - Properties komponen
 * @param {string} props.title - Judul statistik (contoh: "Total Pendapatan")
 * @param {string|number} props.value - Nilai statistik (contoh: "Rp 500.000" atau 42)
 * @param {string} props.iconPath - Path ke file ikon SVG (dari folder public/)
 * @returns {JSX.Element} - Kartu statistik dengan judul, nilai, dan ikon
 */
export const StatCard = ({ title, value, iconPath }) => {
  return (
    // card utama: layout horizontal (teks di kiri, ikon di kanan)
    <div className={styles.card}>
      {/* bagian teks: judul dan nilai */}
      <div className={styles.textGroup}>
        {/* judul statistik (abu-abu, kecil) */}
        <span className={styles.title}>{title}</span>
        {/* nilai statistik (besar, tebal, hitam) */}
        <span className={styles.value}>{value}</span>
      </div>

      {/* bagian ikon di sebelah kanan */}
      <div className={styles.iconWrapper}>
        {/* container ikon dengan ukuran 48x48px */}
        {/* Icon sudah punya background sendiri (dari file SVG) */}
        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
          <Image
            src={iconPath}                      // path ke file ikon
            alt={title}                         // alt text = judul statistik
            fill                                // mode fill: isi penuh container
            style={{ objectFit: 'contain' }}    // contain: jaga proporsi gambar
          />
        </div>
      </div>
    </div>
  );
};