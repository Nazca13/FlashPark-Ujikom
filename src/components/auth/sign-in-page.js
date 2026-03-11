/**
 * ============================================================================
 * SIGN-IN PAGE VIEW - src/components/auth/sign-in-page.js
 * ============================================================================
 * Komponen form login FlashPark (Client Component).
 * Menampilkan form dengan input username, password, dan tombol "Masuk Sekarang".
 * 
 * Fitur:
 * - Toggle show/hide password (ikon mata)
 * - Validasi server-side (username & password dicek di server)
 * - Error message ditampilkan kalau login gagal
 * - Auto-disable saat loading (isPending)
 * 
 * Pattern: React useActionState + Next.js Server Action
 * - Form submit langsung memanggil loginAction di server
 * - Server return { error: "..." } kalau gagal, atau redirect kalau berhasil
 * 
 * @module SignInPageView
 * @path /signin
 * ============================================================================
 */

// "use client" = komponen ini jalan di browser user (butuh interaksi: ketik, klik)
"use client";

// import useActionState = hook React 19 untuk menghubungkan form ke server action
// useState = hook React untuk state lokal (toggle password)
import { useActionState, useState } from "react";

// import Image dari Next.js untuk menampilkan ikon toggle password
import Image from "next/image";

// import server action loginAction dari fitur autentikasi
// loginAction menangani logika login (cek database, set cookie, redirect)
import { loginAction } from "@/features/authentication/actions";

// import CSS Module untuk styling form login
import styles from "./sign-in-page.module.css";

// ===== STATE AWAL =====
// initialState = state form sebelum user interaksi (error masih kosong)
const initialState = {
    error: "",    // pesan error login (kosong = belum ada error)
};

/**
 * SignInPageView - Komponen Form Login
 * 
 * @returns {JSX.Element} - Form login dengan username, password, dan tombol submit
 */
export function SignInPageView() {
    // ===== SETUP HOOKS =====

    // useActionState = hook yang menghubungkan form ke server action (loginAction)
    // state = object berisi error message dari server (jika login gagal)
    // formAction = fungsi yang dipanggil saat form di-submit
    // isPending = boolean, true saat form sedang diproses oleh server
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    // state lokal untuk toggle show/hide password
    const [showPassword, setShowPassword] = useState(false); // false = password tersembunyi (default)

    return (
        // container utama form login (centered oleh AuthLayout)
        <div className={styles.container}>

            {/* ===== JUDUL ===== */}
            <h1 className={styles.title}>Masuk ke FlashPark</h1>

            {/* ===== SUB JUDUL ===== */}
            <p className={styles.subtitle}>Sistem Manajemen Parkir Modern</p>

            {/* ===== FORM LOGIN ===== */}
            {/* action={formAction} = saat submit, langsung kirim ke server action */}
            <form action={formAction} className={styles.form}>

                {/* ===== INPUT USERNAME ===== */}
                <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        id="username"
                        name="username"                    // name penting! di server diambil: formData.get("username")
                        type="text"
                        placeholder="Masukkan username"
                        required                           // wajib diisi (HTML5 validation)
                        className={styles.input}
                    />
                </div>

                {/* ===== INPUT PASSWORD ===== */}
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}  // toggle: text = terlihat, password = tersembunyi
                            placeholder="Masukkan password"
                            required
                            className={styles.input}
                        />
                        {/* ===== TOMBOL TOGGLE SHOW/HIDE PASSWORD ===== */}
                        <button
                            type="button"                              // type="button" agar tidak submit form
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}  // balik state showPassword
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        // aria-label = label untuk screen reader (aksesibilitas)
                        >
                            {/* ikon mata: berubah sesuai state showPassword */}
                            <Image
                                src={showPassword ? "/content/password-on.svg" : "/content/password-off.svg"}
                                alt={showPassword ? "Hide password" : "Show password"}
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                </div>

                {/* ===== ERROR MESSAGE ===== */}
                {/* Hanya muncul kalau ada error dari server (state.error tidak kosong) */}
                {/* ?. = optional chaining: cegah error kalau state null */}
                {state?.error && (
                    <div className={styles.error}>
                        {state.error}
                    </div>
                )}

                {/* ===== TOMBOL SUBMIT ===== */}
                {/* type="submit" = saat diklik, form di-submit ke server action */}
                <button type="submit" className={styles.button}>
                    Masuk Sekarang
                </button>
            </form>
        </div>
    );
}
