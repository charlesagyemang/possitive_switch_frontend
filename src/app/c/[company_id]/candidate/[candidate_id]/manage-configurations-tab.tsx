import { ApiCandidate, Candidate } from "@/app/seed/candidates";
import { ApiOnBoardingTask, FullApiCandidate } from "@/app/types";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { CheckCircle, X } from "lucide-react";
import React from "react";

function Configuration({
  //   tasks,

  excluded = [],
  exclude,
  candidate,
}: {
  //   tasks?: ApiOnBoardingTask[];
  candidate: FullApiCandidate;
  excluded?: ApiOnBoardingTask[];
  exclude: (tasks: ApiOnBoardingTask) => void;
}) {
  const tasks: ApiOnBoardingTask[] = candidate?.onboarding_tasks || [];
  return (
    <div className="py-4">
      <div className="flex items-center gap-4 mb-6">
        <p className="text-gray-600">
          Uncheck all the options that do not apply to {candidate?.name}
        </p>
        {excluded?.length ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="font-semibold">{excluded.length} excluded</span>
            <CustomButton>Save </CustomButton>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const isExcluded = excluded.some(
              (excludedTask) => excludedTask.id === task.id
            );

            return (
              <div
                key={task.id}
                className={` ${
                  isExcluded ? "opacity-50" : ""
                } relative p-6  rounded-sm ${
                  isExcluded
                    ? "border border-purple-100 hover:opacity-100 hover:bg-white"
                    : "shadow-sm bg-white"
                } hover:shadow-lg transition-all flex items-center gap-4 group`}
              >
                <div className="flex-shrink-0 ">
                  <CustomTooltip
                    tip={
                      isExcluded
                        ? "Add this item back"
                        : "Uncheck if this task is not applicable"
                    }
                  >
                    <span
                      onClick={() => exclude(task)}
                      className={`cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full ${
                        isExcluded ? "bg-red-50" : "bg-green-50"
                      } group-hover:${
                        isExcluded ? "bg-red-200" : "bg-green-200"
                      } transition-colors`}
                    >
                      {/* CheckCircle icon */}
                      {isExcluded ? (
                        <X className="text-red-700" />
                      ) : (
                        <CheckCircle className="text-green-700" />
                      )}
                    </span>
                  </CustomTooltip>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-1">
                    {task.onboarding_task_template.title}
                  </h3>
                  {/* <p className="text-sm text-gray-500">{task.description}</p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Configuration;
