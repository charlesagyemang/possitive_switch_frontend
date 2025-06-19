import { ApiOnBoardingTask } from "@/app/types";
import { CheckCircle, Circle } from "lucide-react";
import React from "react";

function OnboardingTab({ tasks }: { tasks?: ApiOnBoardingTask[] }) {
  return (
    <div className="bg-gradient-to-br rounded-2xl p-10 max-w-xl mt-4 bg-white shadow-sm  mx-auto">
      <h2 className="text-3xl flex items-center font-extrabold mb-8 text-primary  tracking-tight ">
        Onboarding Steps{" "}
        <span className="ml-auto opacity-40 font-normal text-xl">
          0/{tasks?.length}
        </span>
      </h2>
      <div>
        {tasks && tasks.length > 0 ? (
          <ol className="relative space-y-6">
            {tasks.map((task, idx) => (
              <li
                key={task.id || idx}
                className=" cursor-pointer flex items-start gap-5 group"
              >
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0">
                    {/* @ts-ignore */}
                    <Circle
                      size={24}
                      className="   group-hover:scale-110 group-hover:text-primary transition-transform duration-200"
                    />
                  </span>
                  <span className="text-md font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {task.onboarding_task_template.title}
                  </span>
                  {/* {task.onboarding_task_template.description && (
                  <p className="text-gray-500 text-sm mt-2">
                    {task.onboarding_task_template.description}
                  </p>
                )} */}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-400 text-center">No onboarding tasks.</p>
        )}
      </div>
    </div>
  );
}

export default OnboardingTab;
