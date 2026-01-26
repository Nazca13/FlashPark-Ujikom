"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from './SignInPage.module.css';
import { loginAction } from "@/app/login/actions";

export const SignInPageView = () => {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <>
      <h2 className={styles.title}>Sign In</h2>

      <form className={styles.form} action={formAction}>
        {state?.error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{state.error}</p>
        )}

        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          name="username"
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          name="password"
          required
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <span className={styles.link}>
          Contact Admin
        </span>
      </p>
    </>
  );
};