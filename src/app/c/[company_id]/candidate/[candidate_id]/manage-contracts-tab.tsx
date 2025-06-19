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
import { FileText, LoaderCircle, Plus } from "lucide-react";
import React from "react";
import { candidateContractsColumns } from "./contracts-table-structure";
import { Textbox } from "@/components/built/input/input";
import { Input } from "@/components/ui/input";
import ContractPreview from "./contract-preview";
import { useContractTemplatesListHandler } from "@/api/candidates/contracts-api";
import { ApiCandidate } from "@/app/seed/candidates";

function ManageCandidateContracts({ candidate }: { candidate: ApiCandidate }) {
  const { ModalPortal, open, close } = useModal();

  const {
    data: listofContracts,
    isPending: loadingTemplates,
    error,
    isFetched: templatesFetched,
  } = useContractTemplatesListHandler();

  console.log("List of Contracts", listofContracts);

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

  const renderTemplates = () => {
    if (!!!listofContracts)
      return <span className="text-gray-500">No templates found.</span>;
    return listofContracts.map(
      (contract: ApiContractTemplate, index: number) => (
        <div
          key={index + contract.id}
          className="flex flex-col  justify-between p-3 mb-3 bg-white border border-gray-100 rounded-lg  hover:shadow-md transition-shadow  group"
        >
          <div>
            <span className="text-sm font-semibold truncate flex items-center gap-1 text-gray-900 group-hover:text-primary">
              {contract.name}
            </span>
            <div className="text-xs text-gray-400">
              {contract.description}
              {/* {contract.variables.length > 0
                            ? `Fields: ${contract.variables.join(", ")}`
                            : "No variables"} */}
            </div>
          </div>
          <div className="flex mt-1 items-center">
            <FileText size={14} className="text-gray-400" />
            <button
              onClick={() =>
                open(
                  <ContractPreview
                    candidate={candidate}
                    close={close}
                    contract={contract}
                  />,
                  contract.name
                )
              }
              className=" ml-auto px-2 py-1 text-xs hover:opacity-70 rounded bg-primary/10 text-primary font-semibold cursor-pointer   transition-opacity"
              tabIndex={-1}
              type="button"
            >
              Preview
            </button>
            <button
              className="ml-3 px-2 py-1 text-xs rounded bg-green-700/10 text-green-700 cursor-pointer font-semibold  transition-opacity"
              tabIndex={-1}
              type="button"
            >
              Use
            </button>
          </div>
        </div>
      )
    );
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
              {loadingTemplates ? (
                <span className="flex text-sm items-center gap-2 text-gray-500">
                  <LoaderCircle className="animate-spin text-primary" />{" "}
                  Fetching templates...
                </span>
              ) : (
                <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
                  {renderTemplates()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ManageCandidateContracts;
