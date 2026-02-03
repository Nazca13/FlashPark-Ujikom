import { Sidebar } from "./sidebar";
import styles from './dashboard-layout.module.css';

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