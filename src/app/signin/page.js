import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignInPageView } from "@/components/pages/SignInPage";

export default function Page() {
  return (
    <AuthLayout>
      <SignInPageView />
    </AuthLayout>
  );
}