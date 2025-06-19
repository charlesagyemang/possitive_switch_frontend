import { ApiCandidate } from "@/app/seed/candidates";
import { ApiContractTemplate } from "@/app/seed/contracts";
import CustomButton from "@/components/built/button/custom-button";
import Image from "next/image";
import React from "react";

function ContractPreview({
  contract,
  candidate,
  close,
}: {
  contract: ApiContractTemplate;
  candidate: ApiCandidate;
  close?: () => void;
}) {
  return (
    <div>
      <p>
        Here is a preview of the kind of contract letter you will be sending to{" "}
        {candidate?.name}
      </p>
      <Image
        width={300}
        height={400}
        src={contract.logo_url || ""}
        alt={`${contract.name} preview`}
        className="w-full h-[400px] object-contain"
      />

      <div className="flex gap-2 justify-end">
        <CustomButton onClick={() => close?.()} variant={"outline"}>
          Cancel
        </CustomButton>
        <CustomButton>Use</CustomButton>
      </div>
      {/* <p className="text-gray-600 mb-2">{contract.description}</p>
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
      </div> */}
    </div>
  );
}

export default ContractPreview;
