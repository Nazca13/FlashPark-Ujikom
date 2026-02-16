"use client";
import { useState } from "react";
import Image from "next/image";
import { createUser } from "@/features/users/actions";
import styles from "../admin.module.css";

export function AddUserForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form action={createUser} className={styles.filterRow} style={{ alignItems: 'flex-end' }}>
            {/* input nama lengkap */}
            <div className={styles.filterGroup} style={{ flex: 2 }}>
                <label className={styles.label}>Nama Lengkap</label>
                <input name="nama" className={styles.input} placeholder="Contoh: Budi Santoso" required />
            </div>

            {/* input username */}
            <div className={styles.filterGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Username</label>
                <input name="username" className={styles.input} placeholder="user123" required />
            </div>

            {/* input password */}
            <div className={styles.filterGroup} style={{ flex: 1, position: 'relative' }}>
                <label className={styles.label}>Password</label>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={styles.input}
                        placeholder="******"
                        required
                        style={{ paddingRight: '40px' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            borderRadius: "50%",
                            transition: "background-color 0.2s"
                        }}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                        <Image
                            src={showPassword ? "/content/password-on.svg" : "/content/password-off.svg"}
                            alt={showPassword ? "Hide password" : "Show password"}
                            width={18}
                            height={18}
                        />
                    </button>
                </div>
            </div>

            {/* dropdown pilih role */}
            <div className={styles.filterGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Role</label>
                <select name="role" className={styles.input} style={{ background: 'white', color: '#1F2937' }}>
                    <option value="petugas">Petugas</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                </select>
            </div>

            {/* tombol submit */}
            <button type="submit" className={styles.btnPrimary}>Simpan</button>
        </form>
    );
}
