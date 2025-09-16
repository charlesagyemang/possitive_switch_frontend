"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Upload, 
  Search,
  X,
  Save,
  AlertCircle,
  Sparkles,
  Eye,
  File,
  Image,
  FileSpreadsheet,
  ExternalLink,
  Maximize2,
  Play
} from "lucide-react";
import useModal from "@/components/built/modal/useModal";
import { 
  useCandidateChecklists,
  useCreateCandidateChecklist,
  useUpdateCandidateChecklist,
  useDeleteCandidateChecklist,
  useToggleChecklistCompletion,
  downloadChecklistFile,
  CandidateChecklist,
  CreateChecklistData,
  UpdateChecklistData
} from "@/api/candidates/candidate-checklist-api";
import { useQueryClient } from "@tanstack/react-query";

interface CandidateChecklistTabProps {
  candidateId: string;
  candidateName?: string;
}

export default function CandidateChecklistTab({ candidateId, candidateName }: CandidateChecklistTabProps) {
  const { open, close, ModalPortal } = useModal();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "uploaded">("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewingMedia, setViewingMedia] = useState<{url: string, name: string, type: string} | null>(null);

  // API Hooks
  const {
    data: checklists = [],
    isPending: loadingChecklists,
    refetch: refetchChecklists
  } = useCandidateChecklists(candidateId);

  const createChecklistMutation = useCreateCandidateChecklist();
  const updateChecklistMutation = useUpdateCandidateChecklist();
  const deleteChecklistMutation = useDeleteCandidateChecklist();
  const toggleCompletionMutation = useToggleChecklistCompletion();

  // Filter and search checklists
  const filteredChecklists = checklists.filter((checklist: CandidateChecklist) => {
    const matchesSearch = checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && checklist.completed) ||
                         (filterStatus === "pending" && !checklist.completed) ||
                         (filterStatus === "uploaded" && checklist.file_url);
    
    return matchesSearch && matchesStatus;
  });

  // Progress calculation
  const totalItems = checklists.length;
  const completedItems = checklists.filter((item: CandidateChecklist) => item.completed).length;
  const uploadedItems = checklists.filter((item: CandidateChecklist) => item.file_url).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Form Components
  const CreateChecklistForm = () => {
    const [formData, setFormData] = useState<CreateChecklistData>({
      name: "",
      description: "",
      attachment_type: "document",
      position: totalItems + 1,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        await createChecklistMutation.mutateAsync({ candidateId, data: formData });
        queryClient.invalidateQueries({ queryKey: ["candidate-checklists", candidateId] });
        close();
      } catch (error) {
        console.error("Error creating checklist:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Checklist Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Upload ID Document"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what the candidate needs to do..."
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="attachment_type">Document Type</Label>
          <Select value={formData.attachment_type} onValueChange={(value) => setFormData({ ...formData, attachment_type: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">General Document</SelectItem>
              <SelectItem value="id_document">ID Document</SelectItem>
              <SelectItem value="tax_document">Tax Document</SelectItem>
              <SelectItem value="education_document">Education Certificate</SelectItem>
              <SelectItem value="employment_document">Employment Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="position">Position (Order)</Label>
          <Input
            id="position"
            type="number"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
            min="1"
            className="mt-1"
          />
        </div>


        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createChecklistMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {createChecklistMutation.isPending ? (
              <>Creating...</>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Checklist
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  const EditChecklistForm = ({ checklist }: { checklist: CandidateChecklist }) => {
    const [formData, setFormData] = useState<UpdateChecklistData>({
      name: checklist.name,
      description: checklist.description,
      attachment_type: checklist.attachment_type,
      position: checklist.position,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        await updateChecklistMutation.mutateAsync({ 
          candidateId, 
          checklistId: checklist.id, 
          data: formData 
        });
        queryClient.invalidateQueries({ queryKey: ["candidate-checklists", candidateId] });
        close();
      } catch (error) {
        console.error("Error updating checklist:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="edit-name">Checklist Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="edit-attachment_type">Document Type</Label>
          <Select value={formData.attachment_type} onValueChange={(value) => setFormData({ ...formData, attachment_type: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">General Document</SelectItem>
              <SelectItem value="id_document">ID Document</SelectItem>
              <SelectItem value="tax_document">Tax Document</SelectItem>
              <SelectItem value="education_document">Education Certificate</SelectItem>
              <SelectItem value="employment_document">Employment Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="edit-position">Position (Order)</Label>
          <Input
            id="edit-position"
            type="number"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
            min="1"
            className="mt-1"
          />
        </div>

        {checklist.file_url && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Current file: {checklist.file_name}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openMediaViewer(checklist.file_url!, checklist.file_name || 'Unknown', checklist.file_type || 'application/octet-stream')}
                className="text-blue-600 border-blue-200"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadChecklistFile(checklist.file_url!, checklist.file_name)}
                className="text-green-600 border-green-200"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Note: File uploads are managed on the candidate dashboard
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateChecklistMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
          >
            {updateChecklistMutation.isPending ? (
              <>Updating...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Checklist
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  // Event Handlers
  const handleCreateChecklist = () => {
    open(<CreateChecklistForm />, "Create New Checklist Item");
  };

  const handleEditChecklist = (checklist: CandidateChecklist) => {
    open(<EditChecklistForm checklist={checklist} />, `Edit: ${checklist.name}`);
  };

  const handleDeleteChecklist = async (checklistId: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteChecklistMutation.mutateAsync({ candidateId, checklistId });
        queryClient.invalidateQueries({ queryKey: ["candidate-checklists", candidateId] });
      } catch (error) {
        console.error("Error deleting checklist:", error);
      }
    }
  };

  const handleToggleCompletion = async (checklistId: string, currentStatus: boolean) => {
    try {
      await toggleCompletionMutation.mutateAsync({ 
        candidateId, 
        checklistId, 
        completed: !currentStatus 
      });
      queryClient.invalidateQueries({ queryKey: ["candidate-checklists", candidateId] });
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-500" />
    );
  };

  const getStatusBadge = (completed: boolean) => {
    return completed ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="w-5 h-5 text-gray-500" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const openMediaViewer = (fileUrl: string, fileName: string, fileType: string) => {
    setViewingMedia({ url: fileUrl, name: fileName, type: fileType });
  };

  const closeMediaViewer = () => {
    setViewingMedia(null);
  };

  const MediaViewer = () => {
    if (!viewingMedia) return null;

    const { url, name, type } = viewingMedia;
    const isImage = type.startsWith('image/');
    const isPdf = type === 'application/pdf';
    const isVideo = type.startsWith('video/');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {getFileIcon(type)}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChecklistFile(url, name)}
                className="text-blue-600 border-blue-200"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open External
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={closeMediaViewer}
                className="text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
            {isImage && (
              <img 
                src={url} 
                alt={name || "Uploaded document"} 
                className="max-w-full max-h-full object-contain mx-auto rounded-lg"
              />
            )}
            
            {isPdf && (
              <iframe 
                src={url} 
                className="w-full h-[70vh] border-0 rounded-lg"
                title={name}
              />
            )}
            
            {isVideo && (
              <video 
                controls 
                className="max-w-full max-h-full mx-auto rounded-lg"
                src={url}
              >
                Your browser does not support the video tag.
              </video>
            )}
            
            {!isImage && !isPdf && !isVideo && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getFileIcon(type)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Preview not available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This file type cannot be previewed inline.
                </p>
                <Button
                  onClick={() => downloadChecklistFile(url, name)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loadingChecklists) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModalPortal />
      <MediaViewer />
      
      {/* Header with Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-500" />
                Candidate Checklist
                <Sparkles className="w-6 h-6 text-purple-500" />
              </h2>
              <p className="text-blue-600 dark:text-blue-300 mt-1">
                {candidateName ? `Creating checklist items for ${candidateName}` : "Create onboarding checklist items"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Files will be uploaded by the candidate on their dashboard
              </p>
            </div>
            <Button
              onClick={handleCreateChecklist}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Checklist Item
            </Button>
          </div>
          
          {/* Progress Bar and Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalItems}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Items</div>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{uploadedItems}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Documents Uploaded</div>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedItems}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Completion Progress</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {completedItems}/{totalItems} ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search checklist items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: "all" | "completed" | "pending" | "uploaded") => setFilterStatus(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="uploaded">With Documents</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredChecklists.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No checklist items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Create checklist items that the candidate will complete during onboarding. Files will be uploaded by the candidate."
                }
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button
                  onClick={handleCreateChecklist}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredChecklists
            .sort((a: CandidateChecklist, b: CandidateChecklist) => a.position - b.position)
            .map((checklist: CandidateChecklist) => (
              <Card key={checklist.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
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
                          {getStatusBadge(checklist.completed)}
                          <Badge variant="outline" className="text-xs">
                            #{checklist.position}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {checklist.description}
                        </p>
                        
                        {/* Uploaded File Display - More Prominent */}
                        {checklist.file_url && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="flex items-center gap-3 mb-2">
                              {getFileIcon(checklist.file_type)}
                              <div className="flex-1">
                                <p className="font-medium text-green-800 dark:text-green-200">
                                  📎 Document Uploaded
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {checklist.file_name}
                                  {checklist.file_size && ` • ${formatFileSize(checklist.file_size)}`}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openMediaViewer(checklist.file_url!, checklist.file_name || 'Unknown', checklist.file_type || 'application/octet-stream')}
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadChecklistFile(checklist.file_url!, checklist.file_name)}
                                  className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
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
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditChecklist(checklist)}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteChecklist(checklist.id, checklist.name)}
                        disabled={deleteChecklistMutation.isPending}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
