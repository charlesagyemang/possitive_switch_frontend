"use client";
import { Button } from "@/components/ui/button";
import { LoaderPinwheel, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";
import AnimatedBackground from "./shared/wrappers/animated-background";

function LandingPage() {
  const router = useRouter();
  return (
    <AnimatedBackground>
      <div className="w-full flex justify-center mx-auto">
        <div className="relative max-w-3xl z-10 flex flex-col items-center gap-10 px-12 py-16 bg-gradient-to-br from-white via-blue-50 to-violet-50 backdrop-blur-xl rounded-3xl shadow-lg border-none border-blue-100/60">
          {/* <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-3 h-3 bg-violet-400 rounded-full animate-pulse"></span>
          <span className="uppercase text-xs font-semibold text-violet-600 tracking-widest">
            Welcome
          </span>
        </div> */}
          <LoaderPinwheel className="w-16 h-16 text-primary animate-spin mb-4" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-600 to-fuchsia-500 text-center drop-shadow-lg">
            Digital Onboarding
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 text-center max-w-2xl font-medium">
            Experience a seamless onboarding journey.
            <br />
            Fast, secure, and beautifully simple.
          </p>
          <Button
            onClick={() => router.push("/login")}
            variant="default"
            size="lg"
            className="flex items-center rounded-full gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-amber-500 hover:from-violet-500 hover:to-blue-600 transition-all duration-200 shadow-sm"
          >
            Get Started
            <MoveRight className="w-6 h-6 ml-1" />
          </Button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-4 bg-gradient-to-r from-blue-200 via-violet-200 to-fuchsia-200 blur-lg opacity-60 rounded-full"></div>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default LandingPage;
