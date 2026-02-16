// "use client" = komponen ini jalan di browser user (butuh interaksi)
"use client";

// useFormState = hook dari react buat handle state form + server action
import { useActionState, useState } from "react";
import Image from "next/image";

// import fungsi loginAction dari file actions.js
import { loginAction } from "@/features/authentication/actions";

// import styling css module
import styles from "./sign-in-page.module.css";

// state awal, error masih kosong
const initialState = {
    error: "",
};

// komponen utama halaman login
export function SignInPageView() {
    // useActionState nge-connect form kita ke server action
    // state = isinya error message (kalo ada)
    // formAction = fungsi yg dipanggil pas form di-submit
    // isPending = status loading
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const [showPassword, setShowPassword] = useState(false);

    return (
        // container utama halaman login
        <div className={styles.container}>
            {/* judul halaman */}
            <h1 className={styles.title}>Masuk ke FlashPark</h1>
            {/* sub judul */}
            <p className={styles.subtitle}>Sistem Manajemen Parkir Modern</p>

            {/* form login, action-nya langsung ke server */}
            <form action={formAction} className={styles.form}>
                {/* input username */}
                <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        id="username"
                        name="username" // name ini penting, diambil di server pake formData.get("username")
                        type="text"
                        placeholder="Masukkan username"
                        required // wajib diisi
                        className={styles.input}
                    />
                </div>

                {/* input password */}
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"} // toggle type
                            placeholder="Masukkan password"
                            required
                            className={styles.input}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            <Image
                                src={showPassword ? "/content/password-on.svg" : "/content/password-off.svg"}
                                alt={showPassword ? "Hide password" : "Show password"}
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                </div>

                {/* kalo ada error dari server, tampilin di sini */}
                {state?.error && (
                    <div className={styles.error}>
                        {state.error}
                    </div>
                )}

                {/* tombol submit */}
                <button type="submit" className={styles.button}>
                    Masuk Sekarang
                </button>
            </form>
        </div>
    );
}
