"use client";
import AnimatedBackground from "../shared/wrappers/animated-background";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { RectangleGoggles } from "lucide-react";
import QueryClientWrapper from "../shared/wrappers/query-client";

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
    <QueryClientWrapper>
      <AnimatedBackground>
        <div className="flex min-h-svh flex-col items-center justify-center">
          <div className="w-full max-w-sm md:max-w-3xl"></div>
          <div
            className={cn(
              "flex flex-col gap-6 md:max-w-3xl md:min-w-3xl",
              className
            )}
            {...props}
          >
            <Card className="overflow-hidden shadow-lg border-none p-0 h-[550px]">
              <CardContent className="grid p-0 md:grid-cols-2 h-full">
                <div className="flex flex-col justify-center">{children}</div>
                <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br to-amber-200/40 via-purple-100 from-primary/10">
                  <div className="absolute inset-0 h-full w-full opacity-80" />
                  <span className="relative z-10 text-3xl font-bold flex flex-col items-center gap-3 text-primary drop-shadow-none">
                    <RectangleGoggles className="inline-block mr-2 size-12 text-primary/30" />
                    Positive Switch
                    <span className="text-xs text-primary/80 uppercase">
                      Admin Portal
                    </span>
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
    </QueryClientWrapper>
  );
}
