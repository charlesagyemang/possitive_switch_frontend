import {
  ApiCandidateContract,
  ApiContractTemplate,
} from "@/app/seed/contracts";
import useModal from "@/components/built/modal/useModal";
import { GenericTable } from "@/components/built/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Edit2,
  FileText,
  LoaderCircle,
  Send,
  Stamp,
  Trash,
} from "lucide-react";
import React from "react";
import { candidateContractsColumns } from "./contracts-table-structure";
import ContractPreview from "./modals/contract-preview";
import {
  useCandidateContractList,
  useContractTemplatesListHandler,
} from "@/api/candidates/contracts-api";
import { ApiCandidate } from "@/app/seed/candidates";
import InitialiseContract from "./modals/initialiase-contract";
import AppNotifications from "@/components/built/app-notifications";

function ManageCandidateContracts({ candidate }: { candidate: ApiCandidate }) {
  const { ModalPortal, open, close } = useModal();

  const { data: listofContracts, isPending: loadingTemplates } =
    useContractTemplatesListHandler();

  const {
    data: candidateContracts,
    isPending: loadingContracts,
    error,
  } = useCandidateContractList(candidate.id);

  const openUseModal = (
    contract: ApiContractTemplate,
    flag?: string,
    options?: Record<string, any>
  ) => {
    const { candidateContract, title } = options || {};

    open(
      <InitialiseContract
        close={close}
        contract={contract}
        candidate={candidate}
        flag={flag}
        data={candidateContract?.data}
        candidateContract={candidateContract}
      />,
      title || `Initialise Contract: ${contract.name}`
    );
  };

  const send = (row: ApiCandidateContract) => {
    openUseModal(row.contract_template, "send", {
      candidateContract: row,
      title: `Send Contract -  ${row.contract_template.name}`,
    });
  };

  const approve = (row: ApiCandidateContract) => {
    openUseModal(row.contract_template, "approve", {
      candidateContract: row,
      title: `Approve Contract - ${row.contract_template.name}`,
    });
  };

  const approveAndSend = (row: ApiCandidateContract) => {
    openUseModal(row.contract_template, "approve_and_send", {
      candidateContract: row,
      title: `Approve & Send Contract - ${row.contract_template.name}`,
    });
  };

  const makeDropdownActions = (row: ApiCandidateContract) => {
    return [
      {
        label: "Edit",
        value: "edit",
        Icon: Edit2,
        onClick: () => {
          // deleteConfirmation(row);
          // openUseModal(row.contract_template, "edit", {
          //   candidateContract: row,
          //   title: `Edit Contract - ${row.contract_template.name}`,
          // });
        },
      },
      {
        label: "Send",
        value: "send",
        Icon: Send,
        onClick: () => {
          send(row);
          // deleteConfirmation(row);
          // openUseModal(row.contract_template, "send", {
          //   candidateContract: row,
          //   title: `Send Contract -  ${row.contract_template.name}`,
          // });
        },
      },
      {
        label: "Approve",
        value: "approve",
        Icon: Stamp,
        onClick: () => {
          approve(row);
          // deleteConfirmation(row);
          // openUseModal(row.contract_template, "approve", {
          //   candidateContract: row,
          //   title: `Approve Contract - ${row.contract_template.name}`,
          // });
        },
      },
      {
        label: "Approve & Send",
        value: "approve_and_send",
        Icon: CheckCircle,
        onClick: () => {
          approveAndSend(row);
          // deleteConfirmation(row);
          // openUseModal(row.contract_template, "approve_and_send", {
          //   candidateContract: row,
          //   title: `Approve & Send Contract - ${row.contract_template.name}`,
          // });
        },
      },
      {
        label: "Delete",
        value: "delete",
        Icon: Trash,
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
          <div className="flex mt-1 items-center gap-2">
            <FileText size={14} className="text-gray-400" />{" "}
            <small className="text-gray-600">
              {contract.variables?.length} Fields
            </small>
            <button
              onClick={() =>
                open(
                  <ContractPreview
                    candidate={candidate}
                    close={close}
                    contract={contract}
                    use={() => openUseModal(contract)}
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
              onClick={() => openUseModal(contract)}
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

  console.log("candidateContracts", candidateContracts);
  console.log("listofContracts", listofContracts);
  const renderContracts = () => {
    if (error)
      return (
        <div className="mx-2">
          <AppNotifications.Error message={error.message} />
        </div>
      );

    return (
      <CardContent>
        <GenericTable<ApiCandidateContract, any>
          pageSize={8}
          name="Contracts"
          data={candidateContracts || []}
          columns={candidateContractsColumns({
            actions: makeDropdownActions,
            send,
            approve,
            approveAndSend,
          })}
          noRecordsText="No contracts found."
        />
      </CardContent>
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

      <div className="grid grid-cols-7 gap-2">
        <Card className="shadow-none col-span-5 py-6 mb-6">
          {loadingContracts ? (
            <span className="flex m-3 text-sm items-center gap-2 text-gray-500">
              <LoaderCircle className="animate-spin text-primary" /> Fetching
              contracts...
            </span>
          ) : (
            <>{renderContracts()}</>
          )}
        </Card>

        <Card className="shadow-none col-span-2 mb-6 ">
          <CardContent className="">
            <div className="flex flex-col gap-1  ">
              <h5 className="text-lg font-semibold">Contract Templates</h5>
              {/* <Input
                placeholder="Search templates..."
                className="mb-2 shadow-none"
              /> */}
              {/* <p className="text-gray-500 mb-2 text-xs">
                Use predefined templates to ensure consistency and compliance.
              </p> */}
              {loadingTemplates ? (
                <span className="flex text-sm items-center gap-2 text-gray-500">
                  <LoaderCircle className="animate-spin text-primary" />{" "}
                  Fetching templates...
                </span>
              ) : (
                <div className="max-h-[480px] mt-2 overflow-y-auto scrollbar-hide">
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
