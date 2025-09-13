# 🏢 Company Settings API Documentation

This document outlines the API endpoints for managing company-specific templates that allow each company to customize their onboarding experience.

## 🔐 Authentication
All endpoints require a valid **Bearer token** in the `Authorization` header.

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📧 Company Email Templates

### Base URL
```
/api/v1/companies/:company_id/email_templates
```

### 📋 Get All Company Email Templates
**GET** `/api/v1/companies/:company_id/email_templates`

**Response:**
```json
{
  "success": true,
  "message": "Company email templates fetched",
  "data": {
    "company_email_templates": [
      {
        "id": "uuid",
        "name": "welcome_email",
        "subject": "Welcome to the team!",
        "variables": [
          {"name": "employee_name", "type": "STRING"},
          {"name": "start_date", "type": "DATE"}
        ],
        "description": "Welcome email for new hires",
        "active": true,
        "raw_html": "<html><body>Welcome {{employee_name}}!</body></html>",
        "company_name": "Acme Corp",
        "created_at": "2025-09-13T06:52:38.000Z",
        "updated_at": "2025-09-13T06:52:38.000Z"
      }
    ]
  }
}
```

### 🔍 Get Single Company Email Template
**GET** `/api/v1/companies/:company_id/email_templates/:id`

**Response:**
```json
{
  "success": true,
  "message": "Company email template details",
  "data": {
    "company_email_template": {
      "id": "uuid",
      "name": "welcome_email",
      "subject": "Welcome to the team!",
      "variables": [
        {"name": "employee_name", "type": "STRING"},
        {"name": "start_date", "type": "DATE"}
      ],
      "description": "Welcome email for new hires",
      "active": true,
      "raw_html": "<html><body>Welcome {{employee_name}}!</body></html>",
      "company_name": "Acme Corp"
    }
  }
}
```

### ✅ Create Company Email Template
**POST** `/api/v1/companies/:company_id/email_templates`

**Request Body:**
```json
{
  "company_email_template": {
    "name": "welcome_email",
    "subject": "Welcome to the team!",
    "variables": [
      {"name": "employee_name", "type": "STRING"},
      {"name": "start_date", "type": "DATE"}
    ],
    "description": "Welcome email for new hires",
    "active": true,
    "raw_html": "<html><body>Welcome {{employee_name}}!</body></html>"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company email template created successfully",
  "data": {
    "company_email_template": { /* template object */ }
  }
}
```

### ✏️ Update Company Email Template
**PUT/PATCH** `/api/v1/companies/:company_id/email_templates/:id`

**Request Body:** Same as create

### 🗑️ Delete Company Email Template
**DELETE** `/api/v1/companies/:company_id/email_templates/:id`

**Response:**
```json
{
  "success": true,
  "message": "Company email template deleted successfully"
}
```

---

## 📄 Company Contract Templates

### Base URL
```
/api/v1/companies/:company_id/contract_templates
```

### 📋 Get All Company Contract Templates
**GET** `/api/v1/companies/:company_id/contract_templates`

**Response:**
```json
{
  "success": true,
  "message": "Company contract templates fetched",
  "data": {
    "company_contract_templates": [
      {
        "id": "uuid",
        "name": "Employment Contract",
        "hellosign_template_id": "template_456",
        "variables": [
          {"name": "CANDIDATE_NAME", "type": "STRING"},
          {"name": "CONTRACT_DATE", "type": "DATE"},
          {"name": "SALARY", "type": "STRING"}
        ],
        "company_email_template_id": "email_template_uuid",
        "description": "Standard employment contract",
        "active": true,
        "company_name": "Acme Corp",
        "email_template_name": "welcome_email",
        "created_at": "2025-09-13T06:52:44.000Z"
      }
    ]
  }
}
```

### 🔍 Get Single Company Contract Template
**GET** `/api/v1/companies/:company_id/contract_templates/:id`

### ✅ Create Company Contract Template
**POST** `/api/v1/companies/:company_id/contract_templates`

**Request Body:**
```json
{
  "company_contract_template": {
    "name": "Employment Contract",
    "hellosign_template_id": "template_456",
    "variables": [
      {"name": "CANDIDATE_NAME", "type": "STRING"},
      {"name": "CONTRACT_DATE", "type": "DATE"},
      {"name": "SALARY", "type": "STRING"}
    ],
    "company_email_template_id": "email_template_uuid",
    "description": "Standard employment contract",
    "active": true
  }
}
```

### ✏️ Update Company Contract Template
**PUT/PATCH** `/api/v1/companies/:company_id/contract_templates/:id`

### 🗑️ Delete Company Contract Template
**DELETE** `/api/v1/companies/:company_id/contract_templates/:id`

---

## ✅ Company Onboarding Task Templates

### Base URL
```
/api/v1/companies/:company_id/onboarding_task_templates
```

### 📋 Get All Company Onboarding Task Templates
**GET** `/api/v1/companies/:company_id/onboarding_task_templates`

**Response:**
```json
{
  "success": true,
  "message": "Company onboarding task templates fetched",
  "data": {
    "company_onboarding_task_templates": [
      {
        "id": "uuid",
        "title": "Complete IT setup",
        "description": "Setup laptop and accounts",
        "category": "IT",
        "position": 1,
        "active": true,
        "company_name": "Acme Corp",
        "created_at": "2025-09-13T06:52:47.000Z"
      },
      {
        "id": "uuid",
        "title": "Meet with HR",
        "description": "Initial HR orientation meeting",
        "category": "HR",
        "position": 2,
        "active": true,
        "company_name": "Acme Corp"
      }
    ]
  }
}
```

