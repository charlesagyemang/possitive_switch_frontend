# 📝 Contract Signing API Documentation

## 🎯 Overview

The Contract Signing API enables **multi-party digital contract signing** with public access links. Contracts are created from **company-specific templates** and can be signed by multiple people (candidate + company representatives) without requiring authentication.

**Key Features:**
- ✅ **Company-specific contract templates** - Each company uses their own templates
- ✅ Public signing links (no login required)
- ✅ Multi-party signatures 
- ✅ Real-time signing progress tracking
- ✅ Signature audit trail with IP/browser info
- ✅ Automatic completion detection

**Template System:**
- Contracts now use `company_contract_template_id` instead of global templates
- Each company manages their own contract templates with custom HTML and variables
- Templates include company branding and specific terms

---

## 🔐 Authentication

**Authenticated Endpoints:** Require `Authorization: Bearer <JWT_TOKEN>` header
**Public Endpoints:** No authentication required

---

## 📋 Contract Management (Authenticated)

### Enable Public Signing
**POST** `/api/v1/candidates/:candidate_id/contracts/:id/enable_signing`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "required_signers": [
    "candidate@example.com",
    "hr@company.com"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Public signing enabled",
  "data": {
    "signing_url": "http://localhost:6070/contracts/abc-123-def/sign",
    "signing_token": "abc-123-def-456",
    "required_signers": ["candidate@example.com", "hr@company.com"],
    "signing_status": "open_for_signing"
  }
}
```

### Get Signing Status
**GET** `/api/v1/candidates/:candidate_id/contracts/:id/signing_status`

**Response:**
```json
{
  "success": true,
  "message": "Signing status retrieved",
  "data": {
    "contract": {
      "id": "contract-uuid",
      "signing_status": "partially_signed",
      "public_signing_enabled": true,
      "signing_url": "http://localhost:6070/contracts/abc-123-def/sign",
      "signing_progress": 50,
      "required_signers": ["candidate@example.com", "hr@company.com"],
      "remaining_signers": ["hr@company.com"],
      "signatures": [
        {
          "id": "signature-uuid",
          "signer_name": "John Doe",
          "signer_email": "candidate@example.com",
          "signed_at": "2025-09-14T02:45:00Z"
        }
      ]
    }
  }
}
```

### Disable Public Signing
**DELETE** `/api/v1/candidates/:candidate_id/contracts/:id/disable_signing`

**Response:**
```json
{
  "success": true,
  "message": "Public signing disabled",
  "data": {
    "signing_status": "signing_disabled"
  }
}
```

### Update Required Signers
**POST** `/api/v1/candidates/:candidate_id/contracts/:id/update_required_signers`

**Request Body:**
```json
{
  "required_signers": [
    "candidate@example.com",
    "hr@company.com",
    "ceo@company.com"
  ]
}
```

---

## 🌐 Public Contract Signing (No Authentication)

### View Contract for Signing
**GET** `/api/v1/public/contracts/:token`

**Response:**
```json
{
  "success": true,
  "message": "Contract details retrieved",
  "data": {
    "contract": {
      "id": "contract-uuid",
      "name": "Employment Agreement",
      "candidate": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "company": {
        "name": "ACME Corp"
      },
      "signing_status": "open_for_signing",
      "signing_progress": 0,
      "required_signers": ["john@example.com", "hr@acme.com"],
      "remaining_signers": ["john@example.com", "hr@acme.com"],
      "rendered_html": "<h1>Employment Contract</h1><p>Employee: John Doe</p>...",
      "signatures": []
    }
  }
}
```

### Submit Signature
**POST** `/api/v1/public/contracts/:token/sign`

**Request Body:**
```json
{
  "signer_name": "John Doe",
  "signer_email": "john@example.com",
  "signature_data": {
    "signature_svg": "<svg>...</svg>",
    "signature_image": "data:image/png;base64,..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contract signed successfully",
  "data": {
    "signature": {
      "id": "signature-uuid",
      "signer_name": "John Doe",
      "signer_email": "john@example.com",
      "signed_at": "2025-09-14T02:45:00Z"
    },
    "contract_status": "partially_signed",
    "signing_progress": 50,
    "fully_signed": false,
    "remaining_signers": ["hr@acme.com"]
  }
}
```

### Check Signing Status (Public)
**GET** `/api/v1/public/contracts/:token/status`

**Response:**
```json
{
  "success": true,
  "message": "Contract status retrieved",
  "data": {
    "signing_status": "partially_signed",
    "public_signing_enabled": true,
    "signing_progress": 50,
    "signatures_count": 1,
    "required_signers_count": 2,
    "fully_signed": false
  }
}
```

---

## 📱 Frontend Integration Examples

### React/Next.js Integration

```typescript
// Enable contract signing
const enableContractSigning = async (candidateId: string, contractId: string, signers: string[], token: string) => {
  const response = await fetch(`/api/v1/candidates/${candidateId}/contracts/${contractId}/enable_signing`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ required_signers: signers })
  });
  return response.json();
};

