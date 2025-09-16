"use client";

import AnimatedBackground from "@/app/shared/wrappers/animated-background";

export default function CandidateAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </AnimatedBackground>
  );
}
