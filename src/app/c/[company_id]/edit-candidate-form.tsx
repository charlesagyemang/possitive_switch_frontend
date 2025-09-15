import { Q_LIST_CANDIDATES, Q_LOAD_ONE_CANDIDATE } from "@/api/auth/constants";
import { useEditCandidateHandler } from "@/api/candidates/candidates-api";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import { renderFormField } from "@/components/built/form/generator";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import React, { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ApiCandidate } from "@/app/seed/candidates";

const FORM_FIELDS = [
  {
    type: "text",
    name: "name",
    label: "Name",
    placeholder: "Enter candidate name",
    required: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "e.g. johndoe@email.com",
    required: true,
  },
];

function EditCandidateForm({
  close,
  candidate,
  companyId,
}: {
  close?: () => void;
  candidate: ApiCandidate;
  companyId?: string;
}) {
  const { run, isPending, error } = useEditCandidateHandler();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const client = useQueryClient();

  // Set initial values when candidate data is available
  useEffect(() => {
    if (candidate) {
      reset({
        name: candidate.name || "",
        email: candidate.email || "",
      });
    }
  }, [candidate, reset]);

  const onSuccess = () => {
    client.refetchQueries({ queryKey: [Q_LIST_CANDIDATES, companyId] });
    client.refetchQueries({ queryKey: [Q_LOAD_ONE_CANDIDATE, candidate.id] });
    close?.();
  };

  const handleEdit = (data: any) => {
    const body = {
      id: candidate.id,
      candidate: data,
    };
    run(body, { onSuccess });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Candidate ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update candidate information
        </p>
      </div>
      
      <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
        {FORM_FIELDS.map((field, index) => {
          return (
            <Fragment key={index}>
              {renderFormField(field, control, errors)}
            </Fragment>
          );
        })}
        
        <div className="flex items-center w-full pt-4 gap-3">
          <Button 
            onClick={() => close && close()} 
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <CustomButton 
            loading={isPending}
            className="flex-1 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
          >
            {isPending ? "Updating..." : "Update Candidate ✨"}
          </CustomButton>
        </div>
        
        <AppNotifications.Error message={error?.message} />
      </form>
    </div>
  );
}

export default EditCandidateForm;
