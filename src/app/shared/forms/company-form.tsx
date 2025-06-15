import { Q_LIST_COMPANIES } from "@/api/auth/constants";
import { useCreateCompanyHandler } from "@/api/companies/company-api";
import { Company } from "@/app/seed/companies";
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
    label: "Company Name",
    placeholder: "Enter your company name",
    required: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "e.g. Microsoft Company",
    required: true,
  },
  {
    type: "text",
    name: "phone_number",
    label: "Phone Number",
    placeholder: "e.g. +233 123 456 789",
    required: true,
  },
  {
    type: "text",
    name: "location",
    label: "Location",
    placeholder: "e.g. Johannesburg, South Africa",
    required: true,
  },
];
function CompanyForm({ close, data }: { close?: () => void; data?: Company }) {
  const { isPending, run, isSuccess } = useCreateCompanyHandler();
  const client = useQueryClient();

  const isEditMode = !!data;

  const onSuccess = (data: any) => {
    console.log("Company created successfully", data);
    client.refetchQueries({
      queryKey: [Q_LIST_COMPANIES],
    });
  };
  const handleCompanyCreation = (data: any) => {
    run({ company: data }, { onSuccess });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({ defaultValues: data || {} });
  return (
    <form onSubmit={handleSubmit(handleCompanyCreation)} className="">
      {FORM_FIELDS.map((field, index) => {
        return (
          <Fragment key={index}>
            {renderFormField(field, control, errors)}
          </Fragment>
        );
      })}
      <div className="flex items-center w-full pt-2">
        <div className="flex items-center ml-auto gap-2">
          <Button onClick={() => close && close()} variant="outline">
            Cancel
          </Button>
          <CustomButton loading={isPending}>
            {isEditMode ? "Update" : "Submit"}
          </CustomButton>
        </div>
      </div>
    </form>
  );
}

export default CompanyForm;
