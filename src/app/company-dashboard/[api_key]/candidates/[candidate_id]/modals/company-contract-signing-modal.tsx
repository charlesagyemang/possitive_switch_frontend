import React from 'react';
import { ApiCandidate } from '@/app/seed/candidates';
import SigningManagement from '@/components/contract-signing/SigningManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share, X, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyContractSigningModalProps {
  candidate: ApiCandidate;
  contract: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyContractSigningModal({ candidate, contract, isOpen, onClose }: CompanyContractSigningModalProps) {
  
  // Get the contract HTML content for preview
  const getContractHTML = () => {
    if (!contract) return '';
    
    // First try rendered_html (actual contract with data filled in), then raw_html, then fall back to description
    if (contract.rendered_html && contract.rendered_html.trim()) {
      return contract.rendered_html;
    } else if (contract.company_contract_template?.raw_html && contract.company_contract_template.raw_html.trim()) {
      return contract.company_contract_template.raw_html;
    } else if (contract.company_contract_template?.description && contract.company_contract_template.description.trim()) {
      // Convert description to basic HTML if it's just text
      return `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
          <h1 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ${contract.company_contract_template.name}
          </h1>
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            ${contract.company_contract_template.description.replace(/\n/g, '<br>')}
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #34495e;">Contract Data:</h3>
            <ul style="list-style-type: disc; margin-left: 20px;">
              ${Object.entries(contract.data || {}).map(([key, value]) => `<li><strong>${key}</strong>: ${value}</li>`).join('') || '<li>No data available</li>'}
            </ul>
          </div>
        </div>
      `;
    } else {
      // Default preview content
      return `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333; text-align: center; padding: 40px;">
          <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ${contract.company_contract_template?.name || 'Contract'}
          </h1>
          <p style="margin: 20px 0; color: #7f8c8d; font-style: italic;">
            This contract does not have content defined yet.
          </p>
          <div style="margin: 20px 0;">
            <h3 style="color: #34495e;">Contract Data:</h3>
            <p style="color: #7f8c8d;">
              ${Object.keys(contract.data || {}).length ? Object.keys(contract.data).join(', ') : 'No data available'}
            </p>
          </div>
        </div>
      `;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Share className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contract Signing</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage public signing for {candidate.name}&apos;s contracts
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!contract ? (
            <div className="text-center py-8">
              <div className="text-sm text-gray-500 dark:text-gray-400">No contract selected</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Contract Preview */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      Contract Preview
                    </CardTitle>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Preview of the contract that will be signed
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-auto">
                      {/* Document Container */}
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg mx-auto max-w-full">
                        <div 
                          className="p-8 text-gray-900 dark:text-gray-100 leading-relaxed contract-content" 
                          style={{ 
                            fontFamily: "'Times New Roman', Times, serif", 
                            fontSize: "14px", 
                            lineHeight: "1.6",
                            minHeight: "300px",
                            backgroundColor: "white",
                            color: "#111827"
                          }}
                        >
                          <div 
                            className="contract-html-content"
                            style={{ backgroundColor: "white", color: "#111827" }}
                            dangerouslySetInnerHTML={{ __html: getContractHTML() }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Signing Management */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Share className="w-5 h-5 text-purple-500" />
                      Signing Management
                    </CardTitle>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {contract.company_contract_template.name} • Created: {new Date(contract.created_at).toLocaleDateString()}
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

                {/* Info Section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">How Contract Signing Works</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Enable signing to create a public link for this contract</li>
                        <li>• Share the link with the candidate and any other required signers</li>
                        <li>• Track signing progress in real-time</li>
                        <li>• Receive notifications when all parties have signed</li>
                        <li>• No authentication required for signers - just the secure link</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
