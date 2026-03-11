/**
 * ============================================================================
 * INPUT COMPONENT - src/components/ui/inputs/input.js
 * ============================================================================
 * Komponen input field reusable (bisa dipakai ulang) dengan label.
 * Sudah termasuk styling konsisten: background abu-abu, border saat focus, dll.
 * 
 * Cara pakai:
 *   <Input label="Nama Lengkap" name="nama" required />
 *   <Input label="Email" type="email" name="email" placeholder="contoh@mail.com" />
 * 
 * @module Input
 * ============================================================================
 */

// import CSS Module untuk styling input
import styles from './input.module.css';

/**
 * Input - Komponen Input Field dengan Label
 * 
 * @param {Object} props - Properties komponen
 * @param {string} props.label - Teks label yang muncul di atas input (contoh: "Username")
 * @param {string} [props.type="text"] - Tipe input HTML: "text", "email", "password", "number", dll
 * @param {...any} props - Props tambahan (name, placeholder, required, dll) diteruskan ke <input>
 * @returns {JSX.Element} - Group label + input field
 */
export const Input = ({ label, type = "text", ...props }) => (
  // wrapper group: label di atas, input di bawah
  <div className={styles.inputGroup}>
    {/* label untuk input (teks seperti "Username", "Password") */}
    <label className={styles.label}>
      {label}
    </label>
    {/* input field untuk user mengetik */}
    <input
      type={type}                    // tipe input (default "text")
      className={styles.inputField}  // styling dari CSS Module
      {...props}                     // teruskan semua props tambahan (name, placeholder, dll)
    />
  </div>
);