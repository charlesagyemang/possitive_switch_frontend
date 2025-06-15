import { useCreateCompanyHandler } from "@/api/companies/company-api";
import CustomButton from "@/components/built/button/custom-button";
import { renderFormField } from "@/components/built/form/generator";
import { Button } from "@/components/ui/button";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";

const FORM_FIELDS = [
  {
    type: "text",
    name: "companyName",
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
function CompanyForm({ close }: { close?: () => void }) {
  const { isPending, error, run, isSuccess } = useCreateCompanyHandler();

  const handleCompanyCreation = (data: any) => {
    run(
      { company: data },
      {
        onSuccess: (data) => {
          // Handle successful company creation, e.g., redirect or show a success message
          console.log("Company created successfully", data);
          // if (close) {
          //   close();
          // }
        },
      }
    );
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
          <CustomButton loading={isPending}>Submit</CustomButton>
        </div>
      </div>
    </form>
  );
}

export default CompanyForm;
