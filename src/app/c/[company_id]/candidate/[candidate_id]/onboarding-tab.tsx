import { Q_LOAD_ONE_CANDIDATE } from "@/api/auth/constants";
import { useBulkTaskCheck } from "@/api/candidates/onboarding-api";
import { ApiCandidate } from "@/app/seed/candidates";
import { ApiOnBoardingTask } from "@/app/types";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Circle, CircleFadingArrowUp } from "lucide-react";
import React from "react";

function OnboardingTab({
  tasks,
  checked,
  markAsChecked,
  candidate,
  reset,
}: {
  tasks?: ApiOnBoardingTask[];
  checked?: ApiOnBoardingTask[];
  markAsChecked?: (task: ApiOnBoardingTask) => void;
  candidate: ApiCandidate;
  reset?: () => void;
}) {
  const { run, isPending, error } = useBulkTaskCheck();
  const client = useQueryClient();

  const saveChanges = () => {
    run(
      {
        candidate_id: candidate.id,
        ids: checked?.map((t) => t.id),
      },
      {
        onSuccess: () => {
          client.refetchQueries({
            queryKey: [Q_LOAD_ONE_CANDIDATE, candidate.id],
          });
          reset?.();
        },
      }
    );
  };

  const checkedAndSaved = tasks?.filter((task) => task.status === "done");

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 max-w-2xl mt-4 shadow-xl dark:shadow-purple-500/25 border-0 mx-auto">
      <AppNotifications.Error message={error?.message} lite />
      <h2 className="text-3xl flex items-center font-extrabold mb-8 gap-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 tracking-tight">
        ✨ Onboarding Steps{" "}
        {!!checked?.length ? (
          <CustomButton
            variant={"outline"}
            className="ml-auto font-semibold bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            loading={isPending}
            onClick={saveChanges}
            disabled={isPending}
          >
            Save Changes ({checked.length}) ✨
          </CustomButton>
        ) : (
          <span className="ml-auto opacity-60 font-normal text-xl text-purple-500 dark:text-purple-300">
            {checkedAndSaved?.length}/{tasks?.length} 💎
          </span>
        )}
      </h2>
      <div>
        {tasks && tasks.length > 0 ? (
          <ol className="relative space-y-6">
            {tasks.map((task, idx) => {
              const checkButUnsaved = checked?.some((t) => t.id === task.id);
              const isChecked = task.status === "done";
              // const isChecked = true;

              let classes, Icon, bgClasses;
              if (isChecked) {
                classes = "text-emerald-500";
                bgClasses = "bg-emerald-100 dark:bg-emerald-900/30";
                Icon = CheckCircle;
              } else if (checkButUnsaved) {
                classes = "text-orange-500";
                bgClasses = "bg-orange-100 dark:bg-orange-900/30";
                Icon = CircleFadingArrowUp;
              } else {
                classes = "text-purple-500 dark:text-purple-400";
                bgClasses = "bg-purple-50 dark:bg-purple-900/20";
                Icon = Circle;
              }

              return (
                <li
                  key={task.id || idx}
                  className={`cursor-pointer group transition-all duration-300 hover:scale-[1.02] ${bgClasses} rounded-2xl p-4 border border-transparent hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-lg dark:hover:shadow-purple-500/25`}
                >
                  <div
                    className="flex items-center gap-4"
                    onClick={() => markAsChecked?.(task)}
                  >
                    <span className="flex-shrink-0 cursor-pointer">
                      <Icon
                        size={28}
                        className={`${classes} group-hover:scale-110 transition-all duration-300 drop-shadow-sm`}
                      />
                    </span>
                    <CustomTooltip
                      tip={
                        checkButUnsaved
                          ? "Unsaved changes - click save! ⏳"
                          : isChecked
                          ? "Task completed! ✅"
                          : "Click to mark as done 💫"
                      }
                    >
                      <span
                        className={`text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300 ${isChecked ? "line-through opacity-75" : ""}`}
                      >
                        {task.onboarding_task_template.title}
                      </span>
                    </CustomTooltip>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 dark:text-gray-500 text-lg">✨ No onboarding tasks yet!</p>
            <p className="text-gray-300 dark:text-gray-600 text-sm mt-2">Tasks will appear here when assigned 💫</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingTab;