### 🔍 Get Single Company Onboarding Task Template
**GET** `/api/v1/companies/:company_id/onboarding_task_templates/:id`

### ✅ Create Company Onboarding Task Template
**POST** `/api/v1/companies/:company_id/onboarding_task_templates`

**Request Body:**
```json
{
  "company_onboarding_task_template": {
    "title": "Complete IT setup",
    "description": "Setup laptop and accounts",
    "category": "IT",
    "position": 1,
    "active": true
  }
}
```

**Note:** If `position` is not provided, it will auto-assign the next available position.

### ✏️ Update Company Onboarding Task Template
**PUT/PATCH** `/api/v1/companies/:company_id/onboarding_task_templates/:id`

### 🗑️ Delete Company Onboarding Task Template
**DELETE** `/api/v1/companies/:company_id/onboarding_task_templates/:id`

### 🔄 Reorder Onboarding Task Templates
**PATCH** `/api/v1/companies/:company_id/onboarding_task_templates/reorder`

**Request Body:**
```json
{
  "positions": [
    {"id": "template_uuid_1", "position": 1},
    {"id": "template_uuid_2", "position": 2},
    {"id": "template_uuid_3", "position": 3}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Templates reordered successfully"
}
```

---

## 🚨 Error Responses

All endpoints may return these error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "You need to sign in or sign up before continuing."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Company not found or not yours"
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "message": "Failed to create company email template",
  "errors": [
    "Name can't be blank",
    "Subject can't be blank"
  ]
}
```

---

## 📝 Field Requirements

### Company Email Template
- **Required:** `name`, `subject`, `raw_html`
- **Optional:** `variables`, `description`, `active`
- **Default:** `active: true`, `variables: []`

### Company Contract Template  
- **Required:** `name`
- **Optional:** `hellosign_template_id`, `variables`, `company_email_template_id`, `description`, `active`
- **Default:** `active: true`, `variables: []`

### Company Onboarding Task Template
- **Required:** `title`
- **Optional:** `description`, `category`, `position`, `active`
- **Default:** `active: true`, `position: auto-assigned`

---

## 🔗 Relationships

- `CompanyContractTemplate` can belong to a `CompanyEmailTemplate` via `email_template_id`
- All templates belong to a specific `Company`
- Companies can have multiple templates of each type
- Templates are scoped to the company, ensuring data isolation

---

## 💡 Usage Examples

### Frontend Integration Example (JavaScript/TypeScript)

```typescript
// Get all email templates for a company
const getEmailTemplates = async (companyId: string, token: string) => {
  const response = await fetch(`/api/v1/companies/${companyId}/email_templates`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Create a new contract template
const createContractTemplate = async (companyId: string, templateData: any, token: string) => {
  const response = await fetch(`/api/v1/companies/${companyId}/contract_templates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ company_contract_template: templateData })
  });
  return response.json();
};

// Reorder onboarding tasks
const reorderTasks = async (companyId: string, positions: any[], token: string) => {
  const response = await fetch(`/api/v1/companies/${companyId}/onboarding_task_templates/reorder`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ positions })
  });
  return response.json();
};
```

This completes the Company Settings API implementation! 🎉




# 🏢 Company Settings API Endpoints Summary

## Quick Reference for Frontend Development

### 📧 Company Email Templates
```
GET    /api/v1/companies/:company_id/email_templates           # List all
POST   /api/v1/companies/:company_id/email_templates           # Create
GET    /api/v1/companies/:company_id/email_templates/:id       # Show
PUT    /api/v1/companies/:company_id/email_templates/:id       # Update
DELETE /api/v1/companies/:company_id/email_templates/:id       # Delete
```

### 📄 Company Contract Templates
```
GET    /api/v1/companies/:company_id/contract_templates        # List all
POST   /api/v1/companies/:company_id/contract_templates        # Create
GET    /api/v1/companies/:company_id/contract_templates/:id    # Show
PUT    /api/v1/companies/:company_id/contract_templates/:id    # Update
DELETE /api/v1/companies/:company_id/contract_templates/:id    # Delete
```

### ✅ Company Onboarding Task Templates
```
GET    /api/v1/companies/:company_id/onboarding_task_templates           # List all
POST   /api/v1/companies/:company_id/onboarding_task_templates           # Create
GET    /api/v1/companies/:company_id/onboarding_task_templates/:id       # Show
PUT    /api/v1/companies/:company_id/onboarding_task_templates/:id       # Update
DELETE /api/v1/companies/:company_id/onboarding_task_templates/:id       # Delete
PATCH  /api/v1/companies/:company_id/onboarding_task_templates/reorder   # Reorder
```

## 🔗 Database Structure

### Models Created:
- `CompanyEmailTemplate` → belongs_to :company
- `CompanyContractTemplate` → belongs_to :company, belongs_to :company_email_template (optional)
- `CompanyOnboardingTaskTemplate` → belongs_to :company

### Company Model Updated:
- `has_many :company_email_templates`
- `has_many :company_contract_templates`  
- `has_many :company_onboarding_task_templates`

### Key Features:
- ✅ Full CRUD operations for all template types
- ✅ Company-scoped data (users can only access their company's templates)
- ✅ Automatic position assignment for onboarding tasks
- ✅ Reorder functionality for onboarding task templates
- ✅ Validation and error handling
- ✅ JSON API responses with consistent structure

### Authentication:
- All endpoints require JWT Bearer token
- Company ownership validation on all operations
- Proper error responses for unauthorized access

Ready for frontend integration! 🚀
