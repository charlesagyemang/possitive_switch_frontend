"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Building2, Sparkles, Crown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useValidateCompanyApiKey } from "@/api/companies/company-api";
import QueryClientWrapper from "@/app/shared/wrappers/query-client";

function CompanyLoginContent() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [sparkles, setSparkles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { run: validateApiKey, isPending: isLoading } = useValidateCompanyApiKey();

  // Generate sparkles on client side only to avoid hydration mismatch
  useEffect(() => {
    const sparkleData = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setSparkles(sparkleData);
  }, []);

  // Auto-fill API key from URL parameter
  useEffect(() => {
    const keyFromUrl = searchParams.get('key');
    if (keyFromUrl) {
      setApiKey(keyFromUrl);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    validateApiKey(apiKey, {
      onSuccess: (company) => {
        if (company) {
          // Store company data in localStorage for the session
          localStorage.setItem('companyData', JSON.stringify(company));
          router.push(`/company-dashboard/${apiKey}`);
        } else {
          setError("Invalid API key. Please check and try again.");
        }
      },
      onError: (err) => {
        console.error('API Key validation error:', err);
        setError("Invalid API key. Please check and try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black relative overflow-hidden">
      {/* Beautiful Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-100/30 via-purple-100/30 to-blue-100/30 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-blue-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.2),transparent)] dark:bg-[radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(221,160,221,0.2),transparent)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(221,160,221,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(173,216,230,0.2),transparent)] dark:bg-[radial-gradient(circle_at_40%_40%,rgba(173,216,230,0.1),transparent)]"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {sparkles.map((sparkle, i) => (
          <div
            key={i}
            className="absolute text-pink-300 dark:text-purple-400 animate-pulse opacity-30 dark:opacity-50"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600">
                  Company Portal
                </h1>
                <p className="text-purple-600 dark:text-purple-300 font-medium">
                  Access your company dashboard ✨
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Key className="w-6 h-6 text-purple-500" />
                Enter API Key
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Use your company API key to access your dashboard
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key
                  </label>
                  <Input
                    id="apiKey"
                    type="text"
                    placeholder="Enter your company API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-500 rounded-2xl h-12"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-2xl p-4">
                    <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !apiKey.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Accessing Dashboard...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Access Dashboard ✨
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-4">
              <ThemeToggle />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact your administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyLoginPage() {
  return (
    <QueryClientWrapper>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 dark:text-purple-300 font-medium">Loading...</p>
        </div>
      </div>}>
        <CompanyLoginContent />
      </Suspense>
    </QueryClientWrapper>
  );
}
