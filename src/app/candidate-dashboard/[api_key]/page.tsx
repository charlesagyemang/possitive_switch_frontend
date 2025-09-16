"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Upload,
  Star,
  Trophy,
  Target,
  Sparkles,
  LoaderCircle
} from "lucide-react";
import { useCandidateByApiKey } from "@/api/candidates/candidates-api";

interface CandidateData {
  id: string;
  name: string;
  email: string;
  api_key: string;
  company_id: string;
  job_title?: string;
  status: string;
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'pending' | 'in_progress';
  category: string;
  dueDate?: string;
  created_at: string;
  updated_at: string;
  onboarding_task_template: {
    title: string;
    description: string;
    category: string;
    company_name: string;
  };
}

export default function CandidateOverviewPage() {
  const params = useParams();
  const apiKey = params.api_key as string;
  
  // Fetch candidate data using API key from URL
  const {
    data: candidate,
    isPending: loadingCandidate,
    isError: candidateError
  } = useCandidateByApiKey(apiKey);
  
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);

  useEffect(() => {
    // Use real onboarding tasks from API
    if (candidate?.company_onboarding_tasks) {
      const realTasks = candidate.company_onboarding_tasks.map((task: any) => ({
        id: task.id,
        title: task.onboarding_task_template.title,
        description: task.onboarding_task_template.description,
        status: task.status === 'done' ? 'completed' : task.status,
        category: task.onboarding_task_template.category,
        created_at: task.created_at,
        updated_at: task.updated_at,
        onboarding_task_template: task.onboarding_task_template
      }));
      setTasks(realTasks);
    }
  }, [candidate]);

  const getProgressPercentage = () => {
    const completed = tasks.filter(task => task.status === 'done').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Loading state
  if (loadingCandidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoaderCircle className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (candidateError || !candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Unable to load dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your link or contact HR for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-blue-200/50 dark:border-purple-500/30">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {candidate.name ? candidate.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
                  Welcome, {candidate.name || 'Loading...'}! <Sparkles className="w-8 h-8 text-purple-500" />
                </h1>
              <p className="text-blue-600 dark:text-blue-300 font-medium text-lg mt-1">
                Your onboarding journey awaits ✨
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Building className="w-3 h-3 mr-1" />
                  {candidate.company?.name || 'New Fire'}
                </Badge>
                {candidate.job_title && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Star className="w-3 h-3 mr-1" />
                    {candidate.job_title}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              <Trophy className="w-5 h-5 text-blue-500" />
              Onboarding Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {getProgressPercentage()}% Complete
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center pt-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'done').length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              <User className="w-5 h-5 text-green-500" />
              Your Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {candidate.email || 'Loading...'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Company</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {candidate.company?.name || 'New Fire'}
                  </div>
                </div>
              </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">Start Date</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  September 30, 2025
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Tasks */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            <Target className="w-5 h-5 text-purple-500" />
            Your Onboarding Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-shrink-0">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {task.title}
                    </h3>
                    <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {task.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated: {new Date(task.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {task.status === 'pending' && (
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      Start Task
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      Continue
                    </Button>
                  )}
                  {task.status === 'done' && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="text-sm font-medium">View Contracts</span>
          </div>
        </Button>
        
        <Button className="h-20 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6" />
            <span className="text-sm font-medium">Upload Documents</span>
          </div>
        </Button>
        
        <Button variant="outline" className="h-20 bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex flex-col items-center gap-2">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Profile</span>
          </div>
        </Button>
        
        <Button variant="outline" className="h-20 bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex flex-col items-center gap-2">
            <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact HR</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
