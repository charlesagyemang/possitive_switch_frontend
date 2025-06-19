import {
  ApiCandidateContract,
  ApiContractTemplate,
  CANDIDATE_CONTRACT_EXAMPLES,
  CONTRACT_TEMPLATE_EXAMPLES,
} from "@/app/seed/contracts";
import CustomButton from "@/components/built/button/custom-button";
import useModal from "@/components/built/modal/useModal";
import { GenericTable } from "@/components/built/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import React from "react";
import { candidateContractsColumns } from "./contracts-table-structure";
import { Textbox } from "@/components/built/input/input";
import { Input } from "@/components/ui/input";
import ContractPreview from "./contract-preview";

function ManageCandidateContracts() {
  const { ModalPortal, open } = useModal();

  const makeDropdownActions = (row: ApiCandidateContract) => {
    return [
      {
        label: "Delete",
        value: "delete",
        onClick: () => {
          // deleteConfirmation(row);
        },
      },
    ];
  };
  return (
    <div className="mt-6 ">
      <ModalPortal className="!max-w-3xl w-full" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-lg font-semibold">Manage Contracts</h5>
          <p className="text-gray-500">
            Handle all contracts related to this candidate here. Use predefined
            templates to ensure consistency and compliance.
          </p>
        </div>
        {/* <CustomButton
          onClick={() =>
            open(
              <p>List the available contract templates</p>,
              "Contract Templates"
            )
          }
        >
          <Plus size={18} /> Create A Contract
        </CustomButton> */}
      </div>

      <div className="grid grid-cols-6 gap-2">
        <Card className="shadow-none col-span-4 py-6 mb-6">
          <CardContent>
            <GenericTable<ApiCandidateContract, any>
              pageSize={8}
              name="Contracts"
              data={CANDIDATE_CONTRACT_EXAMPLES}
              columns={candidateContractsColumns({
                actions: makeDropdownActions,
              })}
              noRecordsText="No contracts found."
            />
          </CardContent>
        </Card>

        <Card className="shadow-none col-span-2 mb-6 ">
          <CardContent className="">
            <div className="flex flex-col gap-1  ">
              <h5 className="text-lg font-semibold">Contract Templates</h5>
              <Input
                placeholder="Search templates..."
                className="mb-2 shadow-none"
              />
              {/* <p className="text-gray-500 mb-2 text-xs">
                Use predefined templates to ensure consistency and compliance.
              </p> */}
              <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
                {CONTRACT_TEMPLATE_EXAMPLES.map(
                  (contract: ApiContractTemplate, index) => (
                    <div
                      key={index + contract.id}
                      className="flex items-center justify-between p-3 mb-3 bg-white border border-gray-100 rounded-lg  hover:shadow-md transition-shadow  group"
                    >
                      <div>
                        <span className="text-sm font-semibold flex items-center gap-1 text-gray-900 group-hover:text-primary">
                          <FileText size="12" /> {contract.name}
                        </span>
                        <div className="text-xs text-gray-400">
                          {contract.description}
                          {/* {contract.variables.length > 0
                            ? `Fields: ${contract.variables.join(", ")}`
                            : "No variables"} */}
                        </div>
                      </div>
                      <div className="flex items-center ml-auto">
                        <button
                          onClick={() =>
                            open(
                              <ContractPreview contract={contract} />,
                              contract.name
                            )
                          }
                          className="ml-3 px-2 py-1 text-xs hover:opacity-70 rounded bg-primary/10 text-primary font-semibold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          tabIndex={-1}
                          type="button"
                        >
                          Preview
                        </button>
                        <button
                          className="ml-3 px-2 py-1 text-xs rounded bg-green-700/10 text-green-700 cursor-pointer font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                          tabIndex={-1}
                          type="button"
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ManageCandidateContracts;
