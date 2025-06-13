export type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  gender?: string;
  country?: string;
  resume_url?: string; // Optional field for resume URL
  created_at: string;
  updated_at: string;
};
