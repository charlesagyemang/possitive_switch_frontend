import { Q_LOAD_ONE_CANDIDATE } from "@/api/auth/constants";
import { useBulkRemoveOnboardingTasks, useBulkCreateOnboardingTasks } from "@/api/candidates/onboarding-api";
import { useOnboardingTaskTemplates } from "@/api/companies/company-api";
import { ApiCandidate } from "@/app/seed/candidates";
import { ApiOnBoardingTask, FullApiCandidate, OnBoardingTaskTemplate } from "@/app/types";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, X, Sparkles, Crown, Heart, Star, Gem, Settings, Search } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

function CompanyConfigurationTab({
  excluded = [],
  exclude,
  candidate,
  reset,
  companyId,
}: {
  candidate: FullApiCandidate;
  excluded?: ApiOnBoardingTask[];
  exclude: (tasks: ApiOnBoardingTask) => void;
  reset: () => void;
  companyId?: string;
}) {
  const client = useQueryClient();
  const { run, isPending, error } = useBulkRemoveOnboardingTasks();
  const { run: createTasks, isPending: isCreatingTasks } = useBulkCreateOnboardingTasks();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch company onboarding task templates
  const { data: companyTemplates = [], isLoading: loadingTemplates } = useOnboardingTaskTemplates(companyId || "") as { data: OnBoardingTaskTemplate[], isLoading: boolean };

  // Memoize tasks to prevent unnecessary re-renders
  const tasks = useMemo(() => candidate?.company_onboarding_tasks || [], [candidate?.company_onboarding_tasks]);

  // Get template IDs that are already used as tasks
  const usedTemplateIds = useMemo(() => 
    tasks.map(task => task.company_onboarding_task_template_id).filter(Boolean),
    [tasks]
  );

  // Available templates (not yet created as tasks for this candidate)
  const availableTemplates = useMemo(() => 
    companyTemplates.filter(template => !usedTemplateIds.includes(template.id)),
    [companyTemplates, usedTemplateIds]
  );

  // Filter tasks and templates based on search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    
    return tasks.filter(task => 
      task.company_onboarding_task_template?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const filteredAvailableTemplates = useMemo(() => {
    if (!searchTerm.trim()) return availableTemplates;
    
    return availableTemplates.filter(template => 
      template.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableTemplates, searchTerm]);

  // Separate filtered tasks into enabled and disabled
  const enabledTasks = useMemo(() => 
    filteredTasks.filter(task => !excluded.some(excludedTask => excludedTask.id === task.id)),
    [filteredTasks, excluded]
  );

  const disabledTasks = useMemo(() => 
    excluded.filter(task => 
      filteredTasks.some(filteredTask => filteredTask.id === task.id)
    ),
    [excluded, filteredTasks]
  );

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

  const handleAddTemplate = (templateId: string) => {
    createTasks(
      {
        candidate_id: candidate.id,
        template_ids: [templateId],
      },
      {
        onSuccess: () => {
          client.refetchQueries({
            queryKey: [Q_LOAD_ONE_CANDIDATE, candidate.id],
          });
          AppNotifications.Success({ message: "Template added successfully! ✨" });
        },
        onError: () => {
          AppNotifications.Error({ message: "Failed to add template. Please try again." });
        },
      }
    );
  };
  
  return (
    <div className="py-4">
      <AppNotifications.Error message={error?.message} />
      
      {/* Floating Save Button */}
      {excluded?.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-purple-200/50 dark:border-purple-500/30">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-xl border border-orange-200 dark:border-orange-700/30">
                <span className="font-bold text-orange-700 dark:text-orange-300 text-sm">
                  {excluded.length} excluded ⚠️
                </span>
              </div>
              <CustomButton
                onClick={handleSave}
                disabled={isPending}
                loading={isPending}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm"
              >
                Save Changes ✨
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-pink-200/50 dark:border-purple-500/30 mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-500" />
          <Input
            placeholder="Search tasks by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-purple-200 dark:border-purple-600/30 focus:border-purple-400 dark:bg-gray-700 dark:text-white rounded-xl"
          />
          {searchTerm && (
            <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">
              {filteredTasks.length} of {tasks.length} tasks
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700/30 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Enabled Tasks</h4>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {searchTerm ? enabledTasks.length : tasks.length - excluded.length}
              </p>
              {searchTerm && (
                <p className="text-xs text-emerald-500 dark:text-emerald-400">
                  (filtered from {tasks.length - excluded.length} total)
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700/30 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl flex items-center justify-center">
              <X className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-800 dark:text-red-300">Available Templates</h4>
              <p className="text-2xl font-black text-red-600 dark:text-red-400">
                {searchTerm ? filteredAvailableTemplates.length : availableTemplates.length}
              </p>
              {searchTerm && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  (filtered from {availableTemplates.length} total)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-6">
        {/* Enabled Tasks Section */}
        {enabledTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                Enabled Tasks ({enabledTasks.length})
                {searchTerm && (
                  <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 ml-2">
                    (filtered)
                  </span>
                )}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enabledTasks.map((task, index) => {
                  const gradients = [
                    "from-emerald-400 via-green-400 to-teal-400",
                    "from-blue-400 via-cyan-400 to-teal-400",
                    "from-purple-400 via-violet-400 to-indigo-400",
                    "from-pink-400 via-rose-400 to-red-400"
                  ];
                  const sparkleIcons = [Heart, Star, Gem, Sparkles];
                  const SparkleIcon = sparkleIcons[index % sparkleIcons.length];

                  return (
                    <div
                      key={task.id}
                      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-emerald-200 dark:border-emerald-700/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden relative"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-green-600 transition-all duration-300">
                                {task.company_onboarding_task_template?.title || 
                                 task.onboarding_task_template?.title || 
                                 task.title || 
                                 `Task ${task.id}` || 
                                 'Untitled Task'}
                              </h4>
                              <SparkleIcon className="w-3 h-3 text-emerald-400 dark:text-emerald-300 animate-pulse" />
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              ✅ Enabled
                            </div>
                          </div>
                          
                          <CustomTooltip tip="Disable this task">
                            <div
                              onClick={() => exclude(task)}
                              className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md cursor-pointer"
                            >
                              <X className="w-4 h-4 text-white" />
                            </div>
                          </CustomTooltip>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Available Templates Section */}
        {filteredAvailableTemplates.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                Available Templates ({filteredAvailableTemplates.length})
                {searchTerm && (
                  <span className="text-sm font-normal text-blue-600 dark:text-blue-400 ml-2">
                    (filtered)
                  </span>
                )}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailableTemplates.map((template, index) => {
                const gradients = [
                  "from-blue-400 via-purple-400 to-indigo-400",
                  "from-purple-400 via-pink-400 to-rose-400",
                  "from-indigo-400 via-blue-400 to-cyan-400",
                  "from-cyan-400 via-teal-400 to-emerald-400"
                ];
                const sparkleIcons = [Heart, Star, Gem, Sparkles];
                const SparkleIcon = sparkleIcons[index % sparkleIcons.length];

                return (
                  <div
                    key={template.id}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-blue-200 dark:border-blue-700/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden relative"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                              {template.title}
                            </h4>
                            <SparkleIcon className="w-3 h-3 text-blue-400 dark:text-blue-300 animate-pulse" />
                          </div>
                          <div className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                            ➕ Available to Add
                          </div>
                        </div>
                        
                        <CustomTooltip tip="Add this template as a task">
                          <div
                            onClick={() => !isCreatingTasks && handleAddTemplate(template.id)}
                            className={`w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md ${
                              isCreatingTasks ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          >
                            {isCreatingTasks ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </CustomTooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searchTerm && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-pink-200/50 dark:border-purple-500/30">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                No tasks match your search for &quot;{searchTerm}&quot;
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyConfigurationTab;