import { AuthLayout } from "@/components/layout/auth-layout";
import { SignInPageView } from "@/components/auth/sign-in-page";

export default function Page() {
  return (
    <AuthLayout>
      <SignInPageView />
    </AuthLayout>
  );
}

