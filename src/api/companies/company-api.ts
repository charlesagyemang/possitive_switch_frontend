import { apiCall, createForm } from "../api-utils";
import {
  M_CREATE_CANDIDATE,
  M_CREATE_COMPANY,
  M_DELETE_COMPANY,
  M_UPDATE_COMPANY,
  M_UPLOAD_COMPANY_LOGO,
  Q_LIST_COMPANIES,
  Q_LOAD_ONE_COMPANY,
} from "../auth/constants";
import {
  API_BASE,
  API_CANDIDATES,
  API_COMPANIES,
  API_CREATE_NEW_CANDIDATE,
  API_CREATE_NEW_COMPANY,
  API_LIST_ALL_COMPANIES,
} from "../auth/routes";
import { useGenericMutation, useGenericQuery } from "../query";

// const tempCookie = () => {
//   return {
//     Cookie: `_session_id=gxHDD1DH8FxXnx%2Bmw0nyVTuqzSjLsTZsoeOGc%2FDLLFzXvpN%2FbprCI0%2BIwhPCJSwTDv5x8LZdjzL2ofpqHzF%2FC3gF%2BV5DUVC0g2FzERDzPUygclAcS%2B18jAl%2FYNqshYlmuLVpK10xc7q4%2BfgU7LFFJLp%2BJioDxXMkg7mtCa8etTmHoTGnfRwdyfJpPyqCjrv7BQUFFx%2B8tiXDRvh0rmiKZHz0gNqf%2BGall2hgbSwab2Dfepgx9MAv%2BF8JBhQy3oE6TnxjWrbPHqeBhZmBlrSWwtataeygh8xA2We84Bf2pN2xH3IstW9v1T6b3luwv0knasic89Tnt%2FsB9qlSit594LHPag%3D%3D--xN7lVdaV1gs2Hs1U--ayEk8FRzX75Epx5M%2BU1D4w%3D%3D; Path=/; Secure; HttpOnly;jwt=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltVjVTbWhpUjJOcFQybEtTVlY2U1RGT2FVbzVMbVY1U25wa1YwbHBUMmxKTTAweVRteGFWR014VFhrd05FMTZaR2hNVkZGNFQwUkZkRmxxV1hwTmFUQjNXa1JuTUZsdFZteE5iVTVyVDBkUmFVeERTbnBaTTBGcFQybEtNV015Vm5sSmFYZHBXVmhXYTBscWNIVmtWM2h6VEVOS2NGbFlVV2xQYWtVelRsUkJkMDFFVlRWTlZHdHpTVzFXTkdORFNUWk5WR014VFVSQk5VMXFUWGhQVTNkcFlXNVNjRWxxYjJsWmFrWnJUVzFHYWs0eVVYUmFSRWwzV1drd01GcEVUVEJNVkdodFRWUlpkRTVFWXpCT2VrMTVUMWRHYVZsdFVtdEpiakF1VVhKMllqRlNTR0paTlZkeE1EbFRiamRKZGkwNVR6ZHJiamxSTFRNMmNuTnJkVzB6TnpkVU1XUnJjeUk9IiwiZXhwIjoiMjAyNS0wNi0xNlQxNjo0NToxOS4wMzFaIiwicHVyIjoiY29va2llLmp3dCJ9fQ%3D%3D--61bc13a4d88f51faaae39c35543db0f3db90f4b9; Path=/; Secure; HttpOnly; Expires=Mon, 16 Jun 2025 16:45:19 GMT;`,
//   };
// };

// const tempBearer = () => {
//   return {
//     Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzOTc2OWE4Yy00ZTBlLTRhYzctYjZiNC1kM2YwZGQ0MTQ1NDkiLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE3NTAwMDYyMDEsImV4cCI6MTc1MDA5MjYwMSwianRpIjoiMzAzYzRiN2YtNjkxOC00YWVlLTkzMTMtZmU5ZjdkYTI2OTBhIn0.o6wDxt1yQ-JnQKLJwyhi9DXFBV4Mt9D1t4rbfGiCYLs`,
//   };
// };

const createCompany = (body: Record<string, any>) => {
  return apiCall(API_CREATE_NEW_COMPANY, body);
};

