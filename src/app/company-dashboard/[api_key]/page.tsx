"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Plus,
  Sparkles,
  Crown,
  Building2,
  Settings
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  email: string;
  logo_url?: string;
  api_key: string;
}

export default function CompanyOverviewPage() {
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);

  const apiKey = params.api_key as string;

  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      setCompany(JSON.parse(companyData));
    }
    
  }, []);


  const quickActions = [
    {
      title: "Add New Candidate",
      description: "Invite a new candidate to join your company",
      icon: Plus,
      href: `/company-dashboard/${apiKey}/candidates?action=add`,
      color: "from-pink-500 to-purple-500",
    },
    {
      title: "View All Candidates",
      description: "Manage your existing candidates",
      icon: Users,
      href: `/company-dashboard/${apiKey}/candidates`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Send Contract",
      description: "Create and send contracts to candidates",
      icon: FileText,
      href: `/company-dashboard/${apiKey}/contracts`,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Company Settings",
      description: "Manage your company profile and templates",
      icon: Settings,
      href: `/company-dashboard/${apiKey}/settings`,
      color: "from-purple-500 to-pink-500",
    },
  ];

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 dark:text-purple-300 font-medium">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 flex items-center gap-2">
                {company.name} <Crown className="w-6 h-6 text-purple-500" />
              </h1>
              <p className="text-purple-600 dark:text-purple-300 font-medium">
                Company Dashboard - Manage everything in one place! 💎
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">API Key</div>
            <div className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {company.api_key.substring(0, 8)}...
            </div>
          </div>
        </div>
      </div>


      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl dark:hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 rounded-3xl overflow-hidden relative cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
