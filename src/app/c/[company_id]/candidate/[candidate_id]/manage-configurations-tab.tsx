import { Q_LOAD_ONE_CANDIDATE } from "@/api/auth/constants";
import { useBulkRemoveOnboardingTasks } from "@/api/candidates/onboarding-api";
import { ApiCandidate, Candidate } from "@/app/seed/candidates";
import { ApiOnBoardingTask, FullApiCandidate } from "@/app/types";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, X, Sparkles, Crown, Heart, Star, Gem, Settings } from "lucide-react";
import React from "react";

function Configuration({
  //   tasks,

  excluded = [],
  exclude,
  candidate,
  reset,
}: {
  //   tasks?: ApiOnBoardingTask[];
  candidate: FullApiCandidate;
  excluded?: ApiOnBoardingTask[];
  exclude: (tasks: ApiOnBoardingTask) => void;
  reset: () => void;
}) {
  const tasks: ApiOnBoardingTask[] = candidate?.onboarding_tasks || [];
  const client = useQueryClient();
  const { run, isPending, error } = useBulkRemoveOnboardingTasks();

  const handleSave = () => {
    run(
      {
        ca_id: candidate.id,
        tasks: excluded.map((task) => task.id),
      },
      {
        onSuccess: () => {
          reset();
          client.refetchQueries({
            queryKey: [Q_LOAD_ONE_CANDIDATE, candidate.id],
          });
        },
      }
    );
  };
  return (
    <div className="py-4">
      <AppNotifications.Error message={error?.message} />
      
      {/* Beautiful Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-pink-200/50 dark:border-purple-500/30 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600">
                Task Configurations ✨
              </h3>
              <p className="text-purple-600 dark:text-purple-300 font-medium">
                Customize onboarding tasks for {candidate?.name} 💎
              </p>
            </div>
          </div>
          
          {excluded?.length ? (
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-700/30">
                <span className="font-bold text-orange-700 dark:text-orange-300">
                  {excluded.length} excluded ⚠️
                </span>
              </div>
              <CustomButton
                onClick={handleSave}
                disabled={isPending}
                loading={isPending}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                Save Changes ✨
              </CustomButton>
            </div>
          ) : null}
        </div>
      </div>

      <div className="my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => {
            const isExcluded = excluded.some(
              (excludedTask) => excludedTask.id === task.id
            );

            const gradients = [
              "from-pink-400 via-rose-400 to-red-400",
              "from-purple-400 via-violet-400 to-indigo-400", 
              "from-blue-400 via-cyan-400 to-teal-400",
              "from-green-400 via-emerald-400 to-lime-400"
            ];
            const sparkleIcons = [Heart, Star, Gem, Sparkles];
            const SparkleIcon = sparkleIcons[index % sparkleIcons.length];

            return (
              <div
                key={task.id}
                className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl dark:hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 rounded-3xl overflow-hidden relative ${
                  isExcluded ? "opacity-60 grayscale" : ""
                }`}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <CustomTooltip
                        tip={
                          isExcluded
                            ? "Add this task back ➕"
                            : "Exclude this task ❌"
                        }
                      >
                        <span
                          onClick={() => exclude(task)}
                          className={`cursor-pointer inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg ${
                            isExcluded 
                              ? "bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500" 
                              : "bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500"
                          }`}
                        >
                          {isExcluded ? (
                            <X className="text-white w-6 h-6" />
                          ) : (
                            <CheckCircle className="text-white w-6 h-6" />
                          )}
                        </span>
                      </CustomTooltip>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-bold transition-all duration-300 ${
                          isExcluded 
                            ? "text-gray-500 dark:text-gray-400 line-through" 
                            : "text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600"
                        }`}>
                          {task.onboarding_task_template.title}
                        </h3>
                        {!isExcluded && (
                          <SparkleIcon className="w-4 h-4 text-pink-400 dark:text-pink-300 animate-pulse" />
                        )}
                      </div>
                      
                      <div className={`text-sm font-medium ${
                        isExcluded 
                          ? "text-red-500 dark:text-red-400" 
                          : "text-emerald-500 dark:text-emerald-400"
                      }`}>
                        {isExcluded ? "Excluded ❌" : "Included ✅"}
                      </div>
                    </div>
                  </div>
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