export const useCreateCompanyHandler = () => {
  return useGenericMutation([M_CREATE_COMPANY], (body) => createCompany(body));
};
const updateCompany = (body: any) => {
  const { id, ...rest } = body?.company || {};
  return apiCall(
    `${API_CREATE_NEW_COMPANY}/${id}`,
    { company: rest },
    {
      method: "PATCH",
    }
  );
};

export const useUpdateCompanyHandler = () => {
  return useGenericMutation([M_UPDATE_COMPANY], (body) => updateCompany(body));
};
const fetchCompany = async (id: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${id}`, null, {
    method: "GET",
  });

  return obj.data?.company || null;
};

export const useCompanyFetchHandler = (id: string) => {
  return useGenericQuery([Q_LOAD_ONE_COMPANY, id], () => fetchCompany(id), {
    enabled: !!id,
  });
};

const deleteCompany = (id: string) => {
  return apiCall(`${API_COMPANIES}/${id}`, null, {
    method: "DELETE",
  });
};

export const useCompanyDeleteHandler = () => {
  return useGenericMutation([M_DELETE_COMPANY], (body) => deleteCompany(body));
};

const createCandidate = (body: unknown) => {
  return apiCall(API_CREATE_NEW_CANDIDATE, createForm(body));
};

export const useCreateCandidateHandler = () => {
  return useGenericMutation([M_CREATE_CANDIDATE], (body) =>
    createCandidate(body)
  );
};
const listCompanies = async () => {
  const obj = await apiCall(API_LIST_ALL_COMPANIES, null, {
    method: "GET",
  });
  
  console.log(`
🚀 ====== COMPANIES LIST API RESPONSE ======
🌐 URL: ${API_LIST_ALL_COMPANIES}
📦 Full Response Object:
`, JSON.stringify(obj, null, 2));

  console.log(`
📊 Companies Data:
`, obj?.data?.companies);

  return obj?.data?.companies;
};

export const useCompanyList = () => {
  return useGenericQuery([Q_LIST_COMPANIES], listCompanies);
};

const uploadLogo = (body: any) => {
  const { id, ...rest } = body;
  return apiCall(`${API_COMPANIES}/${id}/logo`, createForm(rest));
};

export const useCompanyLogoHandler = () => {
  return useGenericMutation([M_UPLOAD_COMPANY_LOGO], (body) =>
    uploadLogo(body)
  );
};

// Company API Key Validation
const validateCompanyApiKey = async (apiKey: string) => {
  const obj = await apiCall(`${API_BASE}/login/api_key`, {
    api_key: apiKey
  }, {
    method: "POST",
  });
  
  console.log(`
🔑 ====== API KEY VALIDATION ======
🔑 API Key: ${apiKey}
🌐 URL: ${API_BASE}/login/api_key
📦 Company Data:
`, JSON.stringify(obj, null, 2));

  return obj?.data?.company || null;
};

export const useValidateCompanyApiKey = () => {
  return useGenericMutation(["M_VALIDATE_API_KEY"], (apiKey: string) => 
    validateCompanyApiKey(apiKey)
  );
};

// ===============================
// COMPANY SETTINGS API FUNCTIONS
// ===============================

// Email Templates
const fetchEmailTemplates = async (companyId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/email_templates`, null, {
    method: "GET",
  });
  return obj.data?.company_email_templates || [];
};

export const useEmailTemplates = (companyId: string) => {
  return useGenericQuery(
    ["Q_COMPANY_EMAIL_TEMPLATES", companyId], 
    () => fetchEmailTemplates(companyId),
    { 
      enabled: !!companyId,
      retry: false, // Disable retries completely for now
      staleTime: 5 * 60 * 1000,
    }
  );
};

