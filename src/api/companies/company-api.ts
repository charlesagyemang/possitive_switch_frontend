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

const tempCookie = () => {
  return `_session_id=dCRPebZsWjZdWwMWm1aBs6X9YUyZrPTnN3ogGK97KkM1GYewDyCBhOG%2BHcfnVVR3VQydLx1wF3KXzWaBvWSkyboAsbjlDr6U8sbEDxeiqQVQaN5IJleWZ1kfB%2FvHWAyGtB5%2Frfe7fLcQmhpML9hUics7r9yW7xHkiq82K2XGJ5pbnlAmowZkN845QQxOfz3nrwQKoxxZL%2FfURN2r2yLqwE62r143gTVg6okMxXHac%2BV2bgnPPToydq4Ivi%2Bou5UWRBYsII5YWNEGc%2BlVBWRGTvTfbzXym%2BUoTonx0SiFM7BuBYmZa9OmQ091ORB6yO6bkchy%2FMjn6niKCmTlSXkALhoLgg%3D%3D--bkBEGCbhmmfcmKKF--zwGWfYdTJ6mRTyztA0AfLg%3D%3D; Path=/; Secure; HttpOnly; jwt=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltVjVTbWhpUjJOcFQybEtTVlY2U1RGT2FVbzVMbVY1U25wa1YwbHBUMmxKTTAweVRteGFWR014VFhrd05FMTZaR2hNVkZGNFQwUkZkRmxxV1hwTmFUQjNXa1JuTUZsdFZteE5iVTVyVDBkUmFVeERTbnBaTTBGcFQybEtNV015Vm5sSmFYZHBXVmhXYTBscWNIVmtWM2h6VEVOS2NGbFlVV2xQYWtVelRsUkJkMDFFUlhwT1JFRnpTVzFXTkdORFNUWk5WR014VFVSQk5FNTZZekJOUTNkcFlXNVNjRWxxYjJsT2JWcG9UbnBuTUUxdFZYUk5lbEYzV1drd01FNHlTVE5NVjBwc1RtcEZkRTlFVm0xYVJFbDZXa2RWTVZwdFZUUkpiakF1VmxrMVRGWmphbFpYZFUxelYzUkNSa05NU25aQlRreFZiWFJ0YW5BMU9XOHpOM1ppUkVaV1NEUlZSU0k9IiwiZXhwIjoiMjAyNS0wNi0xNlQxNToyOTowMC4xNjdaIiwicHVyIjoiY29va2llLmp3dCJ9fQ%3D%3D--2e3fb8c7d1f78c505491b8d6654135057c06fb56; Path=/; Secure; HttpOnly; Expires=Mon, 16 Jun 2025 15:29:00 GMT;`;
};
const createCompany = (body: unknown) => {
  return apiCall(API_CREATE_NEW_COMPANY, body, {
    headers: { Cookie: tempCookie() },
  });
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
