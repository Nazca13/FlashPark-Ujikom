import styles from './Button.module.css';

// Perhatikan kata "export" di depan const
export const Button = ({ children, type = "button", ...props }) => (
  <button
    type={type}
    className={styles.btnPrimary}
    {...props}
  >
    {children}
  </button>
);