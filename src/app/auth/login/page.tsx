"use client";
import { LoginForm } from "@/components/login-form";
import AnimatedBackground from "../../shared/wrappers/animated-background";
import AppNotifications from "@/components/built/app-notifications";
import { AuthLayout } from "../auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
