// import komponen layout khusus untuk halaman autentikasi (login/register)
// authlayout ini biasanya punya styling berbeda dari dashboard
import { AuthLayout } from "@/components/layouts/auth-layout";

// import komponen view halaman sign in yang berisi form username dan password
import { SignInPageView } from "@/components/auth/sign-in-page";

// fungsi utama halaman signin, ini yang di-render saat user buka /signin
export default function Page() {
  return (
    // authlayout membungkus seluruh halaman login dengan styling khusus
    <AuthLayout>
      {/* signinpageview adalah form login yang sebenarnya */}
      <SignInPageView />
    </AuthLayout>
  );
}

