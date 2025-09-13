"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Save, X, Eye, Code, Sparkles } from "lucide-react";

// CSS to isolate email preview styles
const emailPreviewStyles = `
  .email-preview-container * {
    box-sizing: border-box;
  }
  
  .email-preview-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
    line-height: 1.5 !important;
    color: #374151 !important;
  }
  
  .email-preview-container img {
    max-width: 100% !important;
    height: auto !important;
  }
  
  .email-preview-container table {
    border-collapse: collapse !important;
    width: 100% !important;
  }
`;

interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  variables: Array<{name: string, type: string}>;
  description?: string;
  active: boolean;
  raw_html: string;
}

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

export function EmailTemplateForm({ template, onSave, onCancel, mode }: EmailTemplateFormProps) {
  const [formData, setFormData] = useState<EmailTemplate>({
    name: template?.name || "",
    subject: template?.subject || "",
    variables: template?.variables || [
      {name: "employee_name", type: "STRING"},
      {name: "company_name", type: "STRING"}
    ],
    description: template?.description || "",
    active: template?.active ?? true,
    raw_html: template?.raw_html || "",
    ...template
  });

  const [isPreview, setIsPreview] = useState(false);

  // Extract variables from the HTML content dynamically
  const extractVariablesFromHTML = (html: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches: Array<{name: string, type: string}> = [];
    let match;
    
    while ((match = variableRegex.exec(html)) !== null) {
      const variableName = match[1].trim();
      if (!matches.find(v => v.name === variableName)) {
        matches.push({
          name: variableName,
          type: "STRING"
        });
      }
    }
    
    return matches;
  };

  const availableVariables = extractVariablesFromHTML(formData.raw_html || "");

  // Update the form data variables whenever HTML changes (but not on initial load for edit mode)
  React.useEffect(() => {
    // Only auto-update variables if we're not in edit mode with existing variables
    // or if the HTML content has actually changed from the initial state
    if (mode !== 'edit' || !template?.variables?.length) {
      const detectedVariables = extractVariablesFromHTML(formData.raw_html || "");
      setFormData(prev => ({
        ...prev,
        variables: detectedVariables
      }));
    }
  }, [formData.raw_html, mode, template?.variables?.length]);

  // Handle manual re-sync of variables (useful for edit mode)
  const resyncVariables = () => {
    const detectedVariables = extractVariablesFromHTML(formData.raw_html || "");
    setFormData(prev => ({
      ...prev,
      variables: detectedVariables
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure variables are properly formatted and included
    const templateData = {
      ...formData,
      variables: formData.variables || extractVariablesFromHTML(formData.raw_html || "")
    };
    
    console.log(`
🚀 ====== EMAIL TEMPLATE ${mode.toUpperCase()} REQUEST ======
📋 Mode: ${mode}
📝 Template ID: ${formData.id || 'NEW'}
📄 Data being sent:
`, JSON.stringify(templateData, null, 2));
    
    console.log(`
📊 Variables Summary:
- Total variables: ${templateData.variables?.length || 0}
- Variables list: ${templateData.variables?.map(v => v.name).join(', ') || 'None'}
- Raw HTML length: ${templateData.raw_html?.length || 0} characters
🚀 ===============================================
    `);
    
    onSave(templateData);
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Inject email preview styles */}
      <style dangerouslySetInnerHTML={{ __html: emailPreviewStyles }} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              {mode === 'create' ? 'Create' : mode === 'edit' ? 'Edit' : 'View'} Email Template
            </h2>
            <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
              Design beautiful email templates for your candidates
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30"
          >
            {isPreview ? <Code className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Editor' : 'Preview'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Template Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Template Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Welcome Email Template"
                      className="rounded-2xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Active Status
                    </label>
                    <Select 
                      value={formData.active ? "true" : "false"} 
                      onValueChange={(value) => setFormData({...formData, active: value === "true"})}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="rounded-2xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400">
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
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of this template..."
                    className="rounded-2xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400"
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Subject *
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Welcome to {{company_name}}! 🎉"
                    className="rounded-2xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400"
                    disabled={isReadOnly}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Content */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-purple-100 dark:border-purple-500/30">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Email Content
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isPreview ? (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[300px] overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        📧 {formData.subject || "Email Subject"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Live Preview - Scroll to see full email
                      </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 p-6 max-h-[600px] overflow-auto">
                      <div 
                        className="email-preview-container bg-white rounded-lg shadow-lg mx-auto"
                        style={{ maxWidth: '100%' }}
                        dangerouslySetInnerHTML={{ 
                          __html: formData.raw_html || `
                            <div style="text-align: center; color: #64748b; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              <div style="font-size: 48px; margin-bottom: 20px;">📧</div>
                              <h2 style="color: #374151; margin-bottom: 10px;">Email Preview</h2>
                              <p>Your email content will appear here when you paste the HTML template...</p>
                            </div>
                          `
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={formData.raw_html}
                    onChange={(e) => setFormData({...formData, raw_html: e.target.value})}
                    placeholder="<html><body><h1>Welcome to {{company_name}}!</h1><p>Dear {{employee_name}},</p><p>We're excited to have you join our team...</p></body></html>"
                    className="rounded-2xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400 min-h-[300px] resize-none font-mono text-sm"
                    disabled={isReadOnly}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Variables Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden sticky top-6">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 border-b border-emerald-100 dark:border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    Template Variables
                  </CardTitle>
                  {mode === 'edit' && !isReadOnly && (
                    <Button
                      type="button"
                      onClick={resyncVariables}
                      size="sm"
                      variant="outline"
                      className="text-xs bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700"
                    >
                      🔄 Re-sync
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {availableVariables.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      📋 Variables found in your template:
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      Form Data Variables: {formData.variables?.length || 0} | 
                      Detected: {availableVariables.length}
                    </div>
                    <div className="space-y-2">
                      {availableVariables.map((variable) => (
                        <div
                          key={variable.name}
                          className="w-full text-left p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30"
                        >
                          <div className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                            {`{{${variable.name}}}`}
                          </div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                            {variable.type} • Auto-detected
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No variables detected in your template.
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                      Add variables using {`{{variable_name}}`} format
                    </p>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Variables will be automatically replaced with actual values when emails are sent to candidates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
