"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Hexagon, Binary, Cpu, Shield, Zap, Network } from "lucide-react";
import QueryClientWrapper from "../shared/wrappers/query-client";
import React, { useState, useEffect } from "react";

export function AuthLayout({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [matrixElements, setMatrixElements] = useState<Array<{left: number, top: number, delay: number, text: string}>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Generate particles only on client
    const newParticles = [...Array(30)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setParticles(newParticles);

    // Generate matrix elements only on client
    const newMatrixElements = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      text: Math.random().toString(36).substring(7)
    }));
    setMatrixElements(newMatrixElements);
  }, []);

  const FloatingParticles = () => {
    if (!isClient) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>
    );
  };

  const MatrixRain = () => {
    if (!isClient) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {matrixElements.map((element, i) => (
          <div
            key={i}
            className="absolute text-green-400 text-xs font-mono animate-pulse"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              animationDelay: `${element.delay}s`
            }}
          >
            {element.text}
          </div>
        ))}
      </div>
    );
  };

  return (
    <QueryClientWrapper>
      <div className="min-h-screen bg-black overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.2),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,120,200,0.2),transparent)]"></div>
        </div>

        <FloatingParticles />
        <MatrixRain />

        <div className="flex min-h-screen flex-col items-center justify-center relative z-10 px-4">
          <div
            className={cn(
              "w-full max-w-6xl",
              className
            )}
            {...props}
          >
            <Card className="overflow-hidden bg-black/60 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/25">
              <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
                {/* Form Section */}
                <div className="flex flex-col justify-center relative">
                  {children}
                </div>
                
                {/* Cyberpunk Branding Section */}
                <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 border-l border-cyan-500/20">
                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(34,211,238,0.15),transparent)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.15),transparent)]" />
                  
                  {/* Floating Elements */}
                  {isClient && (
                    <>
                      <div className="absolute top-20 left-10 opacity-30">
                        <Binary className="w-8 h-8 text-cyan-400 animate-pulse" />
                      </div>
                      <div className="absolute top-40 right-16 opacity-30">
                        <Cpu className="w-6 h-6 text-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
                      </div>
                      <div className="absolute bottom-32 left-8 opacity-30">
                        <Shield className="w-7 h-7 text-emerald-400 animate-pulse" style={{ animationDelay: '2s' }} />
                      </div>
                      <div className="absolute bottom-20 right-12 opacity-30">
                        <Zap className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                      </div>
                      <div className="absolute top-60 left-20 opacity-30">
                        <Network className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
                      </div>
                    </>
                  )}
                  
                  {/* Main Content */}
                  <div className="relative z-10 text-center space-y-6">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <Hexagon className="w-20 h-20 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                        <div className="absolute inset-0 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Brand Text */}
                    <div className="space-y-4">
                      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                        POSITIVE SWITCH
                      </h1>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-white">
                          Digital Onboarding System
                        </p>
                        <p className="text-sm text-cyan-300 uppercase tracking-wider">
                          Neural Authentication Portal
                        </p>
                      </div>
                    </div>
                    
                    {/* Tech Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-8 max-w-xs mx-auto">
                      <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 text-center">
                        <div className="text-cyan-400 font-black text-lg">98%</div>
                        <div className="text-gray-400 text-xs">Success Rate</div>
                      </div>
                      <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3 text-center">
                        <div className="text-purple-400 font-black text-lg">24/7</div>
                        <div className="text-gray-400 text-xs">Online</div>
                      </div>
                      <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3 text-center">
                        <div className="text-emerald-400 font-black text-lg">256</div>
                        <div className="text-gray-400 text-xs">Bit Secure</div>
                      </div>
                      <div className="bg-black/40 border border-pink-500/30 rounded-lg p-3 text-center">
                        <div className="text-pink-400 font-black text-lg">1ms</div>
                        <div className="text-gray-400 text-xs">Response</div>
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-semibold">SYSTEM ONLINE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </QueryClientWrapper>
  );
}
