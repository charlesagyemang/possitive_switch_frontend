import { Q_LIST_ALL_CANDIDATE_CONTRACTS } from "@/api/auth/constants";
import { useCreateContract } from "@/api/candidates/contracts-api";
import { ApiCandidate } from "@/app/seed/candidates";
import { ApiContractTemplate, ContractVariable } from "@/app/seed/contracts";
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
}: {
  close?: () => void;
  candidate?: ApiCandidate;
  contract?: ApiContractTemplate;
  flag?: string;
  data?: Record<string, any>;
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

  const { run, isPending, error } = useCreateContract();

  const client = useQueryClient();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<any>({
    defaultValues: { CANDIDATE_NAME: candidate?.name || "" },
  });

  const saveDraft = (data: any) => {
    console.log("Draft Data", data);

    const body = {
      candidate_id: candidate?.id,
      contract: {
        contract_template_id: contract?.id,
        status: "draft",
        data,
      },
    };

    run(body, {
      onSuccess: (response) => {
        client.refetchQueries({
          queryKey: [Q_LIST_ALL_CANDIDATE_CONTRACTS, candidate?.id || ""],
        });
        console.log("Contract created successfully", response);
        reset();
        close?.();
      },
    });
  };

  //   ---------------------------------------------------------

  const ContextualProps: Record<string, any> = {
    approve: { text: "Approve", loading: false, disabled: false },
    edit: { text: "Save Draft", loading: false, disabled: false },
    send: { text: "Send Contract", loading: false, disabled: false },
    create: { text: "Create Contract", loading: false, disabled: false },
    approve_and_send: {
      text: "Approve & Send",
      loading: false,
      disabled: false,
    },
  };

  const btnProps = ContextualProps[flag || "create"];
  const { text, ...props } = btnProps;

  // ----------------------------------------------------------
  // const { ModalPortal, open,
  return (
    <form onSubmit={handleSubmit(saveDraft)}>
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
