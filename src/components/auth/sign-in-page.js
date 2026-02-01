"use client";
import { useFormState } from "react-dom";
import { loginAction } from "@/app/login/actions";
import styles from "./sign-in-page.module.css";

const initialState = {
    error: "",
};

export function SignInPageView() {
    const [state, formAction] = useFormState(loginAction, initialState);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Masuk ke FlashPark</h1>
            <p className={styles.subtitle}>Sistem Manajemen Parkir Modern</p>

            <form action={formAction} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Masukkan username"
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Masukkan password"
                        required
                        className={styles.input}
                    />
                </div>

                {state?.error && (
                    <div className={styles.error}>
                        {state.error}
                    </div>
                )}

                <button type="submit" className={styles.button}>
                    Masuk Sekarang
                </button>
            </form>
        </div>
    );
}
