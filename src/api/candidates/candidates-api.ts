import { apiCall } from "../api-utils";
import {
  M_CREATE_CANDIDATE,
  M_DELETE_CANDIDATE,
  M_EDIT_CANDIDATE,
  Q_LIST_CANDIDATES,
  Q_LOAD_ONE_CANDIDATE,
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

const createCandidate = (body: Record<string, any> | FormData) => {
  return apiCall(`${API_CANDIDATES}`, body);
};

export const useCreateCandidateHandler = () => {
  return useGenericMutation([M_CREATE_CANDIDATE], (body) =>
    createCandidate(body)
  );
};
const editCandidate = (id: string, body: FormData | Record<string, any>) => {
  return apiCall(`${API_CANDIDATES}/${id}`, body, { method: "PUT" });
};

export const useEditCandidateHandler = () => {
  return useGenericMutation([M_EDIT_CANDIDATE], ({ id, ...body }) => editCandidate(id, body));
};

const deleteCandidate = (id: string) => {
  return apiCall(`${API_CANDIDATES}/${id}`, null, { method: "DELETE" });
};

export const useDeleteCandidateHandler = () => {
  return useGenericMutation([M_DELETE_CANDIDATE], (id: string) => deleteCandidate(id));
};
const fetchCandidate = async (id: string) => {
  const obj = await apiCall(`${API_CANDIDATES}/${id}`, null, { method: "GET" });
  return obj?.data?.candidate;
};

export const useCandidate = (id: string) => {
  return useGenericQuery([Q_LOAD_ONE_CANDIDATE, id], () => fetchCandidate(id), {
    enabled: !!id,
  });
};
