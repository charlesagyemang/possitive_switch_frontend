"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, X, Eye, Code, Sparkles, Plus, Trash } from "lucide-react";

interface ContractVariable {
  name: string;
  type: "text" | "number" | "date" | "boolean";
  label: string;
  required: boolean;
}

interface ContractTemplate {
  id?: string;
  name: string;
  hellosign_template_id?: string;
  variables: ContractVariable[];
  company_email_template_id?: string;
  description?: string;
  raw_html?: string;
  active: boolean;
}

interface ContractTemplateFormProps {
  template?: ContractTemplate;
  onSave: (template: ContractTemplate) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

export function ContractTemplateForm({ template, onSave, onCancel, mode }: ContractTemplateFormProps) {
  // Add detailed logging to see what we're getting from backend
  console.log('=== ContractTemplateForm Debug ===');
  console.log('Mode:', mode);
  console.log('Raw template object:', template);
  console.log('Template type:', typeof template);
  console.log('Template keys:', template ? Object.keys(template) : 'No template');
  
  if (template) {
    console.log('Template field values:');
    console.log('- id:', template.id, typeof template.id);
    console.log('- name:', template.name, typeof template.name);
    console.log('- hellosign_template_id:', template.hellosign_template_id, typeof template.hellosign_template_id);
    console.log('- company_email_template_id:', template.company_email_template_id, typeof template.company_email_template_id);
    console.log('- description:', template.description, typeof template.description);
    console.log('- raw_html:', template.raw_html, typeof template.raw_html);
    console.log('- active:', template.active, typeof template.active);
    console.log('- variables:', template.variables, typeof template.variables);
    if (template.variables) {
      template.variables.forEach((variable, index) => {
        console.log(`  Variable ${index}:`, variable);
        console.log(`    - name:`, variable.name, typeof variable.name);
        console.log(`    - type:`, variable.type, typeof variable.type);
        console.log(`    - label:`, (variable as any).label, typeof (variable as any).label);
        console.log(`    - required:`, (variable as any).required, typeof (variable as any).required);
      });
    }
  }

  // Map backend API structure to form structure
  const mapBackendToForm = (template: any) => {
    if (!template) return {
      name: "",
      hellosign_template_id: "",
      variables: [
        { name: "CANDIDATE_NAME", type: "STRING", label: "Candidate Name", required: true },
        { name: "CONTRACT_DATE", type: "DATE", label: "Contract Date", required: true },
        { name: "SALARY", type: "STRING", label: "Salary", required: true }
      ],
      company_email_template_id: "",
      description: "",
      raw_html: "",
      active: true,
    };

    return {
      name: template.name ?? "",
      hellosign_template_id: template.hellosign_template_id ?? "",
      variables: (template.variables || []).map((v: any) => ({
        name: v.name ?? "",
        type: v.type ?? "text",
        label: v.label ?? v.name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) ?? "",
        required: v.required ?? true
      })),
      company_email_template_id: template.company_email_template_id ?? template.email_template_id ?? "",
      description: template.description ?? "",
      raw_html: template.raw_html ?? "",
      active: template.active ?? true,
    };
  };

  const [formData, setFormData] = useState<ContractTemplate>(mapBackendToForm(template));

  // Log the initial form data
  console.log('ContractTemplateForm - Initial formData:', formData);

  const [isPreview, setIsPreview] = useState(false);

  // Function to extract variables from contract content
  const extractVariablesFromContent = (content: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...content.matchAll(variableRegex)];
    const uniqueVariables = [...new Set(matches.map(match => match[1].trim()))];
    
