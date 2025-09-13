"use client";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Calendar,
  Mail, 
  FileText, 
  Users, 
  Heart,
  Clock,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  Globe,
  Rocket,
  Terminal,
  Brain,
  Eye,
  Database,
  Network,
  Code,
  Cpu,
  Binary,
  GitBranch,
  Hexagon
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

function LandingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const workflowSteps = [
    {
      id: 1,
      icon: <Mail className="w-8 h-8" />,
      title: "Offer Acceptance",
      description: "Candidate signs offer letter → Auto-generate welcome email with parcel delivery notification",
      color: "from-cyan-400 to-blue-500",
      glow: "shadow-cyan-500/25"
    },
    {
      id: 2,
      icon: <FileText className="w-8 h-8" />,
      title: "Contract & Documents",
      description: "Full employment contract, take-on checklist, POPIA declaration with secure cloud storage",
      color: "from-purple-500 to-pink-500",
      glow: "shadow-purple-500/25"
    },
    {
      id: 3,
      icon: <Shield className="w-8 h-8" />,
      title: "Policies & Induction",
      description: "Digital company policy handbook with acknowledgment checklist and HR calendar invite",
      color: "from-emerald-400 to-teal-500",
      glow: "shadow-emerald-500/25"
    },
    {
      id: 4,
      icon: <Heart className="w-8 h-8" />,
      title: "Values & Social",
      description: "Company mission, vision, values with direct social media links for community engagement",
      color: "from-rose-400 to-orange-500",
      glow: "shadow-rose-500/25"
    },
    {
      id: 5,
      icon: <Clock className="w-8 h-8" />,
      title: "3-Day Countdown",
      description: "Automated reminder with Day 1 expectations, dress code, and complete induction agenda",
      color: "from-amber-400 to-yellow-500",
      glow: "shadow-amber-500/25"
    },
    {
      id: 6,
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Feedback Analytics",
      description: "5-question feedback form with dashboard insights for HR optimization and personalization",
      color: "from-indigo-400 to-purple-500",
      glow: "shadow-indigo-500/25"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Email Automation",
      description: "Intelligent email sequences triggered by candidate actions with parcel notifications",
      gradient: "from-cyan-400 via-blue-500 to-purple-600",
      glow: "shadow-lg shadow-cyan-500/50"
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Cloud Storage",
      description: "Secure document storage with real-time team organogram updates and photo integration",
      gradient: "from-emerald-400 via-teal-500 to-blue-600",
      glow: "shadow-lg shadow-emerald-500/50"
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Live Dashboard",
      description: "Real-time progress tracking with alerts, flags, and manual nudge functionality",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      glow: "shadow-lg shadow-purple-500/50"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Role-Based Access",
      description: "HR Manager full control + Line Manager view-only with comment/nudge rights",
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
      glow: "shadow-lg shadow-orange-500/50"
    }
  ];

  const stats = [
    { number: "98%", label: "Completion Rate", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "6", label: "Workflow Steps", icon: <Zap className="w-6 h-6" /> },
    { number: "3", label: "Days Average", icon: <Clock className="w-6 h-6" /> },
    { number: "100%", label: "Paperless", icon: <FileText className="w-6 h-6" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [workflowSteps.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [matrixElements, setMatrixElements] = useState<Array<{left: number, top: number, delay: number, text: string}>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Generate particles only on client
    const newParticles = [...Array(50)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setParticles(newParticles);

    // Generate matrix elements only on client
    const newMatrixElements = [...Array(20)].map(() => ({
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
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.2),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,120,200,0.2),transparent)]"></div>
      </div>

      <FloatingParticles />
      <MatrixRain />

      {/* Mouse Follower */}
      {isClient && (
        <div 
          className="fixed w-96 h-96 pointer-events-none z-0 opacity-30"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
            transition: 'all 0.1s ease-out'
          }}
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-8 py-3 mb-12 border border-cyan-500/30 shadow-2xl shadow-cyan-500/25">
            <Hexagon className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-sm font-bold text-cyan-300 tracking-wider uppercase">Digital Onboarding System by Positive Switch</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-2xl">
              DIGITAL
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 drop-shadow-2xl animate-pulse">
              ONBOARDING
            </span>
            <span className="block text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 font-light tracking-widest">
              SYSTEM 2026
          </span>
          </h1>

          {/* Subtitle with Glitch Effect */}
          <div className="relative mb-16">
            <p className="text-xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light">
              Create a seamless, engaging, and tech-enabled pre-onboarding journey for new hires through
              <span className="text-cyan-400 font-bold mx-2 relative">
                email automation
                <span className="absolute inset-0 text-cyan-400 animate-pulse opacity-50">email automation</span>
              </span>
              virtual reality, digital forms, and 
              <span className="text-purple-400 font-bold mx-2">cloud storage</span> 
              with full HR dashboard visibility.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button
              onClick={() => router.push("/auth/login")}
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600 text-white px-12 py-6 text-xl font-black rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 border border-cyan-400/50"
            >
              <span className="flex items-center gap-4">
                <Terminal className="w-7 h-7" />
                START YOUR JOURNEY
                <Rocket className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-purple-500 hover:border-cyan-400 px-12 py-6 text-xl font-bold rounded-2xl bg-black/50 backdrop-blur-xl text-purple-300 hover:text-cyan-300 transition-all duration-500 transform hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              <Play className="w-6 h-6 mr-3" />
              WATCH DEMO
              <GitBranch className="w-6 h-6 ml-3 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </div>

          {/* Stats with Neon Glow */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="group bg-black/40 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-400/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <CardContent className="p-8 text-center relative z-10">
                  <div className="flex justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* Workflow Visualization */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                THE ONBOARDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">JOURNEY</span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light">
                Six seamless steps that transform traditional hiring into an 
                <span className="text-cyan-400 font-bold"> engaging digital experience</span>
              </p>
            </div>

          {/* Holographic Timeline */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent h-px top-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`group relative cursor-pointer transition-all duration-700 transform ${
                    currentStep === index 
                      ? 'scale-110 z-20' 
                      : 'hover:scale-105 z-10'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <Card className={`bg-black/60 backdrop-blur-xl border transition-all duration-700 ${
                    currentStep === index
                      ? 'border-cyan-400 shadow-2xl shadow-cyan-500/50'
                      : 'border-gray-700 hover:border-purple-500/50'
                  }`}>
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-6 mx-auto shadow-xl ${step.glow} ${
                        currentStep === index ? 'animate-pulse' : ''
                      } transition-all duration-500 group-hover:scale-110`}>
                        {step.icon}
                      </div>
                      <h3 className="font-black text-xl text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        {step.description}
                      </p>
                    </CardContent>
                    {currentStep === index && (
                      <>
                        <div className="absolute -top-3 -right-3">
                          <Star className="w-8 h-8 text-yellow-400 fill-current animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent rounded-lg"></div>
                      </>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                POWERFUL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">FEATURES</span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light">
                Everything you need to create an unforgettable onboarding experience with full visibility
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-black/40 backdrop-blur-xl border border-gray-700 hover:border-cyan-400/50 transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 relative overflow-hidden">
                <CardContent className="p-10 text-center relative z-10">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-8 mx-auto ${feature.glow} group-hover:scale-125 transition-all duration-500 relative`}>
                    {feature.icon}
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  </div>
                  <h3 className="font-black text-2xl text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* Dashboard Preview */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                LIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">DASHBOARD</span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light">
                Full visibility and control over every onboarding journey with actionable insights
              </p>
            </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-cyan-500/30 shadow-2xl shadow-cyan-500/25 overflow-hidden">
              <CardContent className="p-12">
                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-12 border border-gray-700">
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        icon: <BarChart3 className="w-10 h-10 text-cyan-400" />,
                        title: "Progress Tracking",
                        subtitle: "Visual timeline monitoring",
                        color: "from-cyan-400 to-blue-600",
                        content: (
                          <div className="space-y-3">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full shadow-lg shadow-cyan-500/50"></div>
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full w-4/5 shadow-lg shadow-cyan-400/50"></div>
                            <div className="bg-gradient-to-r from-cyan-300 to-blue-400 h-3 rounded-full w-3/5 shadow-lg shadow-cyan-300/50"></div>
                          </div>
                        )
                      },
                      {
                        icon: <Users className="w-10 h-10 text-purple-400" />,
                        title: "Role Management",
                        subtitle: "Access control system",
                        color: "from-purple-400 to-pink-600",
                        content: (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
                              <span className="text-purple-300 font-bold">HR Manager</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50 animate-pulse"></div>
                              <span className="text-purple-200">Line Manager</span>
                            </div>
                          </div>
                        )
                      },
                      {
                        icon: <MessageSquare className="w-10 h-10 text-emerald-400" />,
                        title: "Feedback Analytics",
                        subtitle: "Experience optimization",
                        color: "from-emerald-400 to-teal-600",
                        content: (
                          <div className="text-center">
                            <div className="text-4xl font-black text-emerald-400 mb-2 animate-pulse">4.8/5</div>
                            <div className="text-emerald-300 font-semibold">Average Satisfaction</div>
                            <div className="mt-2 flex justify-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        )
                      }
                    ].map((item, index) => (
                      <div key={index} className={`bg-gradient-to-br ${item.color}/10 p-8 rounded-2xl border border-gray-600 hover:border-cyan-400/50 transition-all duration-500 group`}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-black text-white text-lg">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.subtitle}</p>
                          </div>
                        </div>
                        {item.content}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-16 border border-cyan-500/30 shadow-2xl shadow-purple-500/25 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent)]"></div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 relative z-10">
              READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">TRANSFORM</span>?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 relative z-10 font-light">
              Join leading companies who&apos;ve revolutionized their onboarding experience
          </p>
          <Button
            onClick={() => router.push("/auth/login")}
            size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 text-white px-16 py-8 text-2xl font-black rounded-3xl shadow-2xl shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 border border-cyan-400/50 relative z-10"
            >
              <span className="flex items-center gap-4">
                <Hexagon className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
                START YOUR DIGITAL JOURNEY
                <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
          </div>
        </div>
      </section>
      </div>
  );
}

export default LandingPage;
