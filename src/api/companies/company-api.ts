import { apiCall, createForm } from "../api-utils";
import {
  M_CREATE_CANDIDATE,
  M_CREATE_COMPANY,
  M_DELETE_COMPANY,
  M_UPDATE_COMPANY,
  Q_LIST_COMPANIES,
} from "../auth/constants";
import {
  API_COMPANIES,
  API_CREATE_NEW_CANDIDATE,
  API_CREATE_NEW_COMPANY,
  API_LIST_ALL_COMPANIES,
} from "../auth/routes";
import { useGenericMutation, useGenericQuery } from "../query";

// const tempCookie = () => {
//   return {
//     Cookie: `_session_id=gxHDD1DH8FxXnx%2Bmw0nyVTuqzSjLsTZsoeOGc%2FDLLFzXvpN%2FbprCI0%2BIwhPCJSwTDv5x8LZdjzL2ofpqHzF%2FC3gF%2BV5DUVC0g2FzERDzPUygclAcS%2B18jAl%2FYNqshYlmuLVpK10xc7q4%2BfgU7LFFJLp%2BJioDxXMkg7mtCa8etTmHoTGnfRwdyfJpPyqCjrv7BQUFFx%2B8tiXDRvh0rmiKZHz0gNqf%2BGall2hgbSwab2Dfepgx9MAv%2BF8JBhQy3oE6TnxjWrbPHqeBhZmBlrSWwtataeygh8xA2We84Bf2pN2xH3IstW9v1T6b3luwv0knasic89Tnt%2FsB9qlSit594LHPag%3D%3D--xN7lVdaV1gs2Hs1U--ayEk8FRzX75Epx5M%2BU1D4w%3D%3D; Path=/; Secure; HttpOnly;jwt=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltVjVTbWhpUjJOcFQybEtTVlY2U1RGT2FVbzVMbVY1U25wa1YwbHBUMmxKTTAweVRteGFWR014VFhrd05FMTZaR2hNVkZGNFQwUkZkRmxxV1hwTmFUQjNXa1JuTUZsdFZteE5iVTVyVDBkUmFVeERTbnBaTTBGcFQybEtNV015Vm5sSmFYZHBXVmhXYTBscWNIVmtWM2h6VEVOS2NGbFlVV2xQYWtVelRsUkJkMDFFVlRWTlZHdHpTVzFXTkdORFNUWk5WR014VFVSQk5VMXFUWGhQVTNkcFlXNVNjRWxxYjJsWmFrWnJUVzFHYWs0eVVYUmFSRWwzV1drd01GcEVUVEJNVkdodFRWUlpkRTVFWXpCT2VrMTVUMWRHYVZsdFVtdEpiakF1VVhKMllqRlNTR0paTlZkeE1EbFRiamRKZGkwNVR6ZHJiamxSTFRNMmNuTnJkVzB6TnpkVU1XUnJjeUk9IiwiZXhwIjoiMjAyNS0wNi0xNlQxNjo0NToxOS4wMzFaIiwicHVyIjoiY29va2llLmp3dCJ9fQ%3D%3D--61bc13a4d88f51faaae39c35543db0f3db90f4b9; Path=/; Secure; HttpOnly; Expires=Mon, 16 Jun 2025 16:45:19 GMT;`,
//   };
// };

// const tempBearer = () => {
//   return {
//     Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzOTc2OWE4Yy00ZTBlLTRhYzctYjZiNC1kM2YwZGQ0MTQ1NDkiLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE3NTAwMDYyMDEsImV4cCI6MTc1MDA5MjYwMSwianRpIjoiMzAzYzRiN2YtNjkxOC00YWVlLTkzMTMtZmU5ZjdkYTI2OTBhIn0.o6wDxt1yQ-JnQKLJwyhi9DXFBV4Mt9D1t4rbfGiCYLs`,
//   };
// };

const createCompany = (body: unknown) => {
  return apiCall(API_CREATE_NEW_COMPANY, body);
};

export const useCreateCompanyHandler = () => {
  return useGenericMutation([M_CREATE_COMPANY], (body) => createCompany(body));
};
const updateCompany = (body: any) => {
  const { id, ...rest } = body?.company || {};
  return apiCall(
    `${API_CREATE_NEW_COMPANY}/${id}`,
    { company: rest },
    {
      method: "PUT",
    }
  );
};

export const useUpdateCompanyHandler = () => {
  return useGenericMutation([M_UPDATE_COMPANY], (body) => updateCompany(body));
};
const deleteCompany = (id: string) => {
  return apiCall(`${API_COMPANIES}/${id}`, null, {
    method: "DELETE",
  });
};

export const useCompanyDeleteHandler = () => {
  return useGenericMutation([M_DELETE_COMPANY], (body) => deleteCompany(body));
};

const createCandidate = (body: unknown) => {
  return apiCall(API_CREATE_NEW_CANDIDATE, createForm(body));
};

export const useCreateCandidateHandler = () => {
  return useGenericMutation([M_CREATE_CANDIDATE], (body) =>
    createCandidate(body)
  );
};
const listCompanies = async () => {
  const obj = await apiCall(API_LIST_ALL_COMPANIES, null, {
    method: "GET",
  });
  return obj?.data?.companies;
};

export const useCompanyList = () => {
  return useGenericQuery([Q_LIST_COMPANIES], listCompanies);
};
