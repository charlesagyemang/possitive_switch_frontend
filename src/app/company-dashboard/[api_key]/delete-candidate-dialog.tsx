import { Q_LIST_CANDIDATES } from "@/api/auth/constants";
import { useDeleteCandidateHandler } from "@/api/candidates/candidates-api";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { Trash, User, AlertTriangle } from "lucide-react";
import React from "react";
import { ApiCandidate } from "@/app/seed/candidates";

function DeleteCandidateDialog({
  close,
  candidate,
  companyId,
}: {
  close?: () => void;
  candidate: ApiCandidate;
  companyId: string;
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
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-auto">
      <div className="text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Delete Candidate
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this candidate? This action cannot be undone.
        </p>

        {/* Candidate Info */}
        <Card className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {candidate.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                {candidate.job_title && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.job_title}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Message */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Warning
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This will permanently delete the candidate and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={close}
            variant="outline"
            className="flex-1 rounded-xl px-6 py-3"
            disabled={isPending}
          >
            Cancel
          </Button>
          <CustomButton
            onClick={handleDelete}
            loading={isPending}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete Candidate
          </CustomButton>
        </div>

        {/* Error Message */}
        <AppNotifications.Error message={error?.message} />
      </div>
    </div>
  );
}

export default DeleteCandidateDialog;
