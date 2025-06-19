import { ApiContractTemplate } from "@/app/seed/contracts";
import React from "react";

function ContractPreview({ contract }: { contract: ApiContractTemplate }) {
  return (
    <div>
      <p className="text-gray-600 mb-2">{contract.description}</p>
      <div className="mb-1">
        <span className="font-semibold text-xs text-gray-500 mr-1">
          Variables:
        </span>
        <span className="text-xs text-gray-700">
          {contract.variables.join(", ")}
        </span>
      </div>
      <div className="mb-1">
        <span className="font-semibold text-xs text-gray-500 mr-1">
          Active:
        </span>
        <span
          className={`text-xs ${
            contract.active ? "text-green-600" : "text-red-500"
          }`}
        >
          {contract.active ? "Yes" : "No"}
        </span>
      </div>
      <div className="mb-1">
        <span className="font-semibold text-xs text-gray-500 mr-1">
          Created:
        </span>
        <span className="text-xs text-gray-700">
          {new Date(contract.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default ContractPreview;
