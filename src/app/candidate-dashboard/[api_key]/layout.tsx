"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  User, 
  FileText, 
  FolderOpen, 
  LogOut, 
  Settings, 
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  LoaderCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCandidateByApiKey } from "@/api/candidates/candidates-api";
import QueryClientWrapper from "@/app/shared/wrappers/query-client";

interface CandidateData {
  id: string;
  name: string;
  email: string;
  api_key: string;
  company_id: string;
  job_title?: string;
  status: string;
}

function CandidateDashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const apiKey = params.api_key as string;
  
  // Fetch candidate data using API key from URL
  const {
    data: candidate,
    isPending: loadingCandidate,
    isError: candidateError
  } = useCandidateByApiKey(apiKey);

  const handleLogout = () => {
    router.push('/candidate-auth/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'onboarding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'signed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'onboarding': return <Clock className="w-3 h-3" />;
      case 'signed': return <FileText className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  // Loading state
  if (loadingCandidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <LoaderCircle className="animate-spin h-12 w-12 text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (candidateError || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Invalid or expired candidate link. Please contact your HR department.
          </p>
          <Button 
            onClick={() => router.push('/candidate-auth/login')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Overview",
      href: `/candidate-dashboard/${apiKey}`,
      icon: User,
      description: "Your profile & progress"
    },
    {
      name: "Contracts",
      href: `/candidate-dashboard/${apiKey}/contracts`,
      icon: FileText,
      description: "View & sign contracts"
    },
    {
      name: "Documents",
      href: `/candidate-dashboard/${apiKey}/documents`,
      icon: FolderOpen,
      description: "Upload & manage files"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-blue-200/50 dark:border-gray-700/50 p-6 fixed left-0 top-0 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Candidate Portal
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your onboarding journey
                </p>
              </div>
            </div>
            
            {/* Candidate Info Card */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-blue-200/50 dark:border-gray-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                  {candidate.name ? candidate.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {candidate.name || 'Loading...'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {candidate.email || 'Loading...'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {candidate.job_title && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {candidate.job_title}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge className={`text-xs ${getStatusColor(candidate.status || 'pending')} flex items-center gap-1`}>
                    {getStatusIcon(candidate.status || 'pending')}
                    {candidate.status ? (candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)) : 'Pending'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-gray-600 transition-colors">
                    <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          <Separator className="my-6" />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Quick Actions
            </h4>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80 h-full overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientWrapper>
      <CandidateDashboardContent>
        {children}
      </CandidateDashboardContent>
    </QueryClientWrapper>
  );
}
