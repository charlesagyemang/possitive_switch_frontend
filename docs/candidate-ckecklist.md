# CandidateChecklist API Integration Guide

## Overview
The CandidateChecklist feature allows candidates to have personalized checklists with file attachments for their onboarding process.

## Authentication
All endpoints support multiple authentication methods for maximum flexibility:

### 1. JWT Token (Users/Companies)
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

### 2. Company API Key
```javascript
headers: {
  'Authorization': 'YOUR_COMPANY_API_KEY'
}
```

### 3. Candidate API Key
```javascript
headers: {
  'Authorization': 'YOUR_CANDIDATE_API_KEY'
}
```

**Access Control:**
- **Users (JWT)**: Can manage checklists for candidates in their companies
- **Companies (API Key)**: Can manage checklists for their candidates
- **Candidates (API Key)**: Can only access their own checklists

## Base URL Structure
All checklist endpoints are nested under candidates:
```
/api/v1/candidates/:candidate_id/candidate_checklists
```

## Quick Start Examples

### 1. Get All Checklists for a Candidate

**Using JWT (Company User):**
```javascript
GET /api/v1/candidates/123/candidate_checklists
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Using Company API Key:**
```javascript
GET /api/v1/candidates/123/candidate_checklists
Authorization: company_api_key_abc123...
```

**Using Candidate API Key (candidate accessing their own):**
```javascript
GET /api/v1/candidates/123/candidate_checklists
Authorization: candidate_api_key_xyz789...
```

Response:
{
  "success": true,
  "message": "Candidate checklists fetched successfully",
  "data": {
    "candidate_checklists": [
      {
        "id": "uuid",
        "name": "Upload ID Document",
        "description": "Please upload a copy of your government-issued ID",
        "attachment_type": "document",
        "completed": false,
        "completed_at": null,
        "position": 1,
        "file_url": "https://...",
        "file_name": "id_template.pdf",
        "file_size": 1024000,
        "file_type": "application/pdf"
      }
    ]
  }
}
```

### 2. Create New Checklist Item (File Optional)
```javascript
POST /api/v1/candidates/123/candidate_checklists
Content-Type: application/json

Body:
{
  "candidate_checklist": {
    "name": "Upload Tax Forms",
    "description": "Please upload your W-4 form",
    "attachment_type": "tax_document",
    "position": 2
  }
}

// OR with file upload:
Content-Type: multipart/form-data
Form Data:
candidate_checklist[name]: "Upload Tax Forms"
candidate_checklist[description]: "Please upload your W-4 form"
candidate_checklist[attachment_type]: "tax_document"
candidate_checklist[position]: 2
candidate_checklist[file]: [FILE_OBJECT]
```

### 2.1. Upload File to Existing Checklist Item
```javascript
POST /api/v1/candidates/123/candidate_checklists/456/upload_file
Content-Type: multipart/form-data

Form Data:
file: [FILE_OBJECT]
```

### 3. Mark Checklist Item as Complete
```javascript
PATCH /api/v1/candidates/123/candidate_checklists/456/complete

Body:
{
  "completed": true
}

Response:
{
  "success": true,
  "message": "Candidate checklist marked as completed",
  "data": {
    "candidate_checklist": {
      "id": "456",
      "completed": true,
      "completed_at": "2025-09-16T11:30:00Z"
    }
  }
}
```

### 4. Download Attached File

**Option 1: API Request with Authorization Header**
```javascript
GET /api/v1/candidates/123/candidate_checklists/456/download
Authorization: Bearer YOUR_JWT_TOKEN
// or
Authorization: YOUR_COMPANY_API_KEY  
// or
Authorization: YOUR_CANDIDATE_API_KEY

// This will redirect to the secure file URL
```

**Option 2: Direct Browser Access with Token Parameter**
```javascript
GET /api/v1/candidates/123/candidate_checklists/456/download?token=CANDIDATE_API_KEY

// Perfect for direct file downloads in browser
// Use the candidate's API key as the token parameter
```

### 5. Get Candidate with All Data (Including Checklists)
```javascript
GET /api/v1/candidates/api-key/YOUR_CANDIDATE_API_KEY

Response includes:
{
  "data": {
    "candidate": {
      "id": "123",
      "name": "John Doe",
      // ... other candidate data
      "candidate_checklists": [
        {
          "id": "uuid",
          "name": "Upload ID Document",
          "completed": false,
          "file_url": "https://...",
          // ... full checklist data
        }
      ]
    }
  }
}
```

## Frontend Implementation Patterns

### React Example Component
```jsx
const CandidateChecklist = ({ candidateId }) => {
  const [checklists, setChecklists] = useState([]);
  
  // Fetch checklists
  useEffect(() => {
    fetch(`/api/v1/candidates/${candidateId}/candidate_checklists`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
    .then(res => res.json())
    .then(data => setChecklists(data.data.candidate_checklists));
  }, [candidateId]);

  // Mark as complete
  const markComplete = async (checklistId, completed) => {
    await fetch(`/api/v1/candidates/${candidateId}/candidate_checklists/${checklistId}/complete`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });
  };

  // File upload
  const uploadChecklist = async (formData) => {
    await fetch(`/api/v1/candidates/${candidateId}/candidate_checklists`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: formData // multipart/form-data
    });
  };

  return (
    <div>
      {checklists.map(item => (
        <div key={item.id} className="checklist-item">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          
          {item.file_url && (
            <a href={`/api/v1/candidates/${candidateId}/candidate_checklists/${item.id}/download`}>
              Download: {item.file_name}
            </a>
          )}
          
          <button onClick={() => markComplete(item.id, !item.completed)}>
            {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      ))}
    </div>
  );
};
```

## All Available Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/candidate_checklists` | List all checklists |
| `POST` | `/candidate_checklists` | Create new checklist (file optional) |
| `GET` | `/candidate_checklists/:id` | Get single checklist |
| `PATCH` | `/candidate_checklists/:id` | Update checklist |
| `DELETE` | `/candidate_checklists/:id` | Delete checklist |
| `PATCH` | `/candidate_checklists/:id/complete` | Mark complete/incomplete |
| `GET` | `/candidate_checklists/:id/download` | Download file |
| `POST` | `/candidate_checklists/:id/upload_file` | Upload file to existing item |
| `POST` | `/candidate_checklists/bulk_create` | Create multiple |
| `DELETE` | `/candidate_checklists/bulk_destroy` | Delete multiple |

## File Upload Requirements
- Use `multipart/form-data` content type for file uploads
- File field name: `candidate_checklist[file]` (for create) or `file` (for upload_file)
- Include other fields as form data when creating
- **Files are optional** - checklist items can be created without files and files uploaded later
- Use `/upload_file` endpoint to add files to existing checklist items

## Response Format
All responses follow the standard format:
```json
{
  "success": true/false,
  "message": "Description of result",
  "data": { ... },
  "errors": [ ... ] // Only on failure
}
```

## Common Use Cases

1. **Onboarding Dashboard**: Display checklist progress with completion status
2. **File Collection**: Allow candidates to upload required documents
3. **Progress Tracking**: Show completion percentage and remaining items
4. **Document Preview**: Use file URLs to display/download attachments
5. **Admin Management**: Companies can create/manage checklists for candidates

## Notes
- File URLs expire after 1 hour for security
- Checklists are ordered by `position` field
- Files are stored securely using Active Storage
- All endpoints support the same authentication methods as other candidate endpoints
