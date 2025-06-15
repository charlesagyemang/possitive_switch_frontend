import { apiCall, createForm } from "../api-utils";
import { useGenericMutation } from "../query";
import { M_LOGIN_USER, M_REGISTER_USER } from "./constants";
import { API_LOGIN, API_REGISTER_USER } from "./routes";

const register = (body: unknown) => {
  return apiCall(API_REGISTER_USER, body);
};

export const useRegistrationHandler = () => {
  return useGenericMutation([M_REGISTER_USER], (body) => register(body));
};

const login = (body: unknown) => {
  return apiCall(API_LOGIN, body);
};

export const useLoginHandler = () => {
  return useGenericMutation([M_LOGIN_USER], (body) => login(body));
};
