// src/app/page.tsx
import SignInForm from "@/components/auth/SignInForm";
import AuthLayout from "./dashboard/admin/(auth)/layout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
