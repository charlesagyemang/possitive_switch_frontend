import { ApiCandidate } from "@/app/seed/candidates";
import { ApiContractTemplate } from "@/app/seed/contracts";
import CustomButton from "@/components/built/button/custom-button";
import { renderFormField } from "@/components/built/form/generator";
import { TEMPLATE_FORM_KEYS } from "@/lib/constants";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";

type Variable = { name: string; type: string };
function InitialiseContract({
  close,
  candidate,
  contract,
}: {
  close?: () => void;
  candidate?: ApiCandidate;
  contract?: ApiContractTemplate;
}) {
  const variables = contract?.variables || [];
  const formFields = variables.map((variable: Variable) => {
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
    defaultValues: { CANDIDATE_NAME: candidate?.name || "" },
  });

  const saveDraft = (data: any) => {
    console.log("Draft Data", data);
  };
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
      <div className="mt-2 flex gap-2 justify-end">
        <CustomButton variant={"outline"} onClick={() => close?.()}>
          Cancel
        </CustomButton>
        <CustomButton type="submit">Create</CustomButton>
      </div>
    </form>
  );
}

export default InitialiseContract;
