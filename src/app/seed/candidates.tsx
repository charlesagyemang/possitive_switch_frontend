import {
  CheckCircleIcon,
  BookOpenIcon,
  UserPlusIcon,
  BadgeCheckIcon,
  Clock,
} from "lucide-react";

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


export type ApiCandidate = { 
  id: string;
  email: string;
  job_title: string;
  name: string;
  status?: "pending" | "signed" | "orrientation" | "onboarding" | "completed";
  created_at?: string;
}
export type CandidateInvitation = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  status: "pending" | "signed" | "orrientation" | "onboarding" | "completed";
  deadline: string;
};

export const INVITATION_STATUS = [
  {
    value: "pending",
    label: "Pending",
    Icon: Clock,
  },
  {
    value: "signed",
    label: "Signed",
    Icon: CheckCircleIcon,
  },
  {
    value: "orrientation",
    label: "Orientation",
    Icon: BookOpenIcon,
  },
  {
    value: "onboarding",
    label: "Onboarding",
    Icon: UserPlusIcon,
  },
  {
    value: "completed",
    label: "Completed",
    Icon: BadgeCheckIcon,
  },
];

export const INVITATION_EXAMPLES: CandidateInvitation[] = [
  {
    id: "1",
    email: "alice.smith@example.com",
    first_name: "Alice",
    last_name: "Smith",
    gender: "Female",
    status: "pending",
    deadline: "2024-07-31",
  },
  {
    id: "2",
    email: "bob.jones@example.com",
    first_name: "Bob",
    last_name: "Jones",
    gender: "Male",
    status: "signed",
    deadline: "2024-07-31",
  },
  {
    id: "3",
    email: "carol.brown@example.com",
    first_name: "Carol",
    last_name: "Brown",
    gender: "Female",
    status: "orrientation",
    deadline: "2024-07-31",
  },
  {
    id: "4",
    email: "david.wilson@example.com",
    first_name: "David",
    last_name: "Wilson",
    gender: "Male",
    status: "onboarding",
    deadline: "2024-07-31",
  },
  {
    id: "5",
    email: "emma.johnson@example.com",
    first_name: "Emma",
    last_name: "Johnson",
    gender: "Female",
    status: "completed",
    deadline: "2024-07-31",
  },
  {
    id: "6",
    email: "frank.miller@example.com",
    first_name: "Frank",
    last_name: "Miller",
    gender: "Male",
    status: "pending",
    deadline: "2024-07-31",
  },
  {
    id: "7",
    email: "grace.lee@example.com",
    first_name: "Grace",
    last_name: "Lee",
    gender: "Female",
    status: "signed",
    deadline: "2024-07-31",
  },
  {
    id: "8",
    email: "henry.moore@example.com",
    first_name: "Henry",
    last_name: "Moore",
    gender: "Male",
    status: "orrientation",
    deadline: "2024-07-31",
  },
  {
    id: "9",
    email: "isabel.taylor@example.com",
    first_name: "Isabel",
    last_name: "Taylor",
    gender: "Female",
    status: "onboarding",
    deadline: "2024-07-31",
  },
  {
    id: "10",
    email: "jack.thomas@example.com",
    first_name: "Jack",
    last_name: "Thomas",
    gender: "Male",
    status: "completed",
    deadline: "2024-07-31",
  },
];
