"use client";
import { LoginForm } from "@/components/login-form";
import AnimatedBackground from "../shared/wrappers/animated-background";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RectangleGoggles } from "lucide-react";

// export default function LoginPage() {
//   return (
//     <AnimatedBackground>
//       <div className="flex min-h-svh flex-col items-center justify-center">
//         <div className="w-full max-w-sm md:max-w-3xl">
//           <LoginForm />
//         </div>
//       </div>
//     </AnimatedBackground>
//   );
// }

export function AuthLayout({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <AnimatedBackground>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <div className="w-full max-w-sm md:max-w-3xl"></div>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden shadow-lg border-none p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div>{children}</div>
              <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br to-amber-200/40 via-purple-100 from-primary/10">
                <div className="absolute inset-0 h-full w-full opacity-80" />
                <span className="relative z-10 text-3xl font-bold flex flex-col items-center gap-3 text-primary drop-shadow-none">
                  <RectangleGoggles className="inline-block mr-2 size-12 text-primary/30" />
                  Digital Onboarding
                </span>
              </div>
            </CardContent>
          </Card>
          {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
        </div>
      </div>
    </AnimatedBackground>
  );
}
