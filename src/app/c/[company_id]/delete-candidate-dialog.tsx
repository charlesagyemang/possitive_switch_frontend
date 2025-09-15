import { Q_LIST_CANDIDATES } from "@/api/auth/constants";
import { useDeleteCandidateHandler } from "@/api/candidates/candidates-api";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2, X } from "lucide-react";
import React from "react";
import { ApiCandidate } from "@/app/seed/candidates";

function DeleteCandidateDialog({
  close,
  candidate,
  companyId,
}: {
  close?: () => void;
  candidate: ApiCandidate;
  companyId?: string;
}) {
  const { run, isPending, error } = useDeleteCandidateHandler();
  const client = useQueryClient();

  const onSuccess = () => {
    client.refetchQueries({ queryKey: [Q_LIST_CANDIDATES, companyId] });
    close?.();
  };

  const handleDelete = () => {
    run(candidate.id, { onSuccess });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Delete Candidate ⚠️
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This action cannot be undone
          </p>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">
              Are you sure you want to delete this candidate?
            </h3>
            <div className="text-sm text-red-700 dark:text-red-400 space-y-1">
              <p><strong>Name:</strong> {candidate.name}</p>
              <p><strong>Email:</strong> {candidate.email}</p>
              {candidate.job_title && (
                <p><strong>Job Title:</strong> {candidate.job_title}</p>
              )}
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
              ⚠️ This will permanently remove the candidate and all associated data.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center w-full gap-3">
        <Button 
          onClick={() => close && close()} 
          variant="outline"
          className="flex-1"
          disabled={isPending}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <CustomButton 
          onClick={handleDelete}
          loading={isPending}
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
        >
          {isPending ? "Deleting..." : "Delete Candidate 🗑️"}
        </CustomButton>
      </div>
      
      <AppNotifications.Error message={error?.message} />
    </div>
  );
}

export default DeleteCandidateDialog;
