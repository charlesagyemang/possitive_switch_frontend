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
  const formFields = variables.map((variable: ContractVariable) => {
    const formFieldType = TEMPLATE_FORM_KEYS[variable.type];
    const cleanName = variable.name?.split("_").join(" ").toLowerCase();
    return {
      name: variable.name,
      type: formFieldType,
      placeholder: `Enter ${cleanName}...`,
      label: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      required: true,
    };
  });
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
    console.log("Contract created successfully", response);
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
          contract_template_id: contract?.id,
          status: "draft",
          data,
        },
      };

    console.log("Submitting form", body, flag);

    run(body, { onSuccess });
  };

  //   ---------------------------------------------------------

  // ----------------------------------------------------------
  // const { ModalPortal, open,
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="flex flex-col gap-1">
        {formFields.map((field, index) => {
          return (
            <Fragment key={index}>
              {renderFormField(field, control, errors)}
            </Fragment>
          );
        })}
      </div>
      <div className="mt-1">
        <AppNotifications.Error message={error?.message || null} />
      </div>
      <div className="mt-2 flex gap-2 justify-end">
        <CustomButton variant={"outline"} onClick={() => close?.()}>
          Cancel
        </CustomButton>
        <CustomButton {...props} type="submit">
          {text}
        </CustomButton>
      </div>
    </form>
  );
}

export default InitialiseContract;
