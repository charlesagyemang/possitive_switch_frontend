import { apiCall } from "../api-utils";
import { API_CANDIDATES } from "../auth/routes";
import { PUI_TOKEN } from "../constants";
import { useGenericMutation, useGenericQuery } from "../query";

// Candidate Checklist API Endpoints
const candidateChecklistEndpoints = {
  list: (candidateId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists`,
  create: (candidateId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists`,
  show: (candidateId: string, checklistId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/${checklistId}`,
  update: (candidateId: string, checklistId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/${checklistId}`,
  delete: (candidateId: string, checklistId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/${checklistId}`,
  complete: (candidateId: string, checklistId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/${checklistId}/complete`,
  download: (candidateId: string, checklistId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/${checklistId}/download`,
  uploadFile: (candidateId: string, checklistId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/${checklistId}/upload_file`,
  bulkCreate: (candidateId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/bulk_create`,
  bulkDestroy: (candidateId: string) => `${API_CANDIDATES}/${candidateId}/candidate_checklists/bulk_destroy`,
};

// Types
export interface CandidateChecklist {
  id: string;
  name: string;
  description: string;
  attachment_type: string;
  completed: boolean;
  completed_at: string | null;
  position: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChecklistData {
  name: string;
  description: string;
  attachment_type: string;
  position?: number;
}

export interface UpdateChecklistData {
  name?: string;
  description?: string;
  attachment_type?: string;
  position?: number;
}

// API Functions
const listCandidateChecklists = async (candidateId: string) => {
  console.log("🔍 Fetching candidate checklists for:", candidateId);
  const obj = await apiCall(candidateChecklistEndpoints.list(candidateId), null, {
    method: "GET",
  });
  console.log("📋 Candidate checklists response:", obj);
  return obj?.data?.candidate_checklists || [];
};

const createCandidateChecklist = async (candidateId: string, data: CreateChecklistData) => {
  console.log("✨ Creating candidate checklist:", { candidateId, data });
  
  // Create JSON payload (no file upload in create)
  const payload = {
    candidate_checklist: {
      name: data.name,
      description: data.description,
      attachment_type: data.attachment_type,
      position: data.position || 1
    }
  };

  const obj = await apiCall(candidateChecklistEndpoints.create(candidateId), payload, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' }
  });
  console.log("📝 Created checklist:", obj);
  return obj?.data?.candidate_checklist;
};

const getCandidateChecklist = async (candidateId: string, checklistId: string) => {
  console.log("🔍 Fetching checklist:", { candidateId, checklistId });
  const obj = await apiCall(candidateChecklistEndpoints.show(candidateId, checklistId), null, {
    method: "GET",
  });
  return obj?.data?.candidate_checklist;
};

const updateCandidateChecklist = async (candidateId: string, checklistId: string, data: UpdateChecklistData) => {
  console.log("📝 Updating checklist:", { candidateId, checklistId, data });
  
  // Create JSON payload (no file upload in update)
  const payload = {
    candidate_checklist: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.attachment_type && { attachment_type: data.attachment_type }),
      ...(data.position && { position: data.position })
    }
  };

  const obj = await apiCall(candidateChecklistEndpoints.update(candidateId, checklistId), payload, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' }
  });
  console.log("✅ Updated checklist:", obj);
  return obj?.data?.candidate_checklist;
};

const deleteCandidateChecklist = async (candidateId: string, checklistId: string) => {
  console.log("🗑️ Deleting checklist:", { candidateId, checklistId });
  const obj = await apiCall(candidateChecklistEndpoints.delete(candidateId, checklistId), null, {
    method: "DELETE",
  });
  console.log("🗑️ Deleted checklist:", obj);
  return obj;
};

const toggleChecklistCompletion = async (candidateId: string, checklistId: string, completed: boolean) => {
  console.log("✅ Toggling checklist completion:", { candidateId, checklistId, completed });
  const obj = await apiCall(candidateChecklistEndpoints.complete(candidateId, checklistId), 
    { completed }, 
    {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' }
    }
  );
  console.log("✅ Toggled completion:", obj);
  return obj?.data?.candidate_checklist;
};

const uploadChecklistFile = async (candidateId: string, checklistId: string, file: File) => {
  console.log("📤 Uploading file to checklist:", { candidateId, checklistId, fileName: file.name });
  
  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', file);

  const obj = await apiCall(candidateChecklistEndpoints.uploadFile(candidateId, checklistId), formData, {
    method: "POST",
    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
  });
  console.log("📤 File uploaded:", obj);
  return obj?.data?.candidate_checklist;
};

// Simple approach: Just use the file_url that's already in the checklist data!
// No need to go through the download endpoint at all.
const downloadChecklistFile = (fileUrl: string, fileName?: string) => {
  console.log("📥 Opening file directly:", { fileUrl, fileName });
  
  if (!fileUrl) {
    alert("No file URL available");
    return;
  }
  
  // Just open the S3 URL directly - it's already signed and ready to use
  window.open(fileUrl, '_blank');
};

const bulkCreateChecklists = async (candidateId: string, checklists: CreateChecklistData[]) => {
  console.log("📦 Bulk creating checklists:", { candidateId, count: checklists.length });
  const obj = await apiCall(candidateChecklistEndpoints.bulkCreate(candidateId), 
    { candidate_checklists: checklists }, 
    {
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return obj?.data?.candidate_checklists || [];
};

const bulkDeleteChecklists = async (candidateId: string, checklistIds: string[]) => {
  console.log("🗑️ Bulk deleting checklists:", { candidateId, ids: checklistIds });
  const obj = await apiCall(candidateChecklistEndpoints.bulkDestroy(candidateId), 
    { ids: checklistIds }, 
    {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return obj;
};

// React Query Hooks
export const useCandidateChecklists = (candidateId: string) => {
  return useGenericQuery(
    ["candidate-checklists", candidateId],
    () => listCandidateChecklists(candidateId),
    { enabled: !!candidateId }
  );
};

export const useCandidateChecklist = (candidateId: string, checklistId: string) => {
  return useGenericQuery(
    ["candidate-checklist", candidateId, checklistId],
    () => getCandidateChecklist(candidateId, checklistId),
    { enabled: !!candidateId && !!checklistId }
  );
};

export const useCreateCandidateChecklist = () => {
  return useGenericMutation(
    ["create-candidate-checklist"],
    ({ candidateId, data }: { candidateId: string; data: CreateChecklistData }) =>
      createCandidateChecklist(candidateId, data)
  );
};

export const useUpdateCandidateChecklist = () => {
  return useGenericMutation(
    ["update-candidate-checklist"],
    ({ candidateId, checklistId, data }: { candidateId: string; checklistId: string; data: UpdateChecklistData }) =>
      updateCandidateChecklist(candidateId, checklistId, data)
  );
};

export const useDeleteCandidateChecklist = () => {
  return useGenericMutation(
    ["delete-candidate-checklist"],
    ({ candidateId, checklistId }: { candidateId: string; checklistId: string }) =>
      deleteCandidateChecklist(candidateId, checklistId)
  );
};

export const useToggleChecklistCompletion = () => {
  return useGenericMutation(
    ["toggle-checklist-completion"],
    ({ candidateId, checklistId, completed }: { candidateId: string; checklistId: string; completed: boolean }) =>
      toggleChecklistCompletion(candidateId, checklistId, completed)
  );
};

export const useBulkCreateChecklists = () => {
  return useGenericMutation(
    ["bulk-create-checklists"],
    ({ candidateId, checklists }: { candidateId: string; checklists: CreateChecklistData[] }) =>
      bulkCreateChecklists(candidateId, checklists)
  );
};

export const useBulkDeleteChecklists = () => {
  return useGenericMutation(
    ["bulk-delete-checklists"],
    ({ candidateId, checklistIds }: { candidateId: string; checklistIds: string[] }) =>
      bulkDeleteChecklists(candidateId, checklistIds)
  );
};

export const useUploadChecklistFile = () => {
  return useGenericMutation(
    ["upload-checklist-file"],
    ({ candidateId, checklistId, file }: { candidateId: string; checklistId: string; file: File }) =>
      uploadChecklistFile(candidateId, checklistId, file)
  );
};

// Export utility functions
export { downloadChecklistFile, uploadChecklistFile };
