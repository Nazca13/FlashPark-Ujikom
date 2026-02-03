import { PetugasLayout } from "@/components/layout/petugas-layout";
import CheckoutSystem from "./checkout-system";
import styles from "../petugas.module.css";
import { getParkedVehicles } from "../actions";

export default async function CheckoutPage() {
    const res = await getParkedVehicles();
    const parkedData = res.success ? res.data : [];

    return (
        <PetugasLayout activePage="Transaksi Keluar">
            <div className={styles.container} style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
                <div style={{ width: '100%' }}>
                    <h1 className={styles.heading} style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Transaksi Keluar
                    </h1>
                    <CheckoutSystem initialParkedVehicles={parkedData} />
                </div>
            </div>
        </PetugasLayout>
    );
}
