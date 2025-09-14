import React from 'react';
import { ApiCandidate } from '@/app/seed/candidates';
import SigningManagement from '@/components/contract-signing/SigningManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share } from 'lucide-react';
import { useCandidateContractList } from '@/api/candidates/contracts-api';

interface ContractSigningTabProps {
  candidate: ApiCandidate;
}

export default function ContractSigningTab({ candidate }: ContractSigningTabProps) {
  const { data: candidateContracts, isPending: loadingContracts } = useCandidateContractList(candidate.id);

  if (loadingContracts) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-sm text-gray-500">Loading contracts...</div>
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
            <Share className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Contracts Available
            </h3>
            <p className="text-gray-600">
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
          <h2 className="text-2xl font-bold text-gray-900">Contract Signing</h2>
          <p className="text-gray-600">
            Manage public signing for {candidate.name}&apos;s contracts
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {candidateContracts.map((contract: any) => (
          <Card key={contract.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {contract.company_contract_template.name}
              </CardTitle>
              <div className="text-sm text-gray-600">
                Created: {new Date(contract.created_at).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <SigningManagement
                contractId={contract.id}
                contractName={contract.company_contract_template.name}
                candidateEmail={candidate.email}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">How Contract Signing Works</h4>
            <ul className="text-sm text-blue-700 space-y-1">
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
