/**
 * ============================================================================
 * SIGNIN PAGE - src/app/signin/page.js
 * ============================================================================
 * Halaman login (/signin) yang menggabungkan AuthLayout dan SignInPageView.
 * 
 * Ini adalah Server Component (default di Next.js 13+).
 * Tugasnya sederhana: menggabungkan layout dan form login.
 * 
 * Struktur:
 * AuthLayout (background + logo + card putih)
 *   └── SignInPageView (form username + password + tombol login)
 * 
 * @module SignInPage
 * @path /signin
 * ============================================================================
 */

// import komponen layout khusus untuk halaman autentikasi (login/register)
// AuthLayout menyediakan background abu-abu, logo, dan card putih
import { AuthLayout } from "@/components/layouts/auth-layout";

// import komponen form login (Client Component yang handle interaksi user)
import { SignInPageView } from "@/components/auth/sign-in-page";

/**
 * Page - Halaman Login FlashPark
 * 
 * Menggabungkan AuthLayout sebagai wrapper dan SignInPageView sebagai konten.
 * 
 * @returns {JSX.Element} - Layout autentikasi berisi form login
 */
export default function Page() {
  return (
    // AuthLayout = wrapper dengan background, logo, dan card putih
    <AuthLayout>
      {/* SignInPageView = form login (username, password, tombol submit) */}
      <SignInPageView />
    </AuthLayout>
  );
}
