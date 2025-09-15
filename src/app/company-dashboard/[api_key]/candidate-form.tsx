import { Q_LIST_CANDIDATES } from "@/api/auth/constants";
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
    label: "Full Name",
    placeholder: "Enter candidate's full name",
    required: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email Address",
    placeholder: "e.g. johndoe@email.com",
    required: true,
  },
  {
    type: "text",
    name: "job_title",
    label: "Job Title",
    placeholder: "e.g. Software Engineer",
    required: false,
  },
  {
    type: "text",
    name: "phone_number",
    label: "Phone Number",
    placeholder: "e.g. +1234567890",
    required: false,
  },
  {
    type: "text",
    name: "location",
    label: "Location",
    placeholder: "e.g. New York, NY",
    required: false,
  },
  {
    type: "date",
    name: "contract_date",
    label: "Contract Date",
    placeholder: "Select contract date",
    required: false,
  },
  {
    type: "date",
    name: "reporting_date",
    label: "Reporting Date",
    placeholder: "Select reporting date",
    required: false,
  },
  {
    type: "number",
    name: "salary",
    label: "Salary",
    placeholder: "e.g. 75000",
    required: false,
  },
];

function CandidateForm({
  companyId,
  close,
}: {
  companyId: string;
  close?: () => void;
}) {
  const { run, isPending, error } = useCreateCandidateHandler();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const client = useQueryClient();

  const onSuccess = () => {
    client.refetchQueries({ queryKey: [Q_LIST_CANDIDATES, companyId] });
    reset();
    close?.();
  };

  const handleCreate = (data: any) => {
    const body = {
      ...data,
      company_id: companyId,
    };
    run(body, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl mx-auto">
      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 mb-6">
        Add New Candidate
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FORM_FIELDS.map((field, index) => {
          return (
            <Fragment key={index}>
              {renderFormField(field, control, errors)}
            </Fragment>
          );
        })}
      </div>

      <div className="flex items-center w-full pt-4">
        <div className="flex items-center ml-auto gap-3">
          <Button onClick={() => close && close()} variant="outline" className="rounded-xl px-6 py-3">
            Cancel
          </Button>
          <CustomButton
            loading={isPending}
            className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
          >
            Create Candidate ✨
          </CustomButton>
        </div>
      </div>
      <AppNotifications.Error message={error?.message} />
    </form>
  );
}

export default CandidateForm;
