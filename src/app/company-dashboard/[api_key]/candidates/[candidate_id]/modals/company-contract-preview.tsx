import { ApiCandidate } from "@/app/seed/candidates";
import { ApiContractTemplate } from "@/app/seed/contracts";
import CustomButton from "@/components/built/button/custom-button";
import React from "react";

function CompanyContractPreview({
  contract,
  candidate,
  close,
  use,
}: {
  contract: ApiContractTemplate;
  candidate: ApiCandidate;
  close?: () => void;
  use?: () => void;
}) {
  // Get the HTML content from the contract template
  const getContractHTML = () => {
    // First try raw_html, then fall back to description, then default content
    if (contract.raw_html && contract.raw_html.trim()) {
      return contract.raw_html;
    } else if (contract.description && contract.description.trim()) {
      // Convert description to basic HTML if it's just text
      return `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
          <h1 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ${contract.name}
          </h1>
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            ${contract.description.replace(/\n/g, '<br>')}
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #34495e;">Variables Required:</h3>
            <ul style="list-style-type: disc; margin-left: 20px;">
              ${contract.variables?.map(variable => `<li><strong>${variable.name}</strong> (${variable.type})</li>`).join('') || '<li>No variables defined</li>'}
            </ul>
          </div>
        </div>
      `;
    } else {
      // Default preview content
      return `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333; text-align: center; padding: 40px;">
          <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ${contract.name}
          </h1>
          <p style="margin: 20px 0; color: #7f8c8d; font-style: italic;">
            This template does not have content defined yet.
          </p>
          <div style="margin: 20px 0;">
            <h3 style="color: #34495e;">Variables:</h3>
            <p style="color: #7f8c8d;">
              ${contract.variables?.length ? contract.variables.map(v => v.name).join(', ') : 'No variables defined'}
            </p>
          </div>
        </div>
      `;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Contract Template Preview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Preview of &ldquo;{contract.name}&rdquo; that will be sent to {candidate?.name}
        </p>
      </div>

      {/* Contract Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 max-h-[600px] overflow-auto">
        {/* Document Container */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg mx-auto max-w-4xl">
          <div 
            className="p-12 text-gray-900 dark:text-gray-100 leading-relaxed contract-content" 
            style={{ 
              fontFamily: "'Times New Roman', Times, serif", 
              fontSize: "14px", 
              lineHeight: "1.6",
              minHeight: "400px",
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

      {/* Template Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-800 dark:text-blue-300">Variables:</span>
            <span className="text-blue-700 dark:text-blue-400 ml-2">
              {contract.variables?.length ? `${contract.variables.length} fields` : 'No variables'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-blue-800 dark:text-blue-300">Status:</span>
            <span className={`ml-2 ${contract.active ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              {contract.active ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-blue-800 dark:text-blue-300">Created:</span>
            <span className="text-blue-700 dark:text-blue-400 ml-2">
              {new Date(contract.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-semibold text-blue-800 dark:text-blue-300">Type:</span>
            <span className="text-blue-700 dark:text-blue-400 ml-2">
              {contract.raw_html ? 'Rich HTML' : 'Basic Template'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <CustomButton onClick={() => close?.()} variant={"outline"}>
          Cancel
        </CustomButton>
        <CustomButton onClick={() => use?.()}>
          Use This Template
        </CustomButton>
      </div>
    </div>
  );
}

export default CompanyContractPreview;
