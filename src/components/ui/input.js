import styles from './input.module.css';

export const Input = ({ label, type = "text", ...props }) => (
  <div className={styles.inputGroup}>
    <label className={styles.label}>
      {label}
    </label>
    <input
      type={type}
      className={styles.inputField}
      {...props}
    />
  </div>
);