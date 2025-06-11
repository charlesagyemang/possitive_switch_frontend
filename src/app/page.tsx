"use client";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-400 via-pink-200 to-violet-100">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-6xl font-bold text-violet-900 text-center">
          Positive Switch App
        </h1>
        <Button
          onClick={() => router.push("/dashboard")}
          variant={"default"}
          size="lg"
          className="flex items-center gap-2"
        >
          Continue to Dashboard <MoveRight />
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;
