"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  Eye,
  Send,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail
} from "lucide-react";
import { useCandidateList } from "@/api/candidates/candidates-api";
import { ApiCandidate } from "@/app/seed/candidates";
import useModal from "@/components/built/modal/useModal";

interface Company {
  id: string;
  name: string;
  email: string;
  location: string;
  phone_number: string;
  api_key: string;
}

// Mock contract data - in real app this would come from API
interface Contract {
  id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  salary: string;
  contract_date: string;
  reporting_date: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  created_at: string;
  signed_at?: string;
  expires_at?: string;
}

function CompanyContractsContent() {
  const params = useParams();
  const router = useRouter();
  const apiKey = params.api_key as string;
  const { open, close, ModalPortal } = useModal();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Get company data from localStorage
  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    if (companyData) {
      const parsed = JSON.parse(companyData);
      setCompany(parsed);
    }
  }, []);

  // Fetch candidates for this company
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidateList(company?.id || "");

  // Generate mock contracts from candidates
  useEffect(() => {
    if (candidates && company) {
      const mockContracts: Contract[] = candidates.map((candidate: ApiCandidate) => ({
        id: `contract-${candidate.id}`,
        candidate_id: candidate.id,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        job_title: candidate.job_title || "Software Engineer",
        salary: "75000", // Default salary since not available in ApiCandidate
        contract_date: "", // Default empty since not available in ApiCandidate
        reporting_date: "", // Default empty since not available in ApiCandidate
        status: 'draft' as const, // Default to draft since no contract_date available
        created_at: candidate.created_at,
        signed_at: undefined, // No contract_date available
        expires_at: undefined // No contract_date available
      }));
      setContracts(mockContracts);
    }
  }, [candidates, company]);

  // Filter contracts based on search term
  useEffect(() => {
    if (!contracts) return;
    
    const filtered = contracts.filter((contract: Contract) =>
      contract.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContracts(filtered);
  }, [contracts, searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: Clock },
      sent: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: Send },
      signed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle },
      expired: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string | number) => {
    if (!amount) return "Not set";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  };

  const handleCreateContract = (candidateId: string) => {
    // TODO: Implement contract creation
    console.log("Create contract for candidate:", candidateId);
  };

  const handleSendContract = (contractId: string) => {
    // TODO: Implement contract sending
    console.log("Send contract:", contractId);
  };

  const handleViewContract = (contractId: string) => {
    // TODO: Implement contract viewing
    console.log("View contract:", contractId);
  };

  const handleDeleteContract = (contractId: string) => {
    // TODO: Implement contract deletion
    console.log("Delete contract:", contractId);
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-500" />
            Contracts Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage contracts for {company.name}
          </p>
        </div>
        <Button
          onClick={() => {
            // TODO: Implement create contract modal
            console.log("Create new contract");
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Contract
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Contracts</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{contracts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Signed</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {contracts.filter(c => c.status === 'signed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {contracts.filter(c => c.status === 'sent' || c.status === 'draft').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Expired</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {contracts.filter(c => c.status === 'expired').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search contracts by candidate name, email, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 rounded-xl"
              />
            </div>
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Contracts ({filteredContracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidatesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading contracts...</p>
              </div>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No contracts found" : "No contracts yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by creating your first contract"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => {
                    // TODO: Implement create contract modal
                    console.log("Create first contract");
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Contract
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Job Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Salary</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{contract.candidate_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contract.candidate_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">{contract.job_title}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">{formatCurrency(contract.salary)}</p>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">{formatDate(contract.created_at)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleViewContract(contract.id)}
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {contract.status === 'draft' && (
                            <Button
                              onClick={() => handleSendContract(contract.id)}
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteContract(contract.id)}
                            size="sm"
                            variant="destructive"
                            className="rounded-lg"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ModalPortal />
    </div>
  );
}

export default function CompanyContractsPage() {
  return <CompanyContractsContent />;
}
