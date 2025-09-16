"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CandidateLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with real authentication
    setTimeout(() => {
      // Mock successful login - store candidate data
      const mockCandidateData = {
        id: "ccd65e2c-b19c-4fbe-bbbe-0309a3ca10df",
        name: "Moses Ankomah",
        email: formData.email,
        api_key: "3fc4f412cd155e5bd6f86e38c5738925dcc44d39a4b98ed65a20a0342cc0025e",
        company_id: "36e1b2e2-fd8c-46b5-a867-b6d8ef1044d0",
        job_title: "Software Developer",
        status: "onboarding"
      };
      
      localStorage.setItem('candidateData', JSON.stringify(mockCandidateData));
      router.push(`/candidate-dashboard/${mockCandidateData.api_key}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-2xl">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Candidate Portal
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Access your onboarding dashboard ✨
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Access Dashboard
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
        
        <div className="relative">
          <Separator className="my-6" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white dark:bg-gray-900 px-4 text-xs text-gray-500 dark:text-gray-400">
              New candidate?
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/candidate-auth/register"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all duration-300"
          >
            Create your account
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Questions? Contact your HR department
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
