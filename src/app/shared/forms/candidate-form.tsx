import { renderFormField } from "@/components/built/form/generator";
import { Button } from "@/components/ui/button";
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
    {
        type: "date",
        name: "contract_date",
        label: "Contract Date",
        placeholder: "Select contract date",
        required: true,
    },
    {
        type: "text",
        name: "job_title",
        label: "Job Title",
        placeholder: "e.g. Software Engineer",
        required: true,
    },
    {
        type: "date",
        name: "reporting_date",
        label: "Reporting Date",
        placeholder: "Select reporting date",
        required: true,
    },
    {
        type: "number",
        name: "salary",
        label: "Salary",
        placeholder: "e.g. 50000",
        required: true,
    },
];
function CandidateForm({ close }: { close?: () => void }) {
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

export default CandidateForm;
