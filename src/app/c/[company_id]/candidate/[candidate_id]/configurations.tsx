import { ApiCandidate, Candidate } from "@/app/seed/candidates";
import { ApiOnBoardingTask, FullApiCandidate } from "@/app/types";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";
import React from "react";

function Configuration({
  //   tasks,
  candidate,
}: {
  //   tasks?: ApiOnBoardingTask[];
  candidate: FullApiCandidate;
}) {
  const tasks: ApiOnBoardingTask[] = candidate?.onboarding_tasks || [];
  return (
    <div className="py-4">
      <p className="text-gray-600">
        Uncheck all the options that do not apply to {candidate?.name}
      </p>

      <div className="my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="relative p-6 bg-white  rounded-sm shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group"
            >
              <div className="flex-shrink-0 ">
                <CustomTooltip tip="Uncheck if this task is not applicable">
                  <span className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 group-hover:bg-green-200 transition-colors">
                    {/* CheckCircle icon */}
                    <CheckCircle className="text-green-700" />
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Configuration;
