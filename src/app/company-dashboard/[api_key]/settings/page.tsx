"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Settings, 
  Mail, 
  FileText, 
  CheckSquare, 
  Building2, 
  Crown, 
  Sparkles,
  Plus,
  Edit,
  Trash,
  Eye,
  Share,
  Save,
  Upload,
  Palette
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useEmailTemplates, 
  useCreateEmailTemplate, 
  useUpdateEmailTemplate, 
  useDeleteEmailTemplate,
  useContractTemplates,
  useCreateContractTemplate,
  useUpdateContractTemplate,
  useDeleteContractTemplate,
  useOnboardingTaskTemplates,
  useCreateOnboardingTaskTemplate,
  useUpdateOnboardingTaskTemplate,
  useDeleteOnboardingTaskTemplate
} from "@/api/companies/company-api";
import { CompanyEmailTemplateForm } from "./components/company-email-template-form";
import { CompanyContractTemplateForm } from "./components/company-contract-template-form";
import { CompanyOnboardingTaskForm } from "./components/company-onboarding-task-form";

export default function CompanySettingsPage() {
  const params = useParams();
  const apiKey = params.api_key as string;
  
  // Get company data from localStorage to get company_id
  const [company, setCompany] = useState<any>(null);
  
  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      setCompany(JSON.parse(companyData));
    }
  }, []);

  const companyId = company?.id;
  
  const [sparkles, setSparkles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Generate sparkles only on client
    const newSparkles = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setSparkles(newSparkles);
  }, []);

  const FloatingSparkles = () => {
    if (!isClient) return null;
    
    return (
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
    );
  };

  if (!companyId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading company settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <FloatingSparkles />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Beautiful Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 flex items-center gap-2">
                  Company Settings <Crown className="w-6 h-6 text-purple-500" />
                </h1>
                <p className="text-purple-600 dark:text-purple-300 font-medium">
                  Customize your company templates and preferences with style! 💎
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                <Save className="mr-2 w-4 h-4" />
                Save All Changes ✨
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="relative z-10">
          <Tabs defaultValue="email-templates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl p-2">
              <TabsTrigger 
                value="email-templates"
                className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                Email Templates
              </TabsTrigger>
              <TabsTrigger 
                value="contract-templates"
                className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <FileText className="w-4 h-4" />
                Contract Templates
              </TabsTrigger>
              <TabsTrigger 
                value="onboarding-tasks"
                className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <CheckSquare className="w-4 h-4" />
                Onboarding Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="company-info"
                className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <Building2 className="w-4 h-4" />
                Company Info
              </TabsTrigger>
            </TabsList>

            {/* Email Templates Tab */}
            <TabsContent value="email-templates">
              <CompanyEmailTemplatesSection companyId={companyId} />
            </TabsContent>

            {/* Contract Templates Tab */}
            <TabsContent value="contract-templates">
              <CompanyContractTemplatesSection companyId={companyId} />
            </TabsContent>

            {/* Onboarding Tasks Tab */}
            <TabsContent value="onboarding-tasks">
              <CompanyOnboardingTasksSection companyId={companyId} />
            </TabsContent>

            {/* Company Info Tab */}
            <TabsContent value="company-info">
              <CompanyInfoSection company={company} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Email Templates Section Component
function CompanyEmailTemplatesSection({ companyId }: { companyId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

  const { data: templates = [], isLoading, refetch } = useEmailTemplates(companyId);
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const deleteTemplate = useDeleteEmailTemplate();

  const handleCreate = () => {
    setSelectedTemplate(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleView = (template: any) => {
    setSelectedTemplate(template);
    setFormMode('view');
    setShowForm(true);
  };

  const handleSave = async (templateData: any) => {
    try {
      if (formMode === 'create') {
        await createTemplate.mutateAsync({ companyId, templateData });
      } else {
        await updateTemplate.mutateAsync({ 
          companyId, 
          templateId: selectedTemplate.id, 
          templateData 
        });
      }
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync({ companyId, templateId });
        refetch();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  if (showForm) {
    return (
      <CompanyEmailTemplateForm
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
        mode={formMode}
      />
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
                Email Templates 📧
              </CardTitle>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                Create and manage beautiful email templates for your candidates
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 w-4 h-4" />
            New Template ✨
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading templates...</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No email templates yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first email template</p>
            <Button 
              onClick={handleCreate}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl"
            >
              <Plus className="mr-2 w-4 h-4" />
              Create First Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {templates.map((template: any) => (
              <div key={template.id} className="group bg-white/80 dark:bg-gray-700/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 dark:border-purple-500/30 hover:shadow-lg dark:hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300">
                        {template.name}
                      </h3>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                        {template.variables?.length || 0} variables
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.active 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                      }`}>
                        {template.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{template.subject}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                      {template.description && ` • ${template.description}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleView(template)}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl"
                    >
                      <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(template)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                    >
                      <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(template.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                    >
                      <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Contract Templates Section Component
function CompanyContractTemplatesSection({ companyId }: { companyId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

  const { data: templates = [], isLoading, refetch } = useContractTemplates(companyId);
  const createTemplate = useCreateContractTemplate();
  const updateTemplate = useUpdateContractTemplate();
  const deleteTemplate = useDeleteContractTemplate();

  const handleCreate = () => {
    setSelectedTemplate(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEdit = (template: any) => {
    console.log('=== Contract Templates - handleEdit ===');
    console.log('Raw template from backend:', template);
    console.log('Template type:', typeof template);
    console.log('Template keys:', template ? Object.keys(template) : 'No template');
    setSelectedTemplate(template);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleView = (template: any) => {
    setSelectedTemplate(template);
    setFormMode('view');
    setShowForm(true);
  };

  const handleTestSigning = (template: any) => {
    // Store the template data in localStorage for the signing page to use
    const templateData = {
      id: template.id,
      name: template.name,
      description: template.description,
      raw_html: template.raw_html || template.content || template.description,
      variables: template.variables || [],
      created_at: template.created_at
    };
    
    // Generate a test signing token based on the template
    const mockSigningToken = `test-template-${template.id}-${Date.now()}`;
    
    // Store template data for the signing page to access
    localStorage.setItem(`template-${mockSigningToken}`, JSON.stringify(templateData));
    
    const signingUrl = `${window.location.origin}/contracts/${mockSigningToken}/sign`;
    
    // Open the signing page in a new tab
    window.open(signingUrl, '_blank');
    
    // Log for debugging
    console.log('Test signing URL for template:', template.name, '→', signingUrl);
    console.log('Template data stored:', templateData);
    
    // Show feedback
    alert(`Test signing page opened for template: ${template.name}`);
  };

  const handleSave = async (templateData: any) => {
    try {
      if (formMode === 'create') {
        await createTemplate.mutateAsync({ companyId, templateData });
      } else {
        await updateTemplate.mutateAsync({ 
          companyId, 
          templateId: selectedTemplate.id, 
          templateData 
        });
      }
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync({ companyId, templateId });
        refetch();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  if (showForm) {
    return (
      <CompanyContractTemplateForm
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
        mode={formMode}
      />
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-700">
                Contract Templates 📄
              </CardTitle>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                Design and manage professional contract templates
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 w-4 h-4" />
            New Contract ✨
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading templates...</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No contract templates yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first contract template</p>
            <Button 
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-2xl"
            >
              <Plus className="mr-2 w-4 h-4" />
              Create First Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {templates.map((template: any) => (
              <div key={template.id} className="group bg-white/80 dark:bg-gray-700/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-100 dark:border-blue-500/30 hover:shadow-lg dark:hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-600 transition-all duration-300">
                        {template.name}
                      </h3>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                        {template.variables?.length || 0} variables
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.active 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                      }`}>
                        {template.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{template.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                      {template.hellosign_template_id && ` • HelloSign ID: ${template.hellosign_template_id}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleTestSigning(template)}
                      className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl"
                      title="Test Signing Interface"
                    >
                      <Share className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleView(template)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(template)}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl"
                    >
                      <Edit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(template.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                    >
                      <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Onboarding Tasks Section Component
function CompanyOnboardingTasksSection({ companyId }: { companyId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');

  const { data: templates = [], isLoading, refetch } = useOnboardingTaskTemplates(companyId);
  const createTemplate = useCreateOnboardingTaskTemplate();
  const updateTemplate = useUpdateOnboardingTaskTemplate();
  const deleteTemplate = useDeleteOnboardingTaskTemplate();

  const handleCreate = () => {
    setSelectedTemplate(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleView = (template: any) => {
    setSelectedTemplate(template);
    setFormMode('view');
    setShowForm(true);
  };

  const handleSave = async (templateData: any) => {
    try {
      if (formMode === 'create') {
        await createTemplate.mutateAsync({ companyId, templateData });
      } else {
        await updateTemplate.mutateAsync({ 
          companyId, 
          templateId: selectedTemplate.id, 
          templateData 
        });
      }
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync({ companyId, templateId });
        refetch();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  if (showForm) {
    return (
      <CompanyOnboardingTaskForm
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
        mode={formMode}
      />
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
                Onboarding Tasks ✅
              </CardTitle>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                Create structured onboarding workflows for new hires
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 w-4 h-4" />
            New Task Template ✨
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading templates...</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <CheckSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No onboarding task templates yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first task template</p>
            <Button 
              onClick={handleCreate}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl"
            >
              <Plus className="mr-2 w-4 h-4" />
              Create First Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {templates.map((template: any) => (
              <div key={template.id} className="group bg-white/80 dark:bg-gray-700/50 backdrop-blur-xl rounded-2xl p-6 border border-emerald-100 dark:border-emerald-500/30 hover:shadow-lg dark:hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-green-600 transition-all duration-300">
                        {template.title}
                      </h3>
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
                        {template.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.active 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                      }`}>
                        {template.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{template.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                      • Position: {template.position}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleView(template)}
                      className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl"
                    >
                      <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(template)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                    >
                      <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(template.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                    >
                      <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Company Info Section Component
function CompanyInfoSection({ company }: { company: any }) {
  return (
    <div className="grid gap-6">
      {/* Company Logo & Branding */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-700">
                Logo & Branding 🎨
              </CardTitle>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                Customize your company&apos;s visual identity
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Company Logo</h3>
              <div className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-2xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Click to upload logo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">SVG, PNG, JPG (max 2MB)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl border-2 border-white dark:border-gray-700 shadow-lg"></div>
                    <span className="text-gray-600 dark:text-gray-300">#8B5CF6</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-pink-500 rounded-xl border-2 border-white dark:border-gray-700 shadow-lg"></div>
                    <span className="text-gray-600 dark:text-gray-300">#EC4899</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
                Company Details 🏢
              </CardTitle>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                Update your company information and contact details
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-2xl border border-purple-200 dark:border-purple-600 bg-white/60 dark:bg-gray-700/60 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                  placeholder="Your Amazing Company"
                  defaultValue={company?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-2xl border border-purple-200 dark:border-purple-600 bg-white/60 dark:bg-gray-700/60 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                  placeholder="hello@company.com"
                  defaultValue={company?.email}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full p-3 rounded-2xl border border-purple-200 dark:border-purple-600 bg-white/60 dark:bg-gray-700/60 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                  placeholder="+1 (555) 123-4567"
                  defaultValue={company?.phone_number}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                <input 
                  type="url" 
                  className="w-full p-3 rounded-2xl border border-purple-200 dark:border-purple-600 bg-white/60 dark:bg-gray-700/60 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Description</label>
            <textarea 
              rows={4}
              className="w-full p-3 rounded-2xl border border-purple-200 dark:border-purple-600 bg-white/60 dark:bg-gray-700/60 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-colors resize-none"
              placeholder="Tell us about your amazing company culture and values..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}