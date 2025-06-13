export type Activity = {
  id: string;
  created_at: string;
  type: "invite" | "sign" | "add" | "accept";
  actor: string; // Can be a lightweight user object later
  notes: string;
};
export const ACTIVITIES_EXAMPLE: Activity[] = [
  {
    id: "1",
    created_at: "2024-06-01T10:00:00Z",
    type: "invite",
    actor: "user_001",
    notes: "Invited John Doe to join the project.",
  },
  {
    id: "2",
    created_at: "2024-06-01T10:05:00Z",
    type: "sign",
    actor: "user_002",
    notes: "Signed the agreement document.",
  },
  {
    id: "3",
    created_at: "2024-06-01T10:10:00Z",
    type: "add",
    actor: "user_003",
    notes: "Added a new task to the board.",
  },
  {
    id: "4",
    created_at: "2024-06-01T10:15:00Z",
    type: "accept",
    actor: "user_004",
    notes: "Accepted the invitation to collaborate.",
  },
  {
    id: "5",
    created_at: "2024-06-01T10:20:00Z",
    type: "invite",
    actor: "user_005",
    notes: "Invited Jane Smith to the workspace.",
  },
  {
    id: "6",
    created_at: "2024-06-01T10:25:00Z",
    type: "sign",
    actor: "user_006",
    notes: "Signed the NDA.",
  },
  {
    id: "7",
    created_at: "2024-06-01T10:30:00Z",
    type: "add",
    actor: "user_007",
    notes: "Added a new member to the team.",
  },
  {
    id: "8",
    created_at: "2024-06-01T10:35:00Z",
    type: "accept",
    actor: "user_008",
    notes: "Accepted the project guidelines.",
  },
  {
    id: "9",
    created_at: "2024-06-01T10:40:00Z",
    type: "invite",
    actor: "user_009",
    notes: "Invited Alex Lee to join the event.",
  },
  {
    id: "10",
    created_at: "2024-06-01T10:45:00Z",
    type: "add",
    actor: "user_010",
    notes: "Added a new document to the shared folder.",
  },
];