// Get contract for signing (public)
const getContractForSigning = async (signingToken: string) => {
  const response = await fetch(`/api/v1/public/contracts/${signingToken}`);
  return response.json();
};

// Submit signature (public)
const submitSignature = async (signingToken: string, signatureData: any) => {
  const response = await fetch(`/api/v1/public/contracts/${signingToken}/sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(signatureData)
  });
  return response.json();
};

// Get signing status
const getSigningStatus = async (candidateId: string, contractId: string, token: string) => {
  const response = await fetch(`/api/v1/candidates/${candidateId}/contracts/${contractId}/signing_status`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Signature Pad Integration Example

```tsx
import SignatureCanvas from 'react-signature-canvas';

const ContractSigningPage = ({ signingToken }: { signingToken: string }) => {
  const [sigPad, setSigPad] = useState<SignatureCanvas | null>(null);
  const [contract, setContract] = useState(null);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');

  // Load contract data
  useEffect(() => {
    getContractForSigning(signingToken).then(setContract);
  }, [signingToken]);

  const handleSign = async () => {
    if (!sigPad || sigPad.isEmpty()) {
      alert('Please provide a signature');
      return;
    }

    const signatureData = {
      signer_name: signerName,
      signer_email: signerEmail,
      signature_data: {
        signature_svg: sigPad.getTrimmedCanvas().toDataURL('image/svg+xml'),
        signature_image: sigPad.getTrimmedCanvas().toDataURL('image/png')
      }
    };

    try {
      const result = await submitSignature(signingToken, signatureData);
      if (result.success) {
        alert('Contract signed successfully!');
        // Redirect or update UI
      }
    } catch (error) {
      alert('Error signing contract');
    }
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: contract?.data?.contract?.rendered_html }} />
      
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={signerEmail}
          onChange={(e) => setSignerEmail(e.target.value)}
        />
        
        <SignatureCanvas
          ref={(ref) => setSigPad(ref)}
          canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
        />
        
        <button onClick={() => sigPad?.clear()}>Clear</button>
        <button onClick={handleSign}>Sign Contract</button>
      </div>
    </div>
  );
};
```

---

## 🔄 Signing States

| Status | Description |
|--------|-------------|
| `signing_draft` | Contract created but signing not enabled |
| `open_for_signing` | Public signing enabled, no signatures yet |
| `partially_signed` | Some but not all required signatures collected |
| `fully_signed` | All required signatures collected |
| `signing_disabled` | Public signing has been disabled |

---

## 📊 Progress Tracking

```typescript
// Real-time progress component
const SigningProgress = ({ contractId, candidateId, token }: Props) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      getSigningStatus(candidateId, contractId, token).then(setStatus);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Signing Progress: {status?.data?.contract?.signing_progress}%</h3>
      <div>
        <strong>Signed:</strong> {status?.data?.contract?.signatures?.length || 0}
      </div>
      <div>
        <strong>Remaining:</strong> {status?.data?.contract?.remaining_signers?.join(', ')}
      </div>
    </div>
  );
};
```

---

## 🚨 Error Handling

### Common Error Responses

**Contract Not Available (403):**
```json
{
  "success": false,
  "error": "Contract is not available for signing",
  "details": {
    "public_signing_enabled": false,
    "signing_status": "signing_disabled"
  }
}
```

**Invalid Signing Link (404):**
```json
{
  "success": false,
  "error": "Invalid signing link"
}
```

**Already Signed (422):**
```json
{
  "success": false,
  "error": "john@example.com has already signed this contract"
}
```

**Missing Signature (422):**
```json
{
  "success": false,
  "error": "Signature is required"
}
```

---

## 🔗 URL Structure

**Public Signing Link Format:**
```
{FRONTEND_URL}/contracts/{SIGNING_TOKEN}/sign
```

**Example:**
```
https://yourapp.com/contracts/abc-123-def-456/sign
```

The frontend should handle this route and load the contract using the signing token via the public API.

---

This API provides a complete contract signing solution with real-time progress tracking and multi-party signature support! 🚀