    return uniqueVariables.map(varName => {
      // Check if this variable already exists in our current variables
      const existingVar = formData.variables.find(v => v.name === varName);
      if (existingVar) {
        return existingVar; // Keep existing variable with its settings
      }
      
      // Create new variable with smart defaults
      return {
        name: varName,
        type: "text" as const,
        label: varName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        required: true
      };
    });
  };

  // Function to sync variables when content changes
  const handleContentChange = (newContent: string) => {
    const extractedVariables = extractVariablesFromContent(newContent);
    
    setFormData(prev => ({
      ...prev,
      raw_html: newContent,
      variables: extractedVariables
    }));
  };

  const contractTypes = [
    { value: "employment", label: "Employment Contract 💼" },
    { value: "nda", label: "Non-Disclosure Agreement 🔒" },
    { value: "offer", label: "Offer Letter 📧" },
    { value: "contractor", label: "Independent Contractor 🔧" },
    { value: "internship", label: "Internship Agreement 📚" },
    { value: "custom", label: "Custom Contract ✨" }
  ];

  const variableTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Yes/No" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addVariable = () => {
    setFormData({
      ...formData,
      variables: [
        ...formData.variables,
        { name: "", type: "text", label: "", required: false }
      ]
    });
  };

  const removeVariable = (index: number) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((_, i) => i !== index)
    });
  };

  const updateVariable = (index: number, field: keyof ContractVariable, value: any) => {
    const updatedVariables = [...formData.variables];
    updatedVariables[index] = { ...updatedVariables[index], [field]: value };
    setFormData({ ...formData, variables: updatedVariables });
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-700">
              {mode === 'create' ? 'Create' : mode === 'edit' ? 'Edit' : 'View'} Contract Template
            </h2>
            <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
              Design professional contract templates with dynamic variables
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="bg-white/60 dark:bg-gray-700/60 border-blue-200 dark:border-blue-600/30"
          >
            {isPreview ? <Code className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Editor' : 'Preview'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-blue-500/25 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-teal-500/20 border-b border-blue-100 dark:border-blue-500/30">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Contract Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contract Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Employment Contract Template"
                      className="rounded-2xl border-blue-200 dark:border-blue-600/30 focus:border-blue-400"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      HelloSign Template ID
                    </label>
                    <Input
                      value={formData.hellosign_template_id}
                      onChange={(e) => setFormData({...formData, hellosign_template_id: e.target.value})}
                      placeholder="template_456"
                      className="rounded-2xl border-blue-200 dark:border-blue-600/30 focus:border-blue-400"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Template ID
                    </label>
                    <Input
                      value={formData.company_email_template_id}
                      onChange={(e) => setFormData({...formData, company_email_template_id: e.target.value})}
                      placeholder="email_template_uuid"
                      className="rounded-2xl border-blue-200 dark:border-blue-600/30 focus:border-blue-400"
                      disabled={isReadOnly}
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
                      <SelectTrigger className="rounded-2xl border-blue-200 dark:border-blue-600/30 focus:border-blue-400">
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
                    placeholder="Brief description of this contract template..."
                    className="rounded-2xl border-blue-200 dark:border-blue-600/30 focus:border-blue-400 resize-none h-20"
                    disabled={isReadOnly}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contract Content */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-blue-500/25 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-teal-500/20 border-b border-blue-100 dark:border-blue-500/30">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Contract Content
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isPreview ? (
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[400px] overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        📄 {formData.name || "Contract Template"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        PDF-style Preview - Scroll to see full contract
                      </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 p-6 max-h-[600px] overflow-auto">
                      <div className="bg-white rounded-lg shadow-lg mx-auto max-w-4xl">
                        <div 
                          className="contract-preview-container p-12 font-serif text-gray-900 leading-relaxed"
                          style={{ 
                            fontFamily: "'Times New Roman', Times, serif",
                            fontSize: '14px',
                            lineHeight: '1.6',
                            minHeight: '11in'
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: formData.raw_html || `
                              <div style="text-align: center; color: #64748b; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
                                <h2 style="color: #374151; margin-bottom: 10px;">Contract Preview</h2>
                                <p>Your contract template content will appear here...</p>
                                <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">Use the contract content field to write your contract with {{variable_name}} placeholders</p>
                              </div>
                            `
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={formData.raw_html}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Enter your contract content here with HTML formatting... Use {{VARIABLE_NAME}} for dynamic content"
                    className="rounded-2xl border-blue-200 dark:border-blue-600/30 focus:border-blue-400 min-h-[400px] resize-none font-mono text-sm"
                    disabled={isReadOnly}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Variables Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-blue-500/25 rounded-3xl overflow-hidden sticky top-6">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 border-b border-emerald-100 dark:border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    Variables ({formData.variables.length})
                  </CardTitle>
                  {!isReadOnly && (
                    <Button
                      type="button"
                      onClick={addVariable}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  ✨ Variables auto-detected from content
                </p>
              </CardHeader>
              <CardContent className="p-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {formData.variables.map((variable, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Variable {index + 1}
                          </span>
                          {formData.raw_html?.includes(`{{${variable.name}}}`) && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                              ✨ Auto
                            </span>
                          )}
                        </div>
                        {!isReadOnly && formData.variables.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeVariable(index)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          value={variable.name ?? ""}
                          onChange={(e) => updateVariable(index, 'name', e.target.value)}
                          placeholder="variable_name"
                          className="text-xs h-8 rounded-xl"
                          disabled={isReadOnly}
                        />
                        <Input
                          value={variable.label ?? ""}
                          onChange={(e) => updateVariable(index, 'label', e.target.value)}
                          placeholder="Display Label"
                          className="text-xs h-8 rounded-xl"
                          disabled={isReadOnly}
                        />
                        <Select
                          value={variable.type ?? "text"}
                          onValueChange={(value) => updateVariable(index, 'type', value as any)}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger className="text-xs h-8 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {variableTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={variable.required ?? true}
                            onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                            className="rounded"
                            disabled={isReadOnly}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-300">Required</span>
                        </div>
                        
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                          {`{{${variable.name || 'variable_name'}}}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm">💡 How it works</h4>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <p>• Type {`{{VARIABLE_NAME}}`} in your contract content</p>
                    <p>• Variables are automatically detected and added here</p>
                    <p>• Customize labels and types for each variable</p>
                    <p>• Variables are replaced with actual values when generating contracts</p>
                  </div>
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
              className="bg-gradient-to-r from-blue-500 via-cyan-600 to-teal-600 hover:from-blue-600 hover:via-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Create Contract' : 'Save Changes'} ✨
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
