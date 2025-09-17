# Candidate Company Documents API

## Overview
The Candidate Company Documents API allows companies to selectively share specific company documents with individual candidates. This system provides controlled document access with optional descriptions for context.

## Base URL
All endpoints are prefixed with `/api/v1/`

## Authentication
All endpoints require authentication via:
- **Company API Key**: Include in `Authorization` header as `Bearer {api_key}`
- **JWT Token**: Include in `Authorization` header as `Bearer {jwt_token}`

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/candidates/:candidate_id/candidate_company_documents` | List shared documents for candidate |
| `GET` | `/candidate_company_documents/:id` | Get specific shared document details |
| `POST` | `/candidates/:candidate_id/candidate_company_documents` | Share document with candidate |
| `PUT/PATCH` | `/candidate_company_documents/:id` | Update sharing description |
| `DELETE` | `/candidate_company_documents/:id` | Remove document sharing |
| `POST` | `/candidates/:candidate_id/candidate_company_documents/bulk_create` | Share multiple documents |
| `DELETE` | `/candidates/:candidate_id/candidate_company_documents/bulk_destroy` | Remove multiple shares |

---

## 1. List Shared Documents for Candidate

**GET** `/api/v1/candidates/:candidate_id/candidate_company_documents`

### Parameters
- `candidate_id` (path, required): UUID of the candidate

### Response
```json
{
  "success": true,
  "data": {
    "shared_documents": [
      {
        "id": "share-uuid",
        "candidate_id": "candidate-uuid",
        "company_document_id": "doc-uuid",
        "description": "Employee handbook for your reference",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
        "company_document": {
          "id": "doc-uuid",
          "name": "Employee Handbook",
          "description": "Company policies and procedures",
          "category": "policies",
          "file_name": "handbook.pdf",
          "file_size": 1024000,
          "file_type": "application/pdf",
          "file_url": "/rails/active_storage/blobs/xyz/handbook.pdf",
          "created_at": "2025-01-01T00:00:00Z",
          "updated_at": "2025-01-01T00:00:00Z"
        }
      }
    ]
  }
}
```

---

## 2. Get Specific Shared Document

**GET** `/api/v1/candidate_company_documents/:id`

### Parameters
- `id` (path, required): UUID of the candidate company document share

### Response
```json
{
  "success": true,
  "data": {
    "shared_document": {
      "id": "share-uuid",
      "candidate_id": "candidate-uuid",
      "company_document_id": "doc-uuid",
      "description": "Employee handbook for your reference",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z",
      "company_document": {
        "id": "doc-uuid",
          "name": "Employee Handbook",
        "description": "Company policies and procedures",
        "file_name": "handbook.pdf",
        "file_size": 1024000,
        "content_type": "application/pdf",
        "download_url": "/rails/active_storage/blobs/xyz/handbook.pdf",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
      },
      "candidate": {
        "id": "candidate-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "job_title": "Software Engineer"
      }
    }
  }
}
```

---

## 3. Share Document with Candidate

**POST** `/api/v1/candidates/:candidate_id/candidate_company_documents`

### Parameters
- `candidate_id` (path, required): UUID of the candidate

### Request Body
```json
{
  "candidate_company_document": {
    "company_document_id": "doc-uuid",
    "description": "Employee handbook for your reference"
  }
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Document shared with candidate successfully",
  "data": {
    "shared_document": {
      "id": "share-uuid",
      "candidate_id": "candidate-uuid",
      "company_document_id": "doc-uuid",
      "description": "Employee handbook for your reference",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z",
      "company_document": {
        "id": "doc-uuid",
          "name": "Employee Handbook",
        "description": "Company policies and procedures",
        "file_name": "handbook.pdf",
        "file_size": 1024000,
        "content_type": "application/pdf",
        "download_url": "/rails/active_storage/blobs/xyz/handbook.pdf",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
      }
    }
  }
}
```

### Error Response (422 Unprocessable Entity)
```json
{
  "success": false,
  "message": "Failed to share document with candidate",
  "errors": [
    "Document already shared with this candidate"
  ]
}
```

---

## 4. Update Shared Document

**PUT/PATCH** `/api/v1/candidate_company_documents/:id`

### Parameters
- `id` (path, required): UUID of the candidate company document share

### Request Body
```json
{
  "candidate_company_document": {
    "description": "Updated description for the shared document"
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Shared document updated successfully",
  "data": {
    "shared_document": {
      "id": "share-uuid",
      "candidate_id": "candidate-uuid",
      "company_document_id": "doc-uuid",
      "description": "Updated description for the shared document",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T01:00:00Z",
      "company_document": { /* ... */ }
    }
  }
}
```

---

## 5. Remove Document Sharing

**DELETE** `/api/v1/candidate_company_documents/:id`

### Parameters
- `id` (path, required): UUID of the candidate company document share

### Response
```json
{
  "success": true,
  "message": "Document sharing removed successfully"
}
```

---

## 6. Bulk Share Documents

**POST** `/api/v1/candidates/:candidate_id/candidate_company_documents/bulk_create`

### Parameters
- `candidate_id` (path, required): UUID of the candidate

### Request Body
```json
{
  "documents": [
    {
      "company_document_id": "doc1-uuid",
      "description": "Employee handbook"
    },
    {
      "company_document_id": "doc2-uuid",
      "description": "Benefits overview"
    }
  ]
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Documents shared successfully",
  "data": {
    "created_shares": [
      {
        "id": "share1-uuid",
        "candidate_id": "candidate-uuid",
        "company_document_id": "doc1-uuid",
        "description": "Employee handbook",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
        "company_document": { /* ... */ }
      },
      {
        "id": "share2-uuid",
        "candidate_id": "candidate-uuid",
        "company_document_id": "doc2-uuid",
        "description": "Benefits overview",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
        "company_document": { /* ... */ }
      }
    ],
    "errors": []
  }
}
```

### Partial Success Response (422 Unprocessable Entity)
```json
{
  "success": false,
  "message": "Some documents failed to share",
  "data": {
    "created_shares": [
      { /* Successfully shared documents */ }
    ],
    "errors": [
      {
        "company_document_id": "doc2-uuid",
        "errors": [
          "Document already shared with this candidate"
        ]
      }
    ]
  }
}
```

---

## 7. Bulk Remove Document Shares

**DELETE** `/api/v1/candidates/:candidate_id/candidate_company_documents/bulk_destroy`

### Parameters
- `candidate_id` (path, required): UUID of the candidate

### Request Body
```json
{
  "document_ids": ["doc1-uuid", "doc2-uuid", "doc3-uuid"]
}
```

### Response
```json
{
  "success": true,
  "message": "3 document shares removed successfully",
  "data": {
    "destroyed_count": 3
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": ["Authentication required"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Candidate not found"
}
```

```json
{
  "success": false,
  "message": "Shared document not found"
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "message": "Failed to share document with candidate",
  "errors": [
    "Company document must belong to the same company as the candidate",
    "Document already shared with this candidate"
  ]
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript Example

```typescript
// Share a document with a candidate
async function shareDocumentWithCandidate(candidateId: string, documentId: string, description?: string) {
  try {
    const response = await fetch(`/api/v1/candidates/${candidateId}/candidate_company_documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        candidate_company_document: {
          company_document_id: documentId,
          description: description
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Document shared successfully:', data.data.shared_document);
      return data.data.shared_document;
    } else {
      console.error('Failed to share document:', data.errors);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error sharing document:', error);
    throw error;
  }
}

// Get shared documents for a candidate
async function getCandidateSharedDocuments(candidateId: string) {
  try {
    const response = await fetch(`/api/v1/candidates/${candidateId}/candidate_company_documents`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.shared_documents;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching shared documents:', error);
    throw error;
  }
}

// Bulk share multiple documents
async function bulkShareDocuments(candidateId: string, documents: Array<{company_document_id: string, description?: string}>) {
  try {
    const response = await fetch(`/api/v1/candidates/${candidateId}/candidate_company_documents/bulk_create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ documents })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error bulk sharing documents:', error);
    throw error;
  }
}
```

---

## Business Logic Notes

### Key Features
1. **Security**: Only documents from the same company as the candidate can be shared
2. **Uniqueness**: Each document can only be shared once with each candidate
3. **Flexibility**: Optional descriptions allow contextual information
4. **Bulk Operations**: Efficient sharing/unsharing of multiple documents
5. **Rich Metadata**: Full document information included in responses

### Use Cases
- **Onboarding**: Share employee handbooks, policies, and forms
- **Role-specific**: Share documents relevant to specific job positions
- **Progressive Disclosure**: Share documents at different stages of onboarding
- **Compliance**: Track what documents have been shared with each candidate

### Best Practices
1. Use descriptive messages in the `description` field
2. Implement proper error handling for bulk operations
3. Cache document lists for better performance
4. Use the bulk endpoints for multiple operations
5. Always check the `success` field in responses before processing data

---

## Model Relationships

```
Company
├── CompanyDocument (has_many)
│   └── CandidateCompanyDocument (has_many)
└── Candidate (has_many)
    └── CandidateCompanyDocument (has_many)
```

This API provides a flexible and secure way to manage document sharing between companies and candidates, with full CRUD operations and bulk capabilities for efficient frontend integration.
