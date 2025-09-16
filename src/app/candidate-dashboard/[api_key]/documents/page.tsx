"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  File, 
  Download, 
  Eye, 
  Trash2, 
  Search,
  Image,
  FileText,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Sparkles,
  FolderOpen,
  LoaderCircle,
  ExternalLink,
  X
} from "lucide-react";
import { useCandidateByApiKey } from "@/api/candidates/candidates-api";
import { 
  useCandidateChecklists,
  useToggleChecklistCompletion,
  useUploadChecklistFile,
  downloadChecklistFile,
  CandidateChecklist
} from "@/api/candidates/candidate-checklist-api";

interface CompanyDocument {
  id: string;
  company_id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  file_url: string;
  file_size: number;
  file_type: string;
  file_extension: string;
  file_name: string;
}

export default function CandidateDocumentsPage() {
  const params = useParams();
  const apiKey = params.api_key as string;
  
  // Fetch candidate data using API key from URL
  const {
    data: candidate,
    isPending: loadingCandidate,
    isError: candidateError
  } = useCandidateByApiKey(apiKey);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});

  // Fetch candidate's personal checklist
  const {
    data: checklists = [],
    isPending: loadingChecklists,
    refetch: refetchChecklists
  } = useCandidateChecklists(candidate?.id || "");

  const toggleCompletionMutation = useToggleChecklistCompletion();
  const uploadFileMutation = useUploadChecklistFile();

  const requiredDocuments = [
    { name: 'Government ID', category: 'Identity', uploaded: true },
    { name: 'Resume/CV', category: 'Professional', uploaded: true },
    { name: 'Educational Certificates', category: 'Education', uploaded: true },
    { name: 'Bank Account Details', category: 'Financial', uploaded: true },
    { name: 'Emergency Contact Form', category: 'Personal', uploaded: false },
    { name: 'Tax Forms (W-4)', category: 'Tax', uploaded: false },
  ];

  // Get unique categories from checklists
  const categories: string[] = ['all', 'document', 'identity', 'professional', 'education', 'financial', 'personal', 'tax'];

  const getStatusColor = (completed: boolean) => {
    return completed 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusIcon = (completed: boolean) => {
    return completed 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const filteredChecklists = checklists.filter((item: CandidateChecklist) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.attachment_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (checklistId: string, file: File) => {
    setSelectedFiles(prev => ({
      ...prev,
      [checklistId]: file
    }));
  };

  const handleFileUpload = async (checklistId: string) => {
    const file = selectedFiles[checklistId];
    if (!file || !candidate?.id) return;

    try {
      console.log("Uploading file:", file.name, "for checklist:", checklistId);
      
      // Upload file using the API
      await uploadFileMutation.mutateAsync({
        candidateId: candidate.id,
        checklistId,
        file
      });
      
      console.log(`File "${file.name}" uploaded successfully!`);
      
      // Clear the selected file
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[checklistId];
        return newFiles;
      });
      
      // Refresh the checklist to show the uploaded file
      refetchChecklists();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleToggleCompletion = async (checklistId: string, currentStatus: boolean) => {
    try {
      await toggleCompletionMutation.mutateAsync({
        candidateId: candidate?.id || "",
        checklistId,
        completed: !currentStatus
      });
      refetchChecklists();
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const handleViewDocument = (checklist: CandidateChecklist) => {
    if (checklist.file_url) {
      downloadChecklistFile(candidate?.id || "", checklist.id);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Progress calculation
  const totalItems = checklists.length;
  const completedItems = checklists.filter((item: CandidateChecklist) => item.completed).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Loading state
  if (loadingCandidate || loadingChecklists) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoaderCircle className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your checklist...</p>
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
            Unable to load checklist
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
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-orange-200/50 dark:border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 flex items-center gap-2">
                My Onboarding Checklist <Sparkles className="w-8 h-8 text-orange-500" />
              </h1>
              <p className="text-orange-600 dark:text-orange-300 font-medium text-lg mt-1">
                Complete your onboarding by uploading required documents 📋
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              {progressPercentage}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {completedItems}/{totalItems} completed
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {progressPercentage}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center pt-4">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {completedItems}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {totalItems - completedItems}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Search and Filter */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search checklist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    "bg-gradient-to-r from-orange-500 to-red-600 text-white" : 
                    "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                  }
                >
                  {category === 'all' ? 'All' : category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            <FileText className="w-5 h-5 text-orange-500" />
            Your Checklist ({filteredChecklists.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChecklists
              .sort((a: CandidateChecklist, b: CandidateChecklist) => a.position - b.position)
              .map((checklist: CandidateChecklist) => (
              <div key={checklist.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(checklist.completed)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {checklist.name}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(checklist.completed)} flex items-center gap-1`}>
                          {getStatusIcon(checklist.completed)}
                          {checklist.completed ? 'Completed' : 'Pending'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          #{checklist.position}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {checklist.description}
                      </p>
                      
                      {/* File Upload Section */}
                      {!checklist.completed && (
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileSelect(checklist.id, file);
                                }}
                                className="mb-2"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                              {selectedFiles[checklist.id] && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Selected: {selectedFiles[checklist.id].name} ({Math.round(selectedFiles[checklist.id].size / 1024)} KB)
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => handleFileUpload(checklist.id)}
                              disabled={!selectedFiles[checklist.id] || uploadFileMutation.isPending}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                            >
                              {uploadFileMutation.isPending ? (
                                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              {uploadFileMutation.isPending ? 'Uploading...' : 'Upload'}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Current File Display */}
                      {checklist.file_url && (
                        <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            File uploaded: {checklist.file_name}
                            {checklist.file_size && ` (${formatFileSize(checklist.file_size)})`}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="capitalize">
                          {checklist.attachment_type.replace('_', ' ')}
                        </span>
                        <span>•</span>
                        <span>Created: {new Date(checklist.created_at).toLocaleDateString()}</span>
                        {checklist.completed_at && (
                          <>
                            <span>•</span>
                            <span>Completed: {new Date(checklist.completed_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {checklist.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(checklist)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleCompletion(checklist.id, checklist.completed)}
                      disabled={toggleCompletionMutation.isPending}
                      className={checklist.completed 
                        ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50" 
                        : "border-green-200 text-green-600 hover:bg-green-50"
                      }
                    >
                      {checklist.completed ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredChecklists.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No checklist items found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Your HR team will create checklist items for you to complete.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
