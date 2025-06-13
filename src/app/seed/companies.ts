export type Company = {
  id: string;
  name: string;
  candidates: number; // later will be a list
  employees: number; // later will be a list
  created_at: string;
  updated_at: string;
};

export const companyData: Company[] = [
  {
    id: "1",
    name: "TechNova Solutions",
    candidates: 5,
    employees: 20,
    created_at: "2023-01-10T09:00:00Z",
    updated_at: "2023-01-10T09:00:00Z",
  },
  {
    id: "2",
    name: "GreenLeaf Ventures",
    candidates: 3,
    employees: 15,
    created_at: "2023-02-15T10:30:00Z",
    updated_at: "2023-02-15T10:30:00Z",
  },
  {
    id: "3",
    name: "BluePeak Analytics",
    candidates: 2,
    employees: 12,
    created_at: "2023-03-20T11:45:00Z",
    updated_at: "2023-03-20T11:45:00Z",
  },
  {
    id: "4",
    name: "UrbanEdge Media",
    candidates: 4,
    employees: 18,
    created_at: "2023-04-05T08:20:00Z",
    updated_at: "2023-04-05T08:20:00Z",
  },
  {
    id: "5",
    name: "Solaris Health",
    candidates: 6,
    employees: 25,
    created_at: "2023-05-12T14:10:00Z",
    updated_at: "2023-05-12T14:10:00Z",
  },
  {
    id: "6",
    name: "Quantum Retail",
    candidates: 1,
    employees: 10,
    created_at: "2023-06-18T16:00:00Z",
    updated_at: "2023-06-18T16:00:00Z",
  },
  {
    id: "7",
    name: "BrightPath Logistics",
    candidates: 3,
    employees: 14,
    created_at: "2023-07-22T12:30:00Z",
    updated_at: "2023-07-22T12:30:00Z",
  },
  {
    id: "8",
    name: "Crestview Consulting",
    candidates: 2,
    employees: 8,
    created_at: "2023-10-01T11:00:00Z",
    updated_at: "2023-10-01T11:00:00Z",
  },
  {
    id: "11",
    name: "Pioneer Foods",
    candidates: 4,
    employees: 22,
    created_at: "2023-10-15T15:25:00Z",
    updated_at: "2023-10-15T15:25:00Z",
  },
  {
    id: "12",
    name: "Vertex Energy",
    candidates: 5,
    employees: 19,
    created_at: "2023-11-05T10:50:00Z",
    updated_at: "2023-11-05T10:50:00Z",
  },
  {
    id: "13",
    name: "Summit Digital",
    candidates: 3,
    employees: 13,
    created_at: "2023-11-20T14:35:00Z",
    updated_at: "2023-11-20T14:35:00Z",
  },
  {
    id: "14",
    name: "Harmony Education",
    candidates: 2,
    employees: 16,
    created_at: "2023-12-02T08:10:00Z",
    updated_at: "2023-12-02T08:10:00Z",
  },
  {
    id: "15",
    name: "Atlas Construction",
    candidates: 1,
    employees: 11,
    created_at: "2023-12-18T17:45:00Z",
    updated_at: "2023-12-18T17:45:00Z",
  },
];
