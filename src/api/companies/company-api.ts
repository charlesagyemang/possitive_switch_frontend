import { apiCall, createForm } from "../api-utils";
import {
  M_CREATE_CANDIDATE,
  M_CREATE_COMPANY,
  Q_LIST_COMPANIES,
} from "../auth/constants";
import {
  API_CREATE_NEW_CANDIDATE,
  API_CREATE_NEW_COMPANY,
  API_LIST_ALL_COMPANIES,
} from "../auth/routes";
import { useGenericMutation, useGenericQuery } from "../query";

const createCompany = (body: unknown) => {
  return apiCall(API_CREATE_NEW_COMPANY, createForm(body));
};

export const useCreateCompanyHandler = () => {
  return useGenericMutation([M_CREATE_COMPANY], (body) => createCompany(body));
};

const createCandidate = (body: unknown) => {
  return apiCall(API_CREATE_NEW_CANDIDATE, createForm(body));
};

export const useCreateCandidateHandler = () => {
  return useGenericMutation([M_CREATE_CANDIDATE], (body) =>
    createCandidate(body)
  );
};
const listCompanies = () => {
  return apiCall(API_LIST_ALL_COMPANIES, null, { method: "GET" });
};

export const useListCompaniesHandler = () => {
  return useGenericQuery([Q_LIST_COMPANIES], listCompanies);
};
