import { Sidebar } from "./Sidebar";
import styles from './DashboardLayout.module.css';

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