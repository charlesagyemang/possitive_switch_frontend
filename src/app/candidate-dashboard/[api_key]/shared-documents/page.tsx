"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Download,
  Eye,
  File,
  FileSpreadsheet,
  Image,
  Video,
  Music,
  Presentation,
  Share2,
  Clock,
  CheckCircle,
  LoaderCircle,
  AlertCircle,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  X
} from "lucide-react";
import { useCandidateByApiKey, useCandidateSharedDocumentsForCandidate } from "@/api/candidates/candidates-api";

interface CompanyDocument {
  id: string;
  name: string;
  description: string | null;
  category: string;
  download_url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
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

export default function CandidateSharedDocumentsPage() {
  const params = useParams();
  const apiKey = params.api_key as string;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<CompanyDocument | null>(null);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [previewVolume, setPreviewVolume] = useState(50);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch candidate data using API key from URL
  const {
    data: candidate,
    isPending: loadingCandidate,
    isError: candidateError
  } = useCandidateByApiKey(apiKey);

  // Fetch shared documents for this candidate
  const { 
    data: sharedDocuments = [], 
    isLoading: loadingShared,
    error: sharedError 
  } = useCandidateSharedDocumentsForCandidate(candidate?.id || "");


  // Filter and sort shared documents
  const filteredSharedDocuments = useMemo(() => {
    if (!sharedDocuments || !Array.isArray(sharedDocuments)) {
      return [];
    }

    const filtered = sharedDocuments.filter((doc: SharedDocument) => {
      // Safety checks
      if (!doc || !doc.company_document) {
        return false;
      }
      
      const matchesSearch = doc.company_document.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesCategory = filterCategory === 'all' || doc.company_document.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });

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

  // Helper function to get full file URL
  const getFullFileUrl = (downloadUrl: string) => {
    if (!downloadUrl) return '';
    // If it's already a full URL (like S3), return as is
    if (downloadUrl.startsWith('http')) {
      return downloadUrl;
    }
    // Otherwise, construct the full URL with the Rails server URL
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}${downloadUrl}`;
  };

  const getFileIcon = (contentType: string, fileName: string) => {
    // Handle undefined or null values
    if (!contentType || !fileName) return <File className="w-4 h-4" />;
    
    // Additional safety check for startsWith
    if (typeof contentType !== 'string') return <File className="w-4 h-4" />;
    
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

  // Document Preview Player Component
  const DocumentPreviewPlayer = ({ document }: { document: CompanyDocument }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {getFileIcon(document.content_type, document.file_name)}
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
          {document.content_type && document.content_type.startsWith('image/') ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={getFullFileUrl(document.download_url)} 
                alt={document.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : document.content_type && document.content_type.startsWith('video/') ? (
            <div className="w-full h-full flex items-center justify-center">
              <video 
                src={getFullFileUrl(document.download_url)}
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
          ) : document.content_type && document.content_type.startsWith('audio/') ? (
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
                    src={getFullFileUrl(document.download_url)}
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
          ) : document.content_type && document.content_type === 'application/pdf' ? (
            <div className="w-full h-full flex items-center justify-center">
              <iframe 
                src={getFullFileUrl(document.download_url)}
                className="w-full h-full rounded-lg shadow-lg"
                title={document.name}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {getFileIcon(document.content_type, document.file_name)}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{document.name}</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Preview not available for this file type</p>
                <Button
                  onClick={() => window.open(getFullFileUrl(document.download_url), '_blank')}
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
        {(document.content_type && (document.content_type.startsWith('video/') || document.content_type.startsWith('audio/'))) && (
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
  const DocumentCard = ({ shareInfo }: { shareInfo: SharedDocument }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className={`p-${viewMode === 'grid' ? '6' : '4'} relative`}>
        <div className={`flex ${viewMode === 'grid' ? 'flex-col text-center' : 'items-start space-x-4'}`}>
          {/* File Icon */}
          <div className={`flex-shrink-0 ${
            viewMode === 'grid' 
              ? 'mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg' 
              : 'mt-1 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white'
          }`}>
            {getFileIcon(shareInfo.company_document.content_type, shareInfo.company_document.file_name)}
          </div>

          {/* Content */}
          <div className={`flex-1 ${viewMode === 'grid' ? '' : 'min-w-0'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className={`font-bold text-gray-900 dark:text-gray-100 ${
                  viewMode === 'grid' ? 'text-lg mb-2' : 'text-base'
                } line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors`}>
                  {shareInfo.company_document.name}
                </h4>
                {shareInfo.company_document.description && (
                  <p className={`text-gray-600 dark:text-gray-300 line-clamp-2 ${
                    viewMode === 'grid' ? 'text-sm' : 'text-xs'
                  }`}>
                    {shareInfo.company_document.description}
                  </p>
                )}
              </div>
              
              {viewMode === 'list' && (
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPreviewDoc(shareInfo.company_document)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-100 dark:hover:bg-green-900"
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
                } border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-900/30`}
              >
                {shareInfo.company_document.category || 'Document'}
              </Badge>
              <span className={`text-gray-500 dark:text-gray-400 ${
                viewMode === 'grid' ? 'text-sm' : 'text-xs'
              }`}>
                {formatFileSize(shareInfo.company_document.file_size)}
              </span>
            </div>

            {/* Share Info */}
            <div className={`flex items-center space-x-2 ${
              viewMode === 'grid' ? 'justify-center mb-4' : 'mb-3'
            }`}>
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Shared {formatDate(shareInfo.created_at)}
              </span>
            </div>

            {/* Share Description */}
            {shareInfo.description && (
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
                  onClick={() => setSelectedPreviewDoc(shareInfo.company_document)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-100 dark:hover:bg-green-900"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}
              
              <Button
                onClick={() => window.open(getFullFileUrl(shareInfo.company_document.download_url), '_blank')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Loading state
  if (loadingCandidate || loadingShared) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoaderCircle className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading shared documents...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (candidateError || !candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Unable to load shared documents
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your link or contact HR for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-3xl shadow-2xl mb-8">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                📄 Documents Shared with Me
              </h1>
              <p className="text-green-100 text-lg">
                Company documents shared by <span className="font-semibold text-white">{candidate.name}</span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredSharedDocuments.length}</div>
                  <div className="text-sm text-green-100">Shared Documents</div>
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
              placeholder="🔍 Search shared documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 bg-gray-50 dark:bg-gray-700"
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

      {/* Documents Grid */}
      <div className="space-y-6">
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {filteredSharedDocuments.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 col-span-full">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm ? 'No shared documents found' : 'No documents shared yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Your company hasn\'t shared any documents with you yet'}
              </p>
            </Card>
          ) : (
            filteredSharedDocuments.map((shareInfo: SharedDocument) => (
              <DocumentCard key={shareInfo.id} shareInfo={shareInfo} />
            ))
          )}
        </div>
      </div>

      {/* Document Preview Player */}
      {selectedPreviewDoc && (
        <DocumentPreviewPlayer document={selectedPreviewDoc} />
      )}
    </div>
  );
}