const fetchEmailTemplate = async (companyId: string, templateId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/email_templates/${templateId}`, null, {
    method: "GET",
  });
  return obj.data?.company_email_template || null;
};

export const useEmailTemplate = (companyId: string, templateId: string) => {
  return useGenericQuery(
    ["Q_COMPANY_EMAIL_TEMPLATE", companyId, templateId], 
    () => fetchEmailTemplate(companyId, templateId),
    { enabled: !!companyId && !!templateId }
  );
};

const createEmailTemplate = (companyId: string, templateData: any) => {
  const payload = { company_email_template: templateData };
  
  console.log(`
🚀 ====== CREATE EMAIL TEMPLATE API CALL ======
🏢 Company ID: ${companyId}
🌐 URL: ${API_COMPANIES}/${companyId}/email_templates
📦 Final Payload:
`, JSON.stringify(payload, null, 2));
  
  return apiCall(`${API_COMPANIES}/${companyId}/email_templates`, payload);
};

export const useCreateEmailTemplate = () => {
  return useGenericMutation(["M_CREATE_EMAIL_TEMPLATE"], ({ companyId, templateData }: any) =>
    createEmailTemplate(companyId, templateData)
  );
};

const updateEmailTemplate = (companyId: string, templateId: string, templateData: any) => {
  const payload = { company_email_template: templateData };
  
  console.log(`
🚀 ====== UPDATE EMAIL TEMPLATE API CALL ======
🏢 Company ID: ${companyId}
🆔 Template ID: ${templateId}
🌐 URL: ${API_COMPANIES}/${companyId}/email_templates/${templateId}
📦 Final Payload:
`, JSON.stringify(payload, null, 2));
  
  return apiCall(`${API_COMPANIES}/${companyId}/email_templates/${templateId}`, payload, { method: "PUT" });
};

export const useUpdateEmailTemplate = () => {
  return useGenericMutation(["M_UPDATE_EMAIL_TEMPLATE"], ({ companyId, templateId, templateData }: any) =>
    updateEmailTemplate(companyId, templateId, templateData)
  );
};

const deleteEmailTemplate = (companyId: string, templateId: string) => {
  return apiCall(`${API_COMPANIES}/${companyId}/email_templates/${templateId}`, null, {
    method: "DELETE",
  });
};

export const useDeleteEmailTemplate = () => {
  return useGenericMutation(["M_DELETE_EMAIL_TEMPLATE"], ({ companyId, templateId }: any) =>
    deleteEmailTemplate(companyId, templateId)
  );
};

// Contract Templates
const fetchContractTemplates = async (companyId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/contract_templates`, null, {
    method: "GET",
  });
  return obj.data?.company_contract_templates || [];
};

export const useContractTemplates = (companyId: string) => {
  return useGenericQuery(
    ["Q_COMPANY_CONTRACT_TEMPLATES", companyId], 
    () => fetchContractTemplates(companyId),
    { 
      enabled: !!companyId,
      retry: (failureCount: number, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    }
  );
};

const fetchContractTemplate = async (companyId: string, templateId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/contract_templates/${templateId}`, null, {
    method: "GET",
  });
  return obj.data?.company_contract_template || null;
};

export const useContractTemplate = (companyId: string, templateId: string) => {
  return useGenericQuery(
    ["Q_COMPANY_CONTRACT_TEMPLATE", companyId, templateId], 
    () => fetchContractTemplate(companyId, templateId),
    { enabled: !!companyId && !!templateId }
  );
};

const createContractTemplate = (companyId: string, templateData: any) => {
  return apiCall(`${API_COMPANIES}/${companyId}/contract_templates`, {
    company_contract_template: templateData
  });
};

export const useCreateContractTemplate = () => {
  return useGenericMutation(["M_CREATE_CONTRACT_TEMPLATE"], ({ companyId, templateData }: any) =>
    createContractTemplate(companyId, templateData)
  );
};

const updateContractTemplate = (companyId: string, templateId: string, templateData: any) => {
  return apiCall(`${API_COMPANIES}/${companyId}/contract_templates/${templateId}`, {
    company_contract_template: templateData
  }, { method: "PUT" });
};

export const useUpdateContractTemplate = () => {
  return useGenericMutation(["M_UPDATE_CONTRACT_TEMPLATE"], ({ companyId, templateId, templateData }: any) =>
    updateContractTemplate(companyId, templateId, templateData)
  );
};

const deleteContractTemplate = (companyId: string, templateId: string) => {
  return apiCall(`${API_COMPANIES}/${companyId}/contract_templates/${templateId}`, null, {
    method: "DELETE",
  });
};

export const useDeleteContractTemplate = () => {
  return useGenericMutation(["M_DELETE_CONTRACT_TEMPLATE"], ({ companyId, templateId }: any) =>
    deleteContractTemplate(companyId, templateId)
  );
};

// Onboarding Task Templates
const fetchOnboardingTaskTemplates = async (companyId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/onboarding_task_templates`, null, {
    method: "GET",
  });
  return obj.data?.company_onboarding_task_templates || [];
};

