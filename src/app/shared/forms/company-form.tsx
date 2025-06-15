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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="">
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
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
}

export default CompanyForm;
