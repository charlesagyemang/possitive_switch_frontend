import { apiCall } from "../api-utils";
import {
  M_APPROVE_CONTRACT,
  M_CREATE_CONTRACT,
  M_SEND_CONTRACT,
  Q_LIST_ALL_CANDIDATE_CONTRACTS,
  Q_LIST_CONTRACT_TEMPLATES,
} from "../auth/constants";
import { API_BASE, API_CANDIDATES, API_UTILITIES } from "../auth/routes";
import { useGenericMutation, useGenericQuery } from "../query";

const fetchContractTemplates = async (company_id?: string) => {
  const endpoint = company_id 
    ? `${API_BASE}/companies/${company_id}/contract_templates`
    : `${API_BASE}/contract_templates`;
    
  const obj = await apiCall(endpoint, null, {
    method: "GET",
  });

  return obj?.data?.contract_templates || [];
};

const approveContract = async (cand_id: string, cont_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/${cand_id}/contracts/${cont_id}/approve`
  );
  return obj?.data?.contract;
};
const sendContract = async (cand_id: string, cont_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/${cand_id}/contracts/${cont_id}/send_contract`
  );
  if (!!!obj?.success) {
    console.log("I threw someting here meerhn");
    throw new Error(obj?.message);
  } else console.log("I did not throw something in here");

  return obj?.data?.contract;
};
const approveAndSend = async (cand_id: string, cont_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/${cand_id}/contracts/${cont_id}/approve_and_send`
  );
  return obj?.data?.contract;
};

export const useContractTemplatesListHandler = (company_id?: string) => {
  return useGenericQuery(
    [Q_LIST_CONTRACT_TEMPLATES, company_id || 'all'],
    () => fetchContractTemplates(company_id),
    { enabled: !!company_id }
  );
};

export const useContractApprovalHandler = () => {
  return useGenericMutation(
    [M_APPROVE_CONTRACT],
    ({ ca_id, co_id }: { ca_id: string; co_id: string }) =>
      approveContract(ca_id, co_id)
  );
};
export const useSendContractHandler = () => {
  return useGenericMutation(
    [M_SEND_CONTRACT],
    ({ ca_id, co_id }: { ca_id: string; co_id: string }) =>
      sendContract(ca_id, co_id)
  );
};
export const useApproveAndSendHandler = () => {
  return useGenericMutation(
    [M_SEND_CONTRACT],
    ({ ca_id, co_id }: { ca_id: string; co_id: string }) =>
      approveAndSend(ca_id, co_id)
  );
};

const listCandidateContracts = async (cand_id: string) => {
  const obj = await apiCall(`${API_CANDIDATES}/${cand_id}/contracts`, null, {
    method: "GET",
  });
  return obj?.data?.contracts || [];
};

export const useCandidateContractList = (can_id: string) => {
  return useGenericQuery(
    [Q_LIST_ALL_CANDIDATE_CONTRACTS, can_id],
    () => listCandidateContracts(can_id),
    { enabled: !!can_id }
  );
};

export const createContract = async (body: any) => {
  const { candidate_id, ...data } = body || {};
  const obj = await apiCall(
    `${API_CANDIDATES}/${candidate_id}/contracts`,
    data
  );
  if (!!!obj.success)
    throw new Error(obj.message || "Contract creation failed");

  return obj?.data;
};

export const useCreateContract = () => {
  return useGenericMutation([M_CREATE_CONTRACT], createContract);
};

// Enable public signing for a contract
export const enableContractSigning = async (candidateId: string, contractId: string, requiredSigners: string[]) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/${candidateId}/contracts/${contractId}/enable_signing`,
    { required_signers: requiredSigners },
    { method: "POST" }
  );
  if (!obj.success) {
    throw new Error(obj.message || "Failed to enable contract signing");
  }
  return obj.data;
};

export const useEnableContractSigning = () => {
  return useGenericMutation(
    [M_SEND_CONTRACT], // Reusing mutation key
    ({ candidateId, contractId, requiredSigners }: { candidateId: string; contractId: string; requiredSigners: string[] }) =>
      enableContractSigning(candidateId, contractId, requiredSigners)
  );
};

// Get signing status for a contract
export const getContractSigningStatus = async (candidateId: string, contractId: string) => {
  const obj = await apiCall(`${API_CANDIDATES}/${candidateId}/contracts/${contractId}/signing_status`, null, {
    method: "GET",
  });
  return obj?.data?.contract || null;
};

export const useContractSigningStatus = (candidateId: string, contractId: string) => {
  return useGenericQuery(
    [`contract-signing-status`, candidateId, contractId],
    () => getContractSigningStatus(candidateId, contractId),
    { enabled: !!candidateId && !!contractId }
  );
};

// Disable public signing
export const disableContractSigning = async (candidateId: string, contractId: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/${candidateId}/contracts/${contractId}/disable_signing`,
    null,
    { method: "DELETE" }
  );
  if (!obj.success) {
    throw new Error(obj.message || "Failed to disable contract signing");
  }
  return obj.data;
};

export const useDisableContractSigning = () => {
  return useGenericMutation(
    [M_SEND_CONTRACT], // Reusing mutation key
    ({ candidateId, contractId }: { candidateId: string; contractId: string }) =>
      disableContractSigning(candidateId, contractId)
  );
};
