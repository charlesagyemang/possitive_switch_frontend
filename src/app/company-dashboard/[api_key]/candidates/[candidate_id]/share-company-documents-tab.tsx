"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Share2, 
  X, 
  Download,
  Eye,
  File,
  FileSpreadsheet,
  Image,
  Video,
  Music,
  Presentation,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Star,
  Heart,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import { 
  useCompanyDocuments, 
  useCreateCompanyDocument 
} from "@/api/companies/company-api";
import { 
  useCandidateSharedDocuments,
  useShareDocumentWithCandidate,
  useRemoveDocumentShare
} from "@/api/candidates/candidates-api";
import { useQueryClient } from "@tanstack/react-query";
import { CompanyDocument } from "@/app/types";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";

interface ShareCompanyDocumentsTabProps {
  candidateId: string;
  candidateName?: string;
  apiKey: string;
}

interface SharedDocument {
  id: string;
  candidate_id: string;
  company_document_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  company_document: CompanyDocument;
}

export default function ShareCompanyDocumentsTab({ 
  candidateId, 
  candidateName,
  apiKey 
}: ShareCompanyDocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareDescription, setShareDescription] = useState("");
  const [documentToShare, setDocumentToShare] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<CompanyDocument | null>(null);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [previewVolume, setPreviewVolume] = useState(50);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get company data from localStorage to get company_id
  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      setCompany(JSON.parse(companyData));
    }
  }, []);

  // Fetch company documents using the company ID from localStorage
  const { 
    data: companyDocuments = [], 
    isLoading: loadingDocuments,
    error: documentsError 
  } = useCompanyDocuments(company?.id || "");

  // Fetch shared documents for this candidate
  const { 
    data: sharedDocuments = [], 
    isLoading: loadingShared,
    error: sharedError 
  } = useCandidateSharedDocuments(candidateId);

  // Query client for invalidation
  const queryClient = useQueryClient();

  // Share document mutation
  const shareDocumentMutation = useShareDocumentWithCandidate(candidateId);
  const removeShareMutation = useRemoveDocumentShare(candidateId);

  // Filter and sort available documents (not already shared)
  const availableDocuments = useMemo(() => {
    const sharedDocumentIds = sharedDocuments.map((doc: SharedDocument) => doc.company_document_id);
    const filtered = companyDocuments.filter((doc: CompanyDocument) => 
      !sharedDocumentIds.includes(doc.id) &&
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || doc.category === filterCategory)
    );

    // Sort documents
    return filtered.sort((a: CompanyDocument, b: CompanyDocument) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'size':
          return b.file_size - a.file_size;
        default:
          return 0;
      }
    });
  }, [companyDocuments, sharedDocuments, searchTerm, filterCategory, sortBy]);

  // Filter and sort shared documents
  const filteredSharedDocuments = useMemo(() => {
    const filtered = sharedDocuments.filter((doc: SharedDocument) => 
      doc.company_document.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || doc.company_document.category === filterCategory)
    );

    // Sort documents
    return filtered.sort((a: SharedDocument, b: SharedDocument) => {
      switch (sortBy) {
        case 'name':
          return a.company_document.name.localeCompare(b.company_document.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'size':
          return b.company_document.file_size - a.company_document.file_size;
        default:
          return 0;
      }
    });
  }, [sharedDocuments, searchTerm, filterCategory, sortBy]);

  const getFileIcon = (contentType: string, fileName: string) => {
    // Handle undefined or null values
    if (!contentType || !fileName) return <File className="w-4 h-4" />;
    
    if (contentType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (contentType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (contentType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'doc':
      case 'docx': return <FileText className="w-4 h-4" />;
      case 'xls':
      case 'xlsx': return <FileSpreadsheet className="w-4 h-4" />;
      case 'ppt':
      case 'pptx': return <Presentation className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleShareDocument = async (documentId: string) => {
    setDocumentToShare(documentId);
    setShareDescription("");
    setShowShareModal(true);
  };

  const handleConfirmShare = async () => {
    if (!documentToShare) return;

    try {
      await shareDocumentMutation.mutateAsync({
        documentId: documentToShare,
        description: shareDescription
      });
      // Invalidate shared documents query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["candidate-shared-documents", candidateId] });
      setShowShareModal(false);
      setDocumentToShare(null);
      setShareDescription("");
    } catch (error) {
      console.error('Failed to share document:', error);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    if (window.confirm('Are you sure you want to remove this document share?')) {
      try {
        await removeShareMutation.mutateAsync(shareId);
        // Invalidate shared documents query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["candidate-shared-documents", candidateId] });
      } catch (error) {
        console.error('Failed to remove document share:', error);
      }
    }
  };

  // Document Preview Player Component
  const DocumentPreviewPlayer = ({ document }: { document: CompanyDocument }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {getFileIcon(document.file_type, document.file_name)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{document.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(document.file_size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isPreviewFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPreviewDoc(null)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-6">
          {document.file_type.startsWith('image/') ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={document.file_url} 
                alt={document.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : document.file_type.startsWith('video/') ? (
            <div className="w-full h-full flex items-center justify-center">
              <video 
                src={document.file_url}
                controls
                className="max-w-full max-h-full rounded-lg shadow-lg"
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement;
                  setPreviewProgress((video.currentTime / video.duration) * 100);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          ) : document.file_type.startsWith('audio/') ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music className="w-12 h-12" />
                    </div>
                    <h4 className="text-2xl font-bold">{document.name}</h4>
                    <p className="text-blue-100 mt-2">{formatFileSize(document.file_size)}</p>
                  </div>
                  <audio 
                    src={document.file_url}
                    controls
                    className="w-full"
                    onTimeUpdate={(e) => {
                      const audio = e.target as HTMLAudioElement;
                      setPreviewProgress((audio.currentTime / audio.duration) * 100);
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>
              </div>
            </div>
          ) : document.file_type === 'application/pdf' ? (
            <div className="w-full h-full flex items-center justify-center">
              <iframe 
                src={document.file_url}
                className="w-full h-full rounded-lg shadow-lg"
                title={document.name}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {getFileIcon(document.file_type, document.file_name)}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{document.name}</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Preview not available for this file type</p>
                <Button
                  onClick={() => window.open(document.file_url, '_blank')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {(document.file_type.startsWith('video/') || document.file_type.startsWith('audio/')) && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${previewProgress}%` }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={previewVolume}
                  onChange={(e) => setPreviewVolume(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modern Document Card Component
  const DocumentCard = ({ 
    document, 
    isShared = false, 
    shareInfo 
  }: { 
    document: CompanyDocument; 
    isShared?: boolean; 
    shareInfo?: SharedDocument;
  }) => (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      viewMode === 'grid' 
        ? 'hover:shadow-2xl hover:shadow-blue-500/20' 
        : 'hover:shadow-lg'
    }`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isShared 
          ? 'from-green-500/10 to-emerald-500/10' 
          : 'from-blue-500/10 to-purple-500/10'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <CardContent className={`p-${viewMode === 'grid' ? '6' : '4'} relative`}>
        <div className={`flex ${viewMode === 'grid' ? 'flex-col text-center' : 'items-start space-x-4'}`}>
          {/* File Icon */}
          <div className={`flex-shrink-0 ${
            viewMode === 'grid' 
              ? 'mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg' 
              : 'mt-1 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white'
          }`}>
            {getFileIcon(document.file_type, document.file_name)}
          </div>

          {/* Content */}
          <div className={`flex-1 ${viewMode === 'grid' ? '' : 'min-w-0'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className={`font-bold text-gray-900 dark:text-gray-100 ${
                  viewMode === 'grid' ? 'text-lg mb-2' : 'text-base'
                } line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                  {document.name}
                </h4>
                {document.description && (
                  <p className={`text-gray-600 dark:text-gray-300 line-clamp-2 ${
                    viewMode === 'grid' ? 'text-sm' : 'text-xs'
                  }`}>
                    {document.description}
                  </p>
                )}
              </div>
              
              {viewMode === 'list' && (
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPreviewDoc(document)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className={`flex items-center space-x-3 ${
              viewMode === 'grid' ? 'justify-center mb-4' : 'mb-3'
            }`}>
              <Badge 
                variant="outline" 
                className={`${
                  viewMode === 'grid' ? 'text-xs px-3 py-1' : 'text-xs'
                } border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-900/30`}
              >
                {document.category || 'Document'}
              </Badge>
              <span className={`text-gray-500 dark:text-gray-400 ${
                viewMode === 'grid' ? 'text-sm' : 'text-xs'
              }`}>
                {formatFileSize(document.file_size)}
              </span>
            </div>

            {/* Share Status */}
            {isShared && shareInfo && (
              <div className={`flex items-center space-x-2 ${
                viewMode === 'grid' ? 'justify-center mb-4' : 'mb-3'
              }`}>
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Shared {formatDate(shareInfo.created_at)}
                </span>
              </div>
            )}

            {/* Share Description */}
            {isShared && shareInfo?.description && (
              <div className={`mb-4 ${
                viewMode === 'grid' ? 'text-center' : ''
              }`}>
                <p className="text-xs text-blue-600 dark:text-blue-400 italic bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                  &quot;{shareInfo.description}&quot;
                </p>
              </div>
            )}

            {/* Actions */}
            <div className={`flex items-center space-x-2 ${
              viewMode === 'grid' ? 'justify-center' : 'justify-end'
            }`}>
              {viewMode === 'grid' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPreviewDoc(document)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}
              
              {isShared ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveShare(shareInfo!.id)}
                  disabled={removeShareMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              ) : (
                <Button
                  onClick={() => handleShareDocument(document.id)}
                  disabled={shareDocumentMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loadingDocuments || loadingShared) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl mb-8">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                📄 Document Sharing Hub
              </h1>
              <p className="text-blue-100 text-lg">
                Share company documents with <span className="font-semibold text-white">{candidateName || 'this candidate'}</span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{availableDocuments.length}</div>
                  <div className="text-sm text-blue-100">Available</div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredSharedDocuments.length}</div>
                  <div className="text-sm text-blue-100">Shared</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="🔍 Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size') => setSortBy(value)}>
              <SelectTrigger className="w-32 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hr_documents">HR Documents</SelectItem>
                <SelectItem value="policies">Policies</SelectItem>
                <SelectItem value="procedures">Procedures</SelectItem>
                <SelectItem value="forms">Forms</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Available Documents */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Documents</h2>
              <p className="text-gray-600 dark:text-gray-300">Ready to share</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-lg px-4 py-2">
              {availableDocuments.length}
            </Badge>
          </div>

          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
            {availableDocuments.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm ? 'No documents found' : 'No available documents'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Upload some documents to get started'}
                </p>
              </Card>
            ) : (
              availableDocuments.map((document: CompanyDocument) => (
                <DocumentCard key={document.id} document={document} />
              ))
            )}
          </div>
        </div>

        {/* Shared Documents */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shared Documents</h2>
              <p className="text-gray-600 dark:text-gray-300">Already shared with {candidateName || 'candidate'}</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-lg px-4 py-2">
              {filteredSharedDocuments.length}
            </Badge>
          </div>

          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
            {filteredSharedDocuments.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Share2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm ? 'No shared documents found' : 'No documents shared yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Share documents from the left panel to get started'}
                </p>
              </Card>
            ) : (
              filteredSharedDocuments.map((shareInfo: SharedDocument) => (
                <DocumentCard 
                  key={shareInfo.id} 
                  document={shareInfo.company_document} 
                  isShared={true}
                  shareInfo={shareInfo}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Player */}
      {selectedPreviewDoc && (
        <DocumentPreviewPlayer document={selectedPreviewDoc} />
      )}

      {/* Modern Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-3xl">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Share Document</h3>
                  <p className="text-blue-100 text-sm">Add a custom message for the candidate</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  💡 <strong>Pro tip:</strong> Adding a description helps candidates understand the document&apos;s purpose and importance.
                </p>
                <Textarea
                  placeholder="e.g., 📋 This is your employee handbook. Please review the policies and procedures before your first day..."
                  value={shareDescription}
                  onChange={(e) => setShareDescription(e.target.value)}
                  rows={4}
                  className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleConfirmShare}
                  disabled={shareDocumentMutation.isPending}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {shareDocumentMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Share2 className="w-5 h-5 mr-2" />
                  )}
                  Share Document
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                  disabled={shareDocumentMutation.isPending}
                  className="h-12 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Notifications */}
      <AppNotifications.Error message={documentsError?.message} />
      <AppNotifications.Error message={sharedError?.message} />
      <AppNotifications.Error message={shareDocumentMutation.error?.message} />
      <AppNotifications.Error message={removeShareMutation.error?.message} />

      {/* Success Notifications */}
      <AppNotifications.Success message={shareDocumentMutation.isSuccess ? 'Document shared successfully!' : null} />
      <AppNotifications.Success message={removeShareMutation.isSuccess ? 'Document share removed successfully!' : null} />
    </div>
  );
}
