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
  Sparkles,
  Crown,
  Heart,
  Star,
  Gem,
} from "lucide-react";
import React, { useMemo } from "react";
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

  const usedTemplates = useMemo(() => {
    return candidateContracts?.map(
      (contract: ApiCandidateContract) => contract.contract_template.id
    );
  }, [candidateContracts]);

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
      return (
        <div className="text-center py-4">
          <span className="text-gray-400 dark:text-gray-500">✨ No templates found</span>
          <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Templates will appear here 💫</p>
        </div>
      );

    return listofContracts.map(
      (contract: ApiContractTemplate, index: number) => {
        const isUsed = usedTemplates?.includes(contract.id);
        const gradients = [
          "from-pink-400 via-rose-400 to-red-400",
          "from-purple-400 via-violet-400 to-indigo-400", 
          "from-blue-400 via-cyan-400 to-teal-400",
          "from-green-400 via-emerald-400 to-lime-400"
        ];
        const sparkleIcons = [Heart, Star, Gem, Sparkles];
        const SparkleIcon = sparkleIcons[index % sparkleIcons.length];
        
        return (
          <div
            key={index + contract.id}
            className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl dark:hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 rounded-2xl overflow-hidden relative mb-4"
          >
            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 rounded-2xl`}></div>
            
            <div className="p-4 relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300">
                      {contract.name}
                    </span>
                    <SparkleIcon className="w-3 h-3 text-pink-400 dark:text-pink-300 animate-pulse" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {contract.description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={14} className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[index % gradients.length]}`} />
                  <small className="text-gray-600 dark:text-gray-300 font-medium">
                    {contract.variables?.length} Fields ✨
                  </small>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      open(
                        <ContractPreview
                          candidate={candidate}
                          close={close}
                          contract={contract}
                          use={() => openUseModal(contract, "create")}
                        />,
                        contract.name
                      )
                    }
                    className="px-3 py-1 text-xs rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    tabIndex={-1}
                    type="button"
                  >
                    Preview 👁️
                  </button>
                  <button
                    onClick={() => openUseModal(contract, "create")}
                    className="px-3 py-1 text-xs rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    tabIndex={-1}
                    type="button"
                  >
                    Use ✨
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    );
  };

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
    <div className="mt-6">
      <ModalPortal className="!max-w-3xl w-full" />
      
      {/* Beautiful Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-6 h-6 text-purple-500" />
          <h5 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600">
            Manage Contracts ✨
          </h5>
        </div>
        <p className="text-purple-600 dark:text-purple-300 font-medium">
          Handle all contracts with style! Use beautiful templates for consistency 💎
        </p>
      </div>

      <div className="grid grid-cols-7 gap-6">
        {/* Contracts Table */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden col-span-5 py-6 mb-6">
          {loadingContracts ? (
            <div className="flex m-6 text-sm items-center gap-3 text-purple-500 dark:text-purple-400">
              <LoaderCircle className="animate-spin" />
              <span className="font-medium">Fetching contracts... ✨</span>
            </div>
          ) : (
            <>{renderContracts()}</>
          )}
        </Card>

        {/* Contract Templates */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl dark:shadow-purple-500/25 rounded-3xl overflow-hidden col-span-2 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h5 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
                  Contract Templates
                </h5>
              </div>
              
              {loadingTemplates ? (
                <div className="flex text-sm items-center gap-3 text-purple-500 dark:text-purple-400">
                  <LoaderCircle className="animate-spin" />
                  <span className="font-medium">Loading templates... ✨</span>
                </div>
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
