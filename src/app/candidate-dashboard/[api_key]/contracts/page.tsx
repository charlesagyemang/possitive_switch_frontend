"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  PenTool, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Building,
  Sparkles,
  LoaderCircle
} from "lucide-react";
import { useCandidateByApiKey } from "@/api/candidates/candidates-api";

interface Contract {
  id: string;
  candidate_id: string;
  data: Record<string, any>;
  status: 'approved' | 'pending' | 'signed' | 'expired' | 'draft';
  created_at: string;
  updated_at: string;
  signing_token: string;
  signing_status: string;
  public_signing_enabled: boolean;
  rendered_html: string;
  required_signers: string[];
  signatures: Array<{
    id: string;
    signer_name: string;
    signer_email: string;
    signed_at: string;
  }>;
  company_contract_template: {
    name: string;
    description: string;
    company_name: string;
  };
}

export default function CandidateContractsPage() {
  const params = useParams();
  const apiKey = params.api_key as string;
  
  // Fetch candidate data using API key from URL
  const {
    data: candidate,
    isPending: loadingCandidate,
    isError: candidateError
  } = useCandidateByApiKey(apiKey);
  
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    // Use real contracts from API
    if (candidate?.contracts) {
      setContracts(candidate.contracts);
    }
  }, [candidate]);

  // Helper function to calculate signing progress
  const getSigningProgress = (contract: Contract) => {
    if (!contract.required_signers || !contract.signatures) {
      return 0;
    }
    return Math.round((contract.signatures.length / contract.required_signers.length) * 100);
  };

  // Helper function to determine if contract is fully signed
  const isFullySigned = (contract: Contract) => {
    const progress = getSigningProgress(contract);
    return progress >= 100 || contract.signing_status === 'fully_signed';
  };

  const getStatusColor = (contract: Contract) => {
    if (isFullySigned(contract)) {
      return 'bg-green-100 text-green-800 border-green-200';
    }

    switch (contract.signing_status) {
      case 'fully_signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'partially_signed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open_for_signing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (contract: Contract) => {
    if (isFullySigned(contract)) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    switch (contract.signing_status) {
      case 'fully_signed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partially_signed': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'open_for_signing': return <PenTool className="w-4 h-4 text-blue-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (contract: Contract) => {
    if (isFullySigned(contract)) {
      return 'Fully Signed';
    }

    switch (contract.signing_status) {
      case 'fully_signed': return 'Fully Signed';
      case 'partially_signed': return 'Partially Signed';
      case 'open_for_signing': return 'Open for Signing';
      case 'approved': return 'Approved';
      case 'signed': return 'Signed';
      case 'pending': return 'Pending';
      case 'expired': return 'Expired';
      case 'draft': return 'Draft';
      default: return contract.signing_status?.replace('_', ' ') || 'Unknown';
    }
  };

  const handleSignContract = (contract: Contract) => {
    if (contract.signing_token) {
      // Navigate to the signing page using the token
      window.open(`/contracts/${contract.signing_token}/sign`, '_blank');
    }
  };

  const handleViewContract = (contract: Contract) => {
    // Show the rendered HTML in a new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(contract.rendered_html);
      newWindow.document.close();
    }
  };

  const handleDownloadContract = (contract: Contract) => {
    // Create a blob with the HTML content and download it
    const blob = new Blob([contract.rendered_html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${contract.company_contract_template?.name || 'Contract'}-${contract.id}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Loading state
  if (loadingCandidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoaderCircle className="animate-spin h-12 w-12 text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading contracts...</p>
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
            Unable to load contracts
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
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-purple-200/50 dark:border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2">
                Your Contracts <Sparkles className="w-8 h-8 text-purple-500" />
              </h1>
              <p className="text-purple-600 dark:text-purple-300 font-medium text-lg mt-1">
                Review, sign, and manage your employment documents ✨
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Contracts</div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {contracts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {contracts.filter(c => c.status === 'approved' || c.status === 'signed').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {contracts.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {contracts.filter(c => c.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {contracts.filter(c => !isFullySigned(c) && c.signing_status === 'open_for_signing' && c.public_signing_enabled).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ready to Sign</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {contracts.filter(c => isFullySigned(c)).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fully Signed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            <FileText className="w-5 h-5 text-purple-500" />
            All Contracts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                        {getStatusIcon(contract)}
                      </div>
                      <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {contract.company_contract_template?.name || 'Contract'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(contract)}`}>
                          {getStatusText(contract)}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {contract.signing_status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                        </span>
                      </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {contract.company_contract_template?.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {contract.company_contract_template?.company_name || 'Company'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {new Date(contract.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Updated: {new Date(contract.updated_at).toLocaleDateString()}
                      </div>
                      {contract.public_signing_enabled && (
                        <div className="flex items-center gap-1">
                          <PenTool className="w-4 h-4" />
                          Public Signing Enabled
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewContract(contract)}
                      className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    
                    {(contract.status === 'approved' || contract.status === 'signed') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadContract(contract)}
                        className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                    
                    {!isFullySigned(contract) && contract.signing_status === 'open_for_signing' && contract.public_signing_enabled && (
                      <Button
                        size="sm"
                        onClick={() => handleSignContract(contract)}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <PenTool className="w-4 h-4 mr-1" />
                        Sign Contract
                      </Button>
                    )}

                    {isFullySigned(contract) && (
                      <Badge className="bg-green-100 text-green-600 border-green-200">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Fully Signed
                      </Badge>
                    )}
                    
                    {contract.status === 'draft' && (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Need Help with Contracts?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                If you have questions about any contract or need assistance with signing, please contact your HR department or legal team.
              </p>
            </div>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400">
              Contact HR
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
