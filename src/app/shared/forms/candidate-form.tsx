import { Q_LIST_CANDIDATES, Q_LOAD_ONE_CANDIDATE } from "@/api/auth/constants";
import { useCreateCandidateHandler } from "@/api/candidates/candidates-api";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import { renderFormField } from "@/components/built/form/generator";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";

const FORM_FIELDS = [
  {
    type: "text",
    name: "name",
    label: "Name",
    placeholder: "Enter your name",
    required: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "e.g. johndoe@email.com",
    required: true,
  },
  // {
  //   type: "date",
  //   name: "contract_date",
  //   label: "Contract Date",
  //   placeholder: "Select contract date",
  //   required: true,
  // },
  // {
  //   type: "text",
  //   name: "job_title",
  //   label: "Job Title",
  //   placeholder: "e.g. Software Engineer",
  //   required: true,
  // },
  // {
  //   type: "date",
  //   name: "reporting_date",
  //   label: "Reporting Date",
  //   placeholder: "Select reporting date",
  //   required: true,
  // },
  // {
  //   type: "number",
  //   name: "salary",
  //   label: "Salary",
  //   placeholder: "e.g. 50000",
  //   required: true,
  // },
];
function CandidateForm({
  close,
  companyId,
}: {
  close?: () => void;
  companyId?: string;
}) {
  const { run, isPending, error } = useCreateCandidateHandler();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const client = useQueryClient();

  const onSuccess = () => {
    client.refetchQueries({ queryKey: [Q_LIST_CANDIDATES, companyId] });
    close?.();
  };
  const handleCreation = (data: any) => {
    const body = {
      company_id: companyId,
      candidate: data,
    };
    run(body, { onSuccess });
  };
  return (
    <form onSubmit={handleSubmit(handleCreation)} className="">
      {FORM_FIELDS.map((field, index) => {
        return (
          <Fragment key={index}>
            {renderFormField(field, control, errors)}
          </Fragment>
        );
      })}
      <div className="flex items-center w-full pt-2 mb-2">
        <div className="flex items-center ml-auto gap-2">
          <Button onClick={() => close && close()} variant="outline">
            Cancel
          </Button>
          <CustomButton loading={isPending}>Submit</CustomButton>
        </div>
      </div>
      <AppNotifications.Error message={error?.message} />
    </form>
  );
}

export default CandidateForm;
