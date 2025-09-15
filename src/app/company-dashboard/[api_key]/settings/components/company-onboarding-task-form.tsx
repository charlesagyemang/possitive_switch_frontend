"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Save, X } from "lucide-react";

interface OnboardingTaskTemplate {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  position?: number;
  active: boolean;
}

interface CompanyOnboardingTaskFormProps {
  template?: OnboardingTaskTemplate;
  onSave: (template: OnboardingTaskTemplate) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

export function CompanyOnboardingTaskForm({ template, onSave, onCancel, mode }: CompanyOnboardingTaskFormProps) {
  const [formData, setFormData] = useState<OnboardingTaskTemplate>({
    title: template?.title || "",
    description: template?.description || "",
    category: template?.category || "IT",
    position: template?.position || 1,
    active: template?.active ?? true,
    ...template
  });

  const categories = [
    { value: "IT", label: "IT Setup 💻" },
    { value: "HR", label: "HR Documentation 📄" },
    { value: "Training", label: "Training 📚" },
    { value: "Compliance", label: "Compliance ⚖️" },
    { value: "Social", label: "Team Integration 👥" },
    { value: "Workspace", label: "Workspace Setup 🏢" },
    { value: "Custom", label: "Custom ✨" }
  ];


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };


  const isReadOnly = mode === 'view';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
              {mode === 'create' ? 'Create' : mode === 'edit' ? 'Edit' : 'View'} Onboarding Task Template
            </h2>
            <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
              Design structured onboarding workflows for new hires
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-700 dark:text-blue-300">
              Position: {formData.position}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">
              {formData.active ? '✅ Active' : '⚪ Inactive'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-emerald-500/25 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:via-green-500/20 dark:to-teal-500/20 border-b border-emerald-100 dark:border-emerald-500/30">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Task Template Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Complete IT setup"
                      className="rounded-2xl border-emerald-200 dark:border-emerald-600/30 focus:border-emerald-400"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({...formData, category: value})}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="rounded-2xl border-emerald-200 dark:border-emerald-600/30 focus:border-emerald-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    <Input
                      type="number"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: parseInt(e.target.value) || 1})}
                      placeholder="1"
                      className="rounded-2xl border-emerald-200 dark:border-emerald-600/30 focus:border-emerald-400"
                      disabled={isReadOnly}
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Active Status
                    </label>
                    <Select 
                      value={formData.active ? "true" : "false"} 
                      onValueChange={(value) => setFormData({...formData, active: value === "true"})}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="rounded-2xl border-emerald-200 dark:border-emerald-600/30 focus:border-emerald-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="true">🟢 Active</SelectItem>
                        <SelectItem value="false">⚪ Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of this onboarding task template..."
                className="rounded-2xl border-emerald-200 dark:border-emerald-600/30 focus:border-emerald-400 resize-none h-20"
                disabled={isReadOnly}
              />
            </div>
          </CardContent>
        </Card>


        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="bg-white/60 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600/30 hover:bg-gray-100 dark:hover:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-2xl px-6"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 text-white font-bold rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Create Template' : 'Save Changes'} ✨
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
