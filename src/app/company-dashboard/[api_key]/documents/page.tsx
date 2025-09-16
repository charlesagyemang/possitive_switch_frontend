"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Plus, 
  Search, 
  Filter,
  Download,
  Trash2,
  Eye,
  Image,
  Video,
  Music,
  File,
  FileSpreadsheet,
  Presentation
} from "lucide-react";
import { useCompanyDocuments, useCreateCompanyDocument, useDeleteCompanyDocument } from "@/api/companies/company-api";
import { CompanyDocument } from "@/app/types";
import { Company } from "@/app/seed/companies";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import MediaViewer from "@/components/built/media-viewer/media-viewer";

export default function CompanyDocumentsPage() {
  const params = useParams();
  const apiKey = params.api_key as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    category: "hr_documents",
    file: null as File | null
  });

  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      const parsedCompany = JSON.parse(companyData);
      setCompany(parsedCompany);
      console.log('Company data loaded:', parsedCompany);
      console.log('Using company ID:', parsedCompany.id);
    }
  }, []);

  // Fetch company documents using the actual company ID
  const { data: documents = [], isLoading } = useCompanyDocuments(company?.id || "") as { data: CompanyDocument[], isLoading: boolean };
  const { run: createDocument, isPending: isCreating } = useCreateCompanyDocument();
  const { run: deleteDocument, isPending: isDeleting } = useDeleteCompanyDocument();

  const categories = [
    { value: "hr_documents", label: "HR Documents 📄" },
    { value: "policies", label: "Policies 📋" },
    { value: "procedures", label: "Procedures 📝" },
    { value: "forms", label: "Forms 📋" },
    { value: "templates", label: "Templates 📄" },
    { value: "legal", label: "Legal Documents ⚖️" },
    { value: "training", label: "Training Materials 📚" },
    { value: "images", label: "Images 🖼️" },
    { value: "videos", label: "Videos 🎥" },
    { value: "audio", label: "Audio 🎵" },
    { value: "presentations", label: "Presentations 📊" },
    { value: "spreadsheets", label: "Spreadsheets 📈" },
    { value: "other", label: "Other 📁" }
  ];

  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === "" || 
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({ ...prev, file }));
  };

  // Function to get file type icon and colors
  const getFileTypeInfo = (fileType: string) => {
    const type = fileType.toLowerCase();
    
    if (type.startsWith('image/')) {
      return { 
        icon: Image, 
        color: 'from-green-400 to-emerald-500',
        label: 'Image'
      };
    } else if (type.startsWith('video/')) {
      return { 
        icon: Video, 
        color: 'from-red-400 to-pink-500',
        label: 'Video'
      };
    } else if (type.startsWith('audio/')) {
      return { 
        icon: Music, 
        color: 'from-purple-400 to-violet-500',
        label: 'Audio'
      };
    } else if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return { 
        icon: FileSpreadsheet, 
        color: 'from-green-400 to-teal-500',
        label: 'Spreadsheet'
      };
    } else if (type.includes('presentation') || type.includes('powerpoint')) {
      return { 
        icon: Presentation, 
        color: 'from-orange-400 to-red-500',
        label: 'Presentation'
      };
    } else if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return { 
        icon: FileText, 
        color: 'from-blue-400 to-purple-500',
        label: 'Document'
      };
    } else {
      return { 
        icon: File, 
        color: 'from-gray-400 to-gray-500',
        label: 'File'
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.name.trim()) {
      AppNotifications.Error({ message: "Please provide a name and select a file." });
      return;
    }

    const formData = new FormData();
    formData.append('name', uploadForm.name);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('file', uploadForm.file);

    createDocument(
      { companyId: company?.id || "", formData },
      {
        onSuccess: () => {
          setShowUploadModal(false);
          setUploadForm({ name: "", description: "", category: "hr_documents", file: null });
          AppNotifications.Success({ message: "Document uploaded successfully! ✨" });
        },
        onError: () => {
          AppNotifications.Error({ message: "Failed to upload document. Please try again." });
        }
      }
    );
  };

  const handleDelete = (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocument(
        { companyId: company?.id || "", documentId },
        {
          onSuccess: () => {
            AppNotifications.Success({ message: "Document deleted successfully! ✨" });
          },
          onError: () => {
            AppNotifications.Error({ message: "Failed to delete document. Please try again." });
          }
        }
      );
    }
  };

  const handleViewDocument = (index: number) => {
    setMediaViewerIndex(index);
    setShowMediaViewer(true);
  };

  // Helper functions for file type detection
  const isImage = (fileType: string) => fileType.startsWith('image/');
  const isVideo = (fileType: string) => fileType.startsWith('video/');
  const isAudio = (fileType: string) => fileType.startsWith('audio/');
  const isPDF = (fileType: string) => fileType === 'application/pdf';

  // Show loading state while company data is being fetched
  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 dark:text-purple-300 font-medium">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
                Company Documents 📄
              </h1>
              <p className="text-purple-600 dark:text-purple-300 font-medium">
                Manage your company documents and files
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-purple-500" />
                <Input
                  placeholder="Search documents by name or description... ✨"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-10 placeholder:text-purple-400 dark:placeholder:text-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 bg-white/60 dark:bg-gray-700/60 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400 rounded-2xl h-10">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600/30 rounded-2xl">
                    <SelectItem value="all">All Categories ✨</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CustomButton
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </CustomButton>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No documents found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchTerm || categoryFilter !== "all" 
                      ? "Try adjusting your search or filter criteria."
                      : "Upload your first document to get started."
                    }
                  </p>
                  {(!searchTerm && categoryFilter === "all") && (
                    <CustomButton
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload First Document
                    </CustomButton>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredDocuments.map((document, index) => {
              const categoryInfo = categories.find(cat => cat.value === document.category);
              const fileTypeInfo = getFileTypeInfo(document.file_type);
              const FileIcon = fileTypeInfo.icon;
              
              return (
                <Card key={document.id} className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-purple-200 dark:border-purple-700/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${fileTypeInfo.color} rounded-xl flex items-center justify-center`}>
                        <FileIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <CustomTooltip tip="👁️ View/Play this file">
                          <div
                            onClick={() => handleViewDocument(index)}
                            className="w-8 h-8 p-0 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200 border border-blue-200 dark:border-blue-700/30 rounded-md flex items-center justify-center cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </CustomTooltip>
                        <CustomTooltip tip="📥 Download file">
                          <div
                            className="w-8 h-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-110 transition-all duration-200 rounded-md flex items-center justify-center cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-green-500" />
                          </div>
                        </CustomTooltip>
                        <CustomTooltip tip="🗑️ Delete file">
                          <div
                            onClick={() => handleDelete(document.id)}
                            className={`w-8 h-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-110 transition-all duration-200 rounded-md flex items-center justify-center cursor-pointer ${
                              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </div>
                        </CustomTooltip>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300 mb-2">
                      {document.name}
                    </h3>
                    
                    {document.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {document.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                        {categoryInfo?.label || document.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(document.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-medium">
                        {fileTypeInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'}
                      </span>
                    </div>
                    
                    {/* View Button */}
                    <CustomButton
                      onClick={() => handleViewDocument(index)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {isImage(document.file_type) ? 'View Image' : isVideo(document.file_type) ? 'Play Video' : isAudio(document.file_type) ? 'Play Audio' : isPDF(document.file_type) ? 'View PDF' : 'View File'}
                    </CustomButton>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl w-full max-w-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document Name *
                    </label>
                    <Input
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Employee Handbook"
                      className="rounded-xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the document..."
                      className="rounded-xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="rounded-xl border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600/30 rounded-xl">
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
                      File *
                    </label>
                    <div className="border-2 border-dashed border-purple-200 dark:border-purple-600/30 rounded-xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept="*/*"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {uploadForm.file ? uploadForm.file.name : "Click to select file"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          All file types supported: Images, Videos, Audio, Documents, Spreadsheets, Presentations, and more
                        </p>
                      </label>
                    </div>
                    
                    {/* File Preview */}
                    {uploadForm.file && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600/30">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const fileTypeInfo = getFileTypeInfo(uploadForm.file.type);
                            const FileIcon = fileTypeInfo.icon;
                            return (
                              <div className={`w-10 h-10 bg-gradient-to-r ${fileTypeInfo.color} rounded-lg flex items-center justify-center`}>
                                <FileIcon className="w-5 h-5 text-white" />
                              </div>
                            );
                          })()}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {uploadForm.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {uploadForm.file.type} • {(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 rounded-xl border-purple-200 dark:border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                    >
                      Cancel
                    </Button>
                    <CustomButton
                      type="submit"
                      disabled={isCreating || !uploadForm.file || !uploadForm.name.trim()}
                      loading={isCreating}
                      className="flex-1 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                    >
                      Upload Document
                    </CustomButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Media Viewer */}
      <MediaViewer
        isOpen={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        documents={filteredDocuments}
        currentIndex={mediaViewerIndex}
        onIndexChange={setMediaViewerIndex}
      />
    </div>
  );
}
