import { apiCall } from "../api-utils";
import {
  M_CREATE_CANDIDATE,
  M_EDIT_CANDIDATE,
  Q_LIST_CANDIDATES,
} from "../auth/constants";
import { API_CANDIDATES, API_COMPANIES } from "../auth/routes";
import { useGenericMutation, useGenericQuery } from "../query";

const listCandidates = async (company_id: string) => {
  const obj = await apiCall(
    `${API_COMPANIES}/${company_id}/candidates_deep`,
    null,
    {
      method: "GET",
    }
  );

  return obj?.data?.company?.candidates || [];
};

export const useCandidateList = (company_id: string) => {
  return useGenericQuery(
    [Q_LIST_CANDIDATES, company_id],
    () => listCandidates(company_id),
    { enabled: !!company_id }
  );
};

const createCandidate = (body: unknown) => {
  return apiCall(`${API_CANDIDATES}`, body);
};

export const useCreateCandidateHandler = () => {
  return useGenericMutation([M_CREATE_CANDIDATE], (body) =>
    createCandidate(body)
  );
};
const editCandidate = (body: unknown) => {
  return apiCall(`${API_CANDIDATES}`, body, { method: "PATCH" });
};

export const useEditCandidateHandler = () => {
  return useGenericMutation([M_EDIT_CANDIDATE], (body) => editCandidate(body));
};
const fetchCandidate = (id: string) => {
  return apiCall(`${API_CANDIDATES}/${id}`, null, { method: "GET" });
};

export const useCandidateFetchHandler = () => {
  return useGenericMutation([M_EDIT_CANDIDATE], (body) => fetchCandidate(body));
};
