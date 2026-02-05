import { Sidebar } from "../shared/sidebar";
import styles from './styles.module.css';

export const DashboardLayout = ({ children, activePage }) => {
  return (
    <div className={styles.container}>
      <Sidebar activePage={activePage} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};