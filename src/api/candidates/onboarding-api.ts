import { apiCall } from "../api-utils";
import { M_BULK_REMOVE_ONBOARDING_TASKS } from "../auth/constants";
import { API_CANDIDATES } from "../auth/routes";
import { useGenericMutation } from "../query";

const removeTasks = async (tasks: string[], ca_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/${ca_id}/onboarding_tasks/bulk_destroy`,
    { task_ids: tasks },
    { method: "DELETE" }
  );

  return obj?.data;
};

export const useBulkRemoveOnboardingTasks = () => {
  return useGenericMutation(
    [M_BULK_REMOVE_ONBOARDING_TASKS],
    ({ tasks, ca_id }: { tasks: string[]; ca_id: string }) =>
      removeTasks(tasks, ca_id)
  );
};
