export type ApiContractTemplate = {
  id: string;
  name: string;
  hellosign_template_id: string;
  variables: ContractVariable[];
  email_template_id: string | null;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  logo_url?: string;
};
export type ContractVariable = {
  name: string;
  type: string;
};
export type ApiCandidateContract = {
  id: string;
  candidate_id: string;
  contract_template_id: string;
  data: Record<string, string>;
  status: string;
  signature_request_id: string | null;
  created_at: string;
  updated_at: string;
  contract_template : ApiContractTemplate
};

export type ApiCandidateContractWithTemplate = ApiCandidateContract & {
  contract_template: ApiContractTemplate;
};


export const CONTRACT_TEMPLATE_EXAMPLES: ApiContractTemplate[] = [
  {
    id: "1",
    name: "Employment Agreement",
    hellosign_template_id: "hs_temp_001",
    variables: [
      { name: "employee_name", type: "string" },
      { name: "start_date", type: "string" },
      { name: "position", type: "string" }
    ],
    email_template_id: "email_001",
    description: "Standard employment agreement template.",
    active: true,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "NDA",
    hellosign_template_id: "hs_temp_002",
    variables: [
      { name: "party_name", type: "string" },
      { name: "effective_date", type: "string" }
    ],
    email_template_id: "email_002",
    description: "Non-disclosure agreement template.",
    active: true,
    created_at: "2024-01-02T11:00:00Z",
    updated_at: "2024-01-02T11:00:00Z",
  },
  {
    id: "3",
    name: "Consulting Agreement",
    hellosign_template_id: "hs_temp_003",
    variables: [
      { name: "consultant_name", type: "string" },
      { name: "project_name", type: "string" },
      { name: "rate", type: "string" }
    ],
    email_template_id: "email_003",
    description: "Consulting services agreement.",
    active: true,
    created_at: "2024-01-03T12:00:00Z",
    updated_at: "2024-01-03T12:00:00Z",
  },
  {
    id: "4",
    name: "Internship Agreement",
    hellosign_template_id: "hs_temp_004",
    variables: [
      { name: "intern_name", type: "string" },
      { name: "duration", type: "string" }
    ],
    email_template_id: "email_004",
    description: "Agreement for internship positions.",
    active: true,
    created_at: "2024-01-04T13:00:00Z",
    updated_at: "2024-01-04T13:00:00Z",
  },
  {
    id: "5",
    name: "Freelance Contract",
    hellosign_template_id: "hs_temp_005",
    variables: [
      { name: "freelancer_name", type: "string" },
      { name: "deliverables", type: "string" }
    ],
    email_template_id: "email_005",
    description: "Freelance work contract.",
    active: true,
    created_at: "2024-01-05T14:00:00Z",
    updated_at: "2024-01-05T14:00:00Z",
  },
  {
    id: "6",
    name: "Sales Agreement",
    hellosign_template_id: "hs_temp_006",
    variables: [
      { name: "buyer_name", type: "string" },
      { name: "item", type: "string" },
      { name: "price", type: "string" }
    ],
    email_template_id: "email_006",
    description: "Sales agreement template.",
    active: true,
    created_at: "2024-01-06T15:00:00Z",
    updated_at: "2024-01-06T15:00:00Z",
  },
  {
    id: "7",
    name: "Partnership Agreement",
    hellosign_template_id: "hs_temp_007",
    variables: [
      { name: "partner1", type: "string" },
      { name: "partner2", type: "string" },
      { name: "partnership_terms", type: "string" }
    ],
    email_template_id: "email_007",
    description: "Business partnership agreement.",
    active: true,
    created_at: "2024-01-07T16:00:00Z",
    updated_at: "2024-01-07T16:00:00Z",
  },
  {
    id: "8",
    name: "Lease Agreement",
    hellosign_template_id: "hs_temp_008",
    variables: [
      { name: "tenant_name", type: "string" },
      { name: "property_address", type: "string" },
      { name: "lease_term", type: "string" }
    ],
    email_template_id: "email_008",
    description: "Property lease agreement.",
    active: true,
    created_at: "2024-01-08T17:00:00Z",
    updated_at: "2024-01-08T17:00:00Z",
  },
  {
    id: "9",
    name: "Supplier Agreement",
    hellosign_template_id: "hs_temp_009",
    variables: [
      { name: "supplier_name", type: "string" },
      { name: "goods", type: "string" },
      { name: "delivery_date", type: "string" }
    ],
    email_template_id: "email_009",
    description: "Supplier contract template.",
    active: true,
    created_at: "2024-01-09T18:00:00Z",
    updated_at: "2024-01-09T18:00:00Z",
  },
  {
    id: "10",
    name: "Termination Agreement",
    hellosign_template_id: "hs_temp_010",
    variables: [
      { name: "employee_name", type: "string" },
      { name: "termination_date", type: "string" }
    ],
    email_template_id: "email_010",
    description: "Employment termination agreement.",
    active: true,
    created_at: "2024-01-10T19:00:00Z",
    updated_at: "2024-01-10T19:00:00Z",
  },
];




