"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut,
  Crown,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import QueryClientWrapper from "@/app/shared/wrappers/query-client";

interface Company {
  id: string;
  name: string;
  email: string;
  logo_url?: string;
  api_key: string;
}

function CompanyDashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const apiKey = params.api_key as string;

  useEffect(() => {
    // Get company data from localStorage
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      setCompany(JSON.parse(companyData));
    } else {
      // If no company data, redirect to login
      router.push('/company-login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('companyData');
    router.push('/company-login');
  };

  const navigation = [
    {
      name: "Overview",
      href: `/company-dashboard/${apiKey}`,
      icon: BarChart3,
      current: pathname === `/company-dashboard/${apiKey}`,
    },
    {
      name: "Candidates",
      href: `/company-dashboard/${apiKey}/candidates`,
      icon: Users,
      current: pathname.includes('/candidates'),
    },
    {
      name: "Contracts",
      href: `/company-dashboard/${apiKey}/contracts`,
      icon: FileText,
      current: pathname.includes('/contracts'),
    },
    {
      name: "Settings",
      href: `/company-dashboard/${apiKey}/settings`,
      icon: Settings,
      current: pathname.includes('/settings'),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 dark:text-purple-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-300 font-medium mb-4">Access denied. Please login again.</p>
          <Button onClick={() => router.push('/company-login')} className="bg-purple-600 hover:bg-purple-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black">
      {/* Beautiful Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-100/30 via-purple-100/30 to-blue-100/30 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-blue-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.2),transparent)] dark:bg-[radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(221,160,221,0.2),transparent)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(221,160,221,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(173,216,230,0.2),transparent)] dark:bg-[radial-gradient(circle_at_40%_40%,rgba(173,216,230,0.1),transparent)]"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300 dark:text-purple-400 animate-pulse opacity-30 dark:opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-purple-200/50 dark:border-purple-500/30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0`}>
          <div className="flex flex-col h-full">
            {/* Company Header */}
            <div className="p-6 border-b border-purple-200/50 dark:border-purple-500/30">
              <div className="flex items-center gap-3">
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {company.name}
                  </h1>
                  <p className="text-sm text-purple-600 dark:text-purple-300 truncate">
                    Company Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      item.current
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-purple-200/50 dark:border-purple-500/30">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0 flex flex-col min-h-screen">
          {/* Top header */}
          <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-500/30 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back! 👋
                  </h2>
                  <p className="text-purple-600 dark:text-purple-300">
                    Manage your company with style ✨
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="hidden sm:flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                  <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Company Portal
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientWrapper>
      <CompanyDashboardLayoutContent>
        {children}
      </CompanyDashboardLayoutContent>
    </QueryClientWrapper>
  );
}
