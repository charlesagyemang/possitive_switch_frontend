import { apiCall, createForm } from "../api-utils";
import { useGenericMutation, useGenericQuery } from "../query";
import {
  M_LOGIN_USER,
  M_REGISTER_USER,
  Q_AUTHENTICATED_USER,
} from "./constants";
import { API_LOGIN, API_REGISTER_USER, API_WHO_AM_I } from "./routes";

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

const fetchAuthUser = () => {
  return apiCall(API_WHO_AM_I, null, { method: "GET" });
};
export const useAuthenticatedUser = () => {
  return useGenericQuery([Q_AUTHENTICATED_USER], fetchAuthUser);
};
