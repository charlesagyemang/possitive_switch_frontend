import React, { useState, useMemo } from 'react';
import { ApiCandidate } from '@/app/seed/candidates';
import SigningManagement from '@/components/contract-signing/SigningManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Share, Search } from 'lucide-react';
import { useCandidateContractList } from '@/api/candidates/contracts-api';

interface ContractSigningTabProps {
  candidate: ApiCandidate;
}

export default function ContractSigningTab({ candidate }: ContractSigningTabProps) {
  const { data: candidateContracts, isPending: loadingContracts } = useCandidateContractList(candidate.id);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contracts based on search
  const filteredContracts = useMemo(() => {
    if (!candidateContracts) return [];
    
    return candidateContracts.filter((contract: any) => {
      return searchTerm === "" || 
        contract.company_contract_template?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.status?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [candidateContracts, searchTerm]);

  if (loadingContracts) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading contracts...</div>
        </div>
      </div>
    );
  }

  if (!candidateContracts || candidateContracts.length === 0) {
    return (
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center">
          <Share className="h-5 w-5 mr-2" />
          Contract Signing
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Share className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Contracts Available
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create contracts for {candidate.name} first to enable signing functionality.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contract Signing</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage public signing for {candidate.name}&apos;s contracts
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-pink-200/50 dark:border-purple-500/30">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search contracts by name or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredContracts.length} of {candidateContracts?.length || 0} contracts
        </div>
      </div>

      <div className="space-y-6">
        {filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No contracts found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchTerm ? `No contracts match "${searchTerm}"` : "No contracts available for signing"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredContracts.map((contract: any) => (
          <Card key={contract.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {contract.company_contract_template.name}
              </CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created: {new Date(contract.created_at).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <SigningManagement
                contractId={contract.id}
                contractName={contract.company_contract_template.name}
                candidateEmail={candidate.email}
                candidateId={candidate.id}
                contractData={contract}
              />
            </CardContent>
          </Card>
          ))
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">How Contract Signing Works</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Enable signing to create a public link for any contract</li>
              <li>• Share the link with the candidate and any other required signers</li>
              <li>• Track signing progress in real-time</li>
              <li>• Receive notifications when all parties have signed</li>
              <li>• No authentication required for signers - just the secure link</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
