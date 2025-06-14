"use client";
import { LoginForm } from "@/components/login-form";
import AnimatedBackground from "../shared/wrappers/animated-background";

export default function LoginPage() {
  return (
    <AnimatedBackground>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </AnimatedBackground>
  );
}
