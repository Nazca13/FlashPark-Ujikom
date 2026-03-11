/**
 * ============================================================================
 * BUTTON COMPONENT - src/components/ui/buttons/button.js
 * ============================================================================
 * Komponen tombol reusable (bisa dipakai ulang) untuk seluruh aplikasi.
 * Tombol ini sudah punya styling primary (biru FlashPark) secara default.
 * 
 * Cara pakai:
 *   <Button type="submit">Simpan Data</Button>
 *   <Button onClick={handleClick}>Klik Saya</Button>
 * 
 * @module Button
 * ============================================================================
 */

// import CSS Module untuk styling tombol
import styles from './button.module.css';

/**
 * Button - Komponen Tombol Primary Reusable
 * 
 * @param {Object} props - Properties komponen
 * @param {React.ReactNode} props.children - Teks/isi tombol (contoh: "Simpan", "Update")
 * @param {string} [props.type="button"] - Tipe tombol HTML: "button", "submit", atau "reset"
 * @param {...any} props - Props tambahan lainnya (onClick, disabled, dll) akan diteruskan ke <button>
 * @returns {JSX.Element} - Elemen tombol HTML dengan styling primary
 */
export const Button = ({ children, type = "button", ...props }) => (
  <button
    type={type}                 // tipe tombol (default "button", bisa diubah jadi "submit" untuk form)
    className={styles.btnPrimary} // styling tombol biru dari CSS Module
    {...props}                  // spread operator: teruskan semua props lain ke elemen <button>
  >
    {children}                  {/* tampilkan konten tombol (teks, ikon, dll) */}
  </button>
);