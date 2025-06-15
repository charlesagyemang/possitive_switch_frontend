import { Handshake, Mail, PersonStanding, Plus } from "lucide-react";

export const companyDashboardCards = [
  {
    title: "Total Invites",
    value: 42,
    description: "Total candidates invited to this company",
    icon: <Mail className="w-7 h-7 text-blue-600" />,
    gradient:
      "from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800 dark:to-gray-900",
    ring: "ring-2 ring-blue-400/30",
  },
  {
    title: "Accepted Invites",
    value: 18,
    description: "Candidates who have accepted the invitation",
    icon: <Handshake className="w-7 h-7 text-green-600" />,
    gradient:
      "from-green-100 via-green-50 to-white dark:from-green-900 dark:via-green-800 dark:to-gray-900",
    ring: "ring-2 ring-green-400/30",
  },
  {
    title: "Pending Invites",
    value: 7,
    description: "Invitations awaiting response",
    icon: <Plus className="w-7 h-7 text-yellow-600" />,
    gradient:
      "from-yellow-100 via-yellow-50 to-white dark:from-yellow-900 dark:via-yellow-800 dark:to-gray-900",
    ring: "ring-2 ring-yellow-400/30",
  },
  {
    title: "Employees",
    value: 3,
    description: "Active employees in this company",
    icon: <PersonStanding className="w-7 h-7 text-purple-600" />,
    gradient:
      "from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-900",
    ring: "ring-2 ring-purple-400/30",
  },
];
