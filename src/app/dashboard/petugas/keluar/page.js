import { PetugasLayout } from "@/components/layout/PetugasLayout";
import CheckoutSystem from "./checkout-system";
import styles from "../petugas.module.css";

export default function CheckoutPage() {
    return (
        <PetugasLayout activePage="Transaksi Keluar">
            <div className={styles.container}>
                <div style={{ width: '100%' }}>
                    <h1 className={styles.heading} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        📤 Transaksi Keluar
                    </h1>
                    <CheckoutSystem />
                </div>
            </div>
        </PetugasLayout>
    );
}