export const CANDIDATE_CONTRACT_EXAMPLES: ApiCandidateContract[] = [
  {
    id: "c1",
    candidate_id: "cand_001",
    contract_template_id: "1",
    data: {
      employee_name: "Alice Smith",
      start_date: "2024-02-01",
      position: "Engineer",
    },
    status: "signed",
    signature_request_id: "sig_001",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[0],
  },
  {
    id: "c2",
    candidate_id: "cand_002",
    contract_template_id: "2",
    data: { party_name: "Bob Johnson", effective_date: "2024-02-02" },
    status: "pending",
    signature_request_id: null,
    created_at: "2024-02-02T11:00:00Z",
    updated_at: "2024-02-02T11:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[1],
  },
  {
    id: "c3",
    candidate_id: "cand_003",
    contract_template_id: "3",
    data: {
      consultant_name: "Carol Lee",
      project_name: "Website Redesign",
      rate: "100/hr",
    },
    status: "sent",
    signature_request_id: "sig_003",
    created_at: "2024-02-03T12:00:00Z",
    updated_at: "2024-02-03T12:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[2],
  },
  {
    id: "c4",
    candidate_id: "cand_004",
    contract_template_id: "4",
    data: { intern_name: "David Kim", duration: "3 months" },
    status: "signed",
    signature_request_id: "sig_004",
    created_at: "2024-02-04T13:00:00Z",
    updated_at: "2024-02-04T13:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[3],
  },
  {
    id: "c5",
    candidate_id: "cand_005",
    contract_template_id: "5",
    data: { freelancer_name: "Eva Green", deliverables: "Logo Design" },
    status: "pending",
    signature_request_id: null,
    created_at: "2024-02-05T14:00:00Z",
    updated_at: "2024-02-05T14:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[4],
  },
  {
    id: "c6",
    candidate_id: "cand_006",
    contract_template_id: "6",
    data: { buyer_name: "Frank White", item: "Laptop", price: "1200" },
    status: "sent",
    signature_request_id: "sig_006",
    created_at: "2024-02-06T15:00:00Z",
    updated_at: "2024-02-06T15:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[5],
  },
  {
    id: "c7",
    candidate_id: "cand_007",
    contract_template_id: "7",
    data: {
      partner1: "Grace Hall",
      partner2: "Henry Ford",
      partnership_terms: "50/50",
    },
    status: "signed",
    signature_request_id: "sig_007",
    created_at: "2024-02-07T16:00:00Z",
    updated_at: "2024-02-07T16:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[6],
  },
  {
    id: "c8",
    candidate_id: "cand_008",
    contract_template_id: "8",
    data: {
      tenant_name: "Ivy Brown",
      property_address: "123 Main St",
      lease_term: "1 year",
    },
    status: "pending",
    signature_request_id: null,
    created_at: "2024-02-08T17:00:00Z",
    updated_at: "2024-02-08T17:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[7],
  },
  {
    id: "c9",
    candidate_id: "cand_009",
    contract_template_id: "9",
    data: {
      supplier_name: "Jack Black",
      goods: "Office Chairs",
      delivery_date: "2024-03-01",
    },
    status: "sent",
    signature_request_id: "sig_009",
    created_at: "2024-02-09T18:00:00Z",
    updated_at: "2024-02-09T18:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[8],
  },
  {
    id: "c10",
    candidate_id: "cand_010",
    contract_template_id: "10",
    data: { employee_name: "Karen Young", termination_date: "2024-03-15" },
    status: "signed",
    signature_request_id: "sig_010",
    created_at: "2024-02-10T19:00:00Z",
    updated_at: "2024-02-10T19:00:00Z",
    contract_template: CONTRACT_TEMPLATE_EXAMPLES[9],
  },
];
