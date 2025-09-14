import { Q_LIST_ALL_CANDIDATE_CONTRACTS } from "@/api/auth/constants";
import {
  useApproveAndSendHandler,
  useContractApprovalHandler,
  useCreateContract,
  useSendContractHandler,
} from "@/api/candidates/contracts-api";
import { ApiCandidate } from "@/app/seed/candidates";
import {
  ApiCandidateContract,
  ApiContractTemplate,
  ContractVariable,
} from "@/app/seed/contracts";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import { renderFormField } from "@/components/built/form/generator";
import { TEMPLATE_FORM_KEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";

function InitialiseContract({
  close,
  candidate,
  contract,
  flag,
  data,
  candidateContract,
}: {
  close?: () => void;
  candidate?: ApiCandidate;
  contract?: ApiContractTemplate;
  flag?: string;
  data?: Record<string, any>;
  candidateContract?: ApiCandidateContract;
}) {
  const variables = contract?.variables || [];
  
  // Debug logging for template variables
  console.log("=== Contract Template Variables ===");
  console.log("Template:", contract?.name);
  console.log("Variables:", variables);
  
  const formFields = variables.map((variable: ContractVariable) => {
    const formFieldType = TEMPLATE_FORM_KEYS[variable.type] || TEMPLATE_FORM_KEYS[variable.type.toLowerCase()] || "text";
    const cleanName = variable.name?.split("_").join(" ").toLowerCase();
    
    console.log(`Variable: ${variable.name}, Type: ${variable.type} -> Form Type: ${formFieldType}`);
    
    return {
      name: variable.name,
      type: formFieldType,
      placeholder: `Enter ${cleanName}...`,
      label: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      required: true,
    };
  });
  
  console.log("Generated form fields:", formFields);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<any>({
    defaultValues: { CANDIDATE_NAME: candidate?.name || "", ...(data || {}) },
  });

  // --------------------------------------------------------------------------

  const {
    run: createContract,
    isPending,
    error: createError,
  } = useCreateContract();
  const {
    run: sendContract,
    isPending: isSendingContract,
    error: errorSending,
  } = useSendContractHandler();
  const {
    run: runApproval,
    error: errorApproving,
    isPending: isApproving,
  } = useContractApprovalHandler();

  const {
    run: approveAndSend,
    error: approveAndSendError,
    isPending: isApprovingAndSending,
  } = useApproveAndSendHandler();

  const client = useQueryClient();

  // --------------------------------------------------------------------------
  const ContextualProps: Record<string, any> = {
    approve: {
      text: "Approve",
      loading: isApproving,
      disabled: isApproving,
      error: errorApproving,
      run: runApproval,
    },
    edit: { text: "Save Draft", loading: false, disabled: false },
    send: {
      text: "Send Contract",
      loading: isSendingContract,
      disabled: isSendingContract,
      run: sendContract,
      error: errorSending,
    },
    create: {
      text: "Create Contract",
      loading: isPending,
      disabled: isPending,
      run: createContract,
      error: createError,
    },
    approve_and_send: {
      text: "Approve & Send",
      loading: isApprovingAndSending,
      disabled: isApprovingAndSending,
      run: approveAndSend,
      error: approveAndSendError,
    },
  };

  const btnProps = ContextualProps[flag || "create"];
  const { text, run, error, ...props } = btnProps;

  // --------------------------------------------------------------------------

  const onSuccess = (response: any) => {
    client.refetchQueries({
      queryKey: [Q_LIST_ALL_CANDIDATE_CONTRACTS, candidate?.id || ""],
    });
    reset();
    close?.();
  };

  const submitForm = (data: any) => {
    let body: Record<string, any> = {
      ca_id: candidate?.id,
      co_id: candidateContract?.id,
    };
    if (flag === "create")
      body = {
        candidate_id: candidate?.id,
        contract: {
          company_contract_template_id: contract?.id,  // ✅ Updated to match API spec
          status: "draft",
          data,
        },
      };

    run(body, { onSuccess });
  };

  // ----------------------------------------------------------
  // const { ModalPortal, open,
  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {flag === "create" ? "Create Contract" : 
           flag === "send" ? "Send Contract" :
           flag === "approve" ? "Approve Contract" :
           flag === "approve_and_send" ? "Approve & Send Contract" :
           "Edit Contract"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Fill in the template variables for {contract?.name}
        </p>
        {formFields.length > 10 && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            📝 {formFields.length} fields to complete
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col h-full">
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-3">
          {formFields.map((field, index) => {
            return (
              <Fragment key={index}>
                {renderFormField(field, control, errors)}
              </Fragment>
            );
          })}
        </div>

        {/* Error Messages */}
        {error?.message && (
          <div className="flex-shrink-0 mt-2">
            <AppNotifications.Error message={error.message} />
          </div>
        )}

        {/* Fixed Footer with Actions */}
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
          <CustomButton variant={"outline"} onClick={() => close?.()}>
            Cancel
          </CustomButton>
          <CustomButton {...props} type="submit">
            {text}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}

export default InitialiseContract;
