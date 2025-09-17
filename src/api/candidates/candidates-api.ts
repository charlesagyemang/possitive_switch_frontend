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
import { useQueryClient } from "@tanstack/react-query";

const listCandidates = async (company_id: string) => {
  console.log("🔍 Fetching candidates for company_id:", company_id);
  const obj = await apiCall(
    `${API_COMPANIES}/${company_id}/candidates_deep`,
    null,
    {
      method: "GET",
    }
  );
  console.log("📦 Raw API response:", obj);
  console.log("👥 Candidates payload:", obj?.data?.company?.candidates);
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

const fetchCandidateByApiKey = async (apiKey: string) => {
  console.log("🔍 Fetching candidate by API key:", apiKey);
  // Try the endpoint that matches your backend structure
  // If apiKey looks like a UUID (candidate ID), try using it directly
  if (apiKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    console.log("🆔 Detected UUID format, trying direct candidate endpoint");
    const obj = await apiCall(`${API_CANDIDATES}/${apiKey}`, null, { method: "GET" });
    console.log("👤 Candidate API response (direct):", obj);
    console.log("📋 Candidate data:", obj?.data?.candidate);
    return obj?.data?.candidate;
  } else {
    console.log("🔑 Using API key endpoint");
    const obj = await apiCall(`${API_CANDIDATES}/api-key/${apiKey}`, null, { method: "GET" });
    console.log("👤 Candidate API response (api-key):", obj);
    console.log("📋 Candidate data:", obj?.data?.candidate);
    return obj?.data?.candidate;
  }
};

export const useCandidateByApiKey = (apiKey: string) => {
  return useGenericQuery(
    ["candidate-by-api-key", apiKey], 
    () => fetchCandidateByApiKey(apiKey), 
    { enabled: !!apiKey }
  );
};

// Candidate Company Documents API functions
const fetchCandidateSharedDocuments = async (candidateId: string) => {
  console.log("🔍 Fetching shared documents for candidate:", candidateId);
  const obj = await apiCall(`${API_CANDIDATES}/${candidateId}/candidate_company_documents`, null, { method: "GET" });
  console.log("📋 Shared documents response:", obj);
  return obj?.data?.shared_documents || [];
};

const shareDocumentWithCandidate = async (candidateId: string, documentId: string, description?: string) => {
  console.log("📤 Sharing document with candidate:", { candidateId, documentId, description });
  const body = {
    candidate_company_document: {
      company_document_id: documentId,
      description: description || ""
    }
  };
  const obj = await apiCall(`${API_CANDIDATES}/${candidateId}/candidate_company_documents`, body, { method: "POST" });
  console.log("✅ Document shared response:", obj);
  return obj?.data?.shared_document;
};

const removeDocumentShare = async (shareId: string) => {
  console.log("🗑️ Removing document share:", shareId);
  const obj = await apiCall(`${API_CANDIDATES.replace('/candidates', '/candidate_company_documents')}/${shareId}`, null, { method: "DELETE" });
  console.log("✅ Document share removed:", obj);
  return obj;
};

// React Query hooks for candidate document sharing
export const useCandidateSharedDocuments = (candidateId: string) => {
  return useGenericQuery(
    ["candidate-shared-documents", candidateId], 
    () => fetchCandidateSharedDocuments(candidateId), 
    { enabled: !!candidateId }
  );
};

export const useShareDocumentWithCandidate = (candidateId: string) => {
  return useGenericMutation(
    ["share-document-with-candidate"],
    ({ documentId, description }: { documentId: string; description?: string }) => 
      shareDocumentWithCandidate(candidateId, documentId, description)
  );
};

export const useRemoveDocumentShare = (candidateId: string) => {
  return useGenericMutation(
    ["remove-document-share"],
    (shareId: string) => removeDocumentShare(shareId)
  );
};

// Get shared documents for a candidate (candidate-side API)
const fetchCandidateSharedDocumentsForCandidate = async (candidateId: string) => {
  console.log("🔍 Fetching shared documents for candidate (candidate view):", candidateId);
  const obj = await apiCall(`${API_CANDIDATES}/${candidateId}/candidate_company_documents`, null, { method: "GET" });
  console.log("📋 Shared documents response (candidate view):", obj);
  return obj?.data?.shared_documents || [];
};

export const useCandidateSharedDocumentsForCandidate = (candidateId: string) => {
  return useGenericQuery(
    ["candidate-shared-documents-candidate-view", candidateId], 
    () => fetchCandidateSharedDocumentsForCandidate(candidateId), 
    { enabled: !!candidateId }
  );
};
