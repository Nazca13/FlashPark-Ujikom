import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignInPageView } from "@/components/auth/sign-in-page";

export default function Page() {
  return (
    <AuthLayout>
      <SignInPageView />
    </AuthLayout>
  );
}