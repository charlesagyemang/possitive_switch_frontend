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
        onSuccess: (response) => {
          console.log("Tasks updated successfully", response);
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
    <div className="bg-gradient-to-br rounded-2xl p-10 max-w-xl mt-4 bg-white shadow-sm  mx-auto">
      <AppNotifications.Error message={error?.message} lite />
      <h2 className="text-3xl flex items-center font-extrabold mb-8 gap-2 text-primary  tracking-tight ">
        Onboarding Steps{" "}
        {!!checked?.length ? (
          <CustomButton
            variant={"outline"}
            className="ml-auto font-semibold text-black"
            loading={isPending}
            onClick={saveChanges}
            disabled={isPending}
          >
            Save Changes ({checked.length})
          </CustomButton>
        ) : (
          <span className="ml-auto opacity-40 font-normal text-xl">
            {checkedAndSaved?.length}/{tasks?.length}
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

              let classes, Icon;
              if (isChecked) {
                classes = "text-primary";
                Icon = CheckCircle;
              } else if (checkButUnsaved) {
                classes = "text-orange-600";
                Icon = CircleFadingArrowUp;
              } else {
                classes = "text-gray-900";
                Icon = Circle;
              }

              return (
                <li
                  key={task.id || idx}
                  className=" cursor-pointer flex items-start gap-5 group"
                >
                  <div
                    className="flex items-center gap-4"
                    onClick={() => markAsChecked?.(task)}
                  >
                    <span className="flex-shrink-0 cursor-pointer">
                      <Icon
                        size={24}
                        className={` ${classes} group-hover:scale-110 group-hover:text-primary transition-transform duration-200`}
                      />
                      {/* {isChecked ? (
                        <CheckCircle
                          size={24}
                          className={` ${
                            isChecked ? "text-primary" : ""
                          } group-hover:scale-110 group-hover:text-primary transition-transform duration-200`}
                        />
                      ) : (
                        <Circle
                          size={24}
                          className={`${
                            isChecked ? "text-primary" : ""
                          }  group-hover:scale-110 group-hover:text-primary transition-transform duration-200`}
                        />
                      )} */}
                    </span>
                    <CustomTooltip
                      tip={
                        checkButUnsaved
                          ? "Unsaved changes"
                          : isChecked
                          ? "Task completed"
                          : "Click to mark as done"
                      }
                    >
                      <span
                        className={` ${classes} text-md font-semibold text-gray-900 group-hover:text-primary transition-colors`}
                      >
                        {task.onboarding_task_template.title}
                      </span>
                    </CustomTooltip>
                    {/* {task.onboarding_task_template.description && (
                  <p className="text-gray-500 text-sm mt-2">
                    {task.onboarding_task_template.description}
                  </p>
                )} */}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-gray-400 text-center">No onboarding tasks.</p>
        )}
      </div>
    </div>
  );
}

export default OnboardingTab;
