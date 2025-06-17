import { apiCall } from "../api-utils";
import {
  M_CREATE_CANDIDATE,
  M_EDIT_CANDIDATE,
  Q_LIST_CANDIDATES,
} from "../auth/constants";
import { API_CANDIDATES } from "../auth/routes";
import { useGenericMutation } from "../query";

const listCandidates = (id: string) => {
  return apiCall(`${API_CANDIDATES}/${id}`, null, { method: "GET" });
};

export const useCandidateList = () => {
  return useGenericMutation([Q_LIST_CANDIDATES], (id) => listCandidates(id));
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