export const useOnboardingTaskTemplates = (companyId: string) => {
  return useGenericQuery(
    ["Q_COMPANY_ONBOARDING_TASK_TEMPLATES", companyId], 
    () => fetchOnboardingTaskTemplates(companyId),
    { 
      enabled: !!companyId,
      retry: (failureCount: number, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    }
  );
};

const fetchOnboardingTaskTemplate = async (companyId: string, templateId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/onboarding_task_templates/${templateId}`, null, {
    method: "GET",
  });
  return obj.data?.company_onboarding_task_template || null;
};

export const useOnboardingTaskTemplate = (companyId: string, templateId: string) => {
  return useGenericQuery(
    ["Q_COMPANY_ONBOARDING_TASK_TEMPLATE", companyId, templateId], 
    () => fetchOnboardingTaskTemplate(companyId, templateId),
    { enabled: !!companyId && !!templateId }
  );
};

const createOnboardingTaskTemplate = (companyId: string, templateData: any) => {
  return apiCall(`${API_COMPANIES}/${companyId}/onboarding_task_templates`, {
    company_onboarding_task_template: templateData
  });
};

export const useCreateOnboardingTaskTemplate = () => {
  return useGenericMutation(["M_CREATE_ONBOARDING_TASK_TEMPLATE"], ({ companyId, templateData }: any) =>
    createOnboardingTaskTemplate(companyId, templateData)
  );
};

const updateOnboardingTaskTemplate = (companyId: string, templateId: string, templateData: any) => {
  return apiCall(`${API_COMPANIES}/${companyId}/onboarding_task_templates/${templateId}`, {
    company_onboarding_task_template: templateData
  }, { method: "PUT" });
};

export const useUpdateOnboardingTaskTemplate = () => {
  return useGenericMutation(["M_UPDATE_ONBOARDING_TASK_TEMPLATE"], ({ companyId, templateId, templateData }: any) =>
    updateOnboardingTaskTemplate(companyId, templateId, templateData)
  );
};

const deleteOnboardingTaskTemplate = (companyId: string, templateId: string) => {
  return apiCall(`${API_COMPANIES}/${companyId}/onboarding_task_templates/${templateId}`, null, {
    method: "DELETE",
  });
};

export const useDeleteOnboardingTaskTemplate = () => {
  return useGenericMutation(["M_DELETE_ONBOARDING_TASK_TEMPLATE"], ({ companyId, templateId }: any) =>
    deleteOnboardingTaskTemplate(companyId, templateId)
  );
};

// Company Documents API
const getCompanyDocuments = async (companyId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/company_documents`, null, {
    method: "GET",
  });
  return obj.data?.company_documents || [];
};

export const useCompanyDocuments = (companyId: string) => {
  return useGenericQuery(
    [`Q_COMPANY_DOCUMENTS_${companyId}`],
    () => getCompanyDocuments(companyId),
    {
      enabled: !!companyId,
    }
  );
};

const createCompanyDocument = async (companyId: string, formData: FormData) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/company_documents`, formData, {
    method: "POST",
    headers: {
      // Don't set Content-Type, let the browser set it with boundary for multipart/form-data
    },
  });
  return obj.data;
};

export const useCreateCompanyDocument = () => {
  return useGenericMutation(
    ["M_CREATE_COMPANY_DOCUMENT"],
    ({ companyId, formData }: { companyId: string; formData: FormData }) =>
      createCompanyDocument(companyId, formData)
  );
};

const deleteCompanyDocument = async (companyId: string, documentId: string) => {
  const obj = await apiCall(`${API_COMPANIES}/${companyId}/company_documents/${documentId}`, null, {
    method: "DELETE",
  });
  return obj.data;
};

export const useDeleteCompanyDocument = () => {
  return useGenericMutation(
    ["M_DELETE_COMPANY_DOCUMENT"],
    ({ companyId, documentId }: { companyId: string; documentId: string }) =>
      deleteCompanyDocument(companyId, documentId)
  );
};

const reorderOnboardingTaskTemplates = (companyId: string, positions: any[]) => {
  return apiCall(`${API_COMPANIES}/${companyId}/onboarding_task_templates/reorder`, {
    positions
  }, { method: "PATCH" });
};

export const useReorderOnboardingTaskTemplates = () => {
  return useGenericMutation(["M_REORDER_ONBOARDING_TASK_TEMPLATES"], ({ companyId, positions }: any) =>
    reorderOnboardingTaskTemplates(companyId, positions)
  );
};
