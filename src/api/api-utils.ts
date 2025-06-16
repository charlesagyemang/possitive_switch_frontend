import { PUI_TOKEN } from "./constants";

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  queryParams?: Record<string, string>;
  server?: boolean;
}
export const createForm = (json: any) => {
  const form = new FormData();
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      if (value instanceof File) {
        form.append(key, value, value.name);
      } else {
        form.append(key, value);
      }
    }
  }
  return form;
};

const defaultOptions = {
  method: "POST",
  headers: {},
  params: null,
  queryParams: null,
  server: false,
};

const makeBody = (method: string, body: any) => {
  if (method === "GET") return null;
  if (!body) return null;
  const isFormData = body instanceof FormData;

  if (isFormData) return body;
  return JSON.stringify(body) || null;
};

const forcedToken = () => {
  return { Authorization: `Bearer ${localStorage.getItem(PUI_TOKEN)}` };
};
const makeHeaders = (
  headers: Record<string, string> | undefined,
  body: any,
  options?: Record<string, any>
): Record<string, string> => {
  const isFormData = body instanceof FormData;
  const { server } = options || {};

  const fToken = server ? {} : forcedToken();
  if (isFormData) {
    return { ...fToken, ...(headers || {}) };
  }
  return {
    "Content-Type": "application/json",
    ...fToken,
    ...(headers || {}),
  };
};

export const apiCall = (
  url: string,
  body?: FormData | {} | null,
  options?: ApiOptions
) => {
  const {
    method = "POST",
    headers,
    params,
    queryParams,
    server,
  } = options || defaultOptions;

  const requestOptions: RequestInit = {
    method,
    headers: makeHeaders(headers, body, { server }),
    body: makeBody(method, body),
    // credentials: "include",
  };

  if (params) {
    url += `/${new URLSearchParams(params).toString()}`;
  }

  if (queryParams) {
    url += `?${new URLSearchParams(queryParams).toString()}`;
  }

  return fetch(url, requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res?.success) return res;
      if (server) return res; // even if there is an error, dont throw on the server. Throw only on client side requests
      throw new Error(res.error);
    });
};

export const removeUndefinedFromObject = (object: {}) => {
  return Object.fromEntries(
    Object.entries(object || {}).filter(([_, v]) => v !== undefined)
  );
};

export const replaceUndefinedWithNull = (object: {}) => {
  return Object.fromEntries(
    Object.entries(object).map(([k, v]) => [k, v === undefined ? null : v])
  );
};

export const encodeForUrl = (str: string): string => {
  return encodeURIComponent(str);
};

export const clientSetCookie = (
  name: string,
  value: string,
  days: number = 1,
  path: string = "/"
) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}${expires}; path=${path}`;
};
