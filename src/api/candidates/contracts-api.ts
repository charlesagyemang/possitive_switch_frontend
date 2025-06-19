import { apiCall } from "../api-utils";
import {
  M_APPROVE_CONTRACT,
  M_SEND_CONTRACT,
  Q_LIST_CONTRACT_TEMPLATES,
} from "../auth/constants";
import { API_BASE, API_CANDIDATES, API_UTILITIES } from "../auth/routes";
import { useGenericMutation, useGenericQuery } from "../query";

const fetchContractTemplates = async () => {
  const obj = await apiCall(`${API_BASE}/contract_templates`, null, {
    method: "GET",
  });

  return obj?.data?.contract_templates || [];
};

const approveContract = async (cand_id: string, cont_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/candidates/${cand_id}/contracts/${cont_id}/approve`
  );
  return obj?.data?.contract;
};
const sendContract = async (cand_id: string, cont_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/candidates/${cand_id}/contracts/${cont_id}/send_contract`
  );
  return obj?.data?.contract;
};
const approveAndSend = async (cand_id: string, cont_id: string) => {
  const obj = await apiCall(
    `${API_CANDIDATES}/candidates/${cand_id}/contracts/${cont_id}/approve_and_send`
  );
  return obj?.data?.contract;
};

export const useContractTemplatesListHandler = () => {
  return useGenericQuery([Q_LIST_CONTRACT_TEMPLATES], fetchContractTemplates);
};

const useContractApprovalHandler = () => {
  return useGenericMutation(
    [M_APPROVE_CONTRACT],
    ({ ca_id, co_id }: { ca_id: string; co_id: string }) =>
      approveContract(ca_id, co_id)
  );
};
const useSendContractHandler = () => {
  return useGenericMutation(
    [M_SEND_CONTRACT],
    ({ ca_id, co_id }: { ca_id: string; co_id: string }) =>
      sendContract(ca_id, co_id)
  );
};
const useApproveAndSendHandler = () => {
  return useGenericMutation(
    [M_SEND_CONTRACT],
    ({ ca_id, co_id }: { ca_id: string; co_id: string }) =>
      approveAndSend(ca_id, co_id)
  );
};
