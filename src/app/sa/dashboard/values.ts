import { Building2, User, UserCheck, Users } from "lucide-react";

export  const dashboardCards = [
    {
      title: "Candidates Invited",
      description: "Total number of candidates invited for all companies",
      value: 120,
      icon: Users,
      iconBg: "bg-white/70 text-blue-700",
      cardBg:
        "bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-900",
    },
    {
      title: "Candidates Responded",
      description: "Candidates who have responded from all companies",
      value: 85,
      icon: UserCheck,
      iconBg: "bg-white/70 text-green-700",
      cardBg:
        "bg-gradient-to-br from-green-100 via-green-50 to-white dark:from-green-900 dark:via-green-800 dark:to-gray-900",
    },
    {
      title: "Companies",
      description: "Companies that you manage on this platform",
      value: 12,
      icon: Building2,
      iconBg: "bg-white/70 text-purple-700",
      cardBg:
        "bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800 dark:to-gray-900",
    },
    {
      title: "Employees",
      description: "Total candidates/employees in all companies",
      value: 340,
      icon: User,
      iconBg: "bg-white/70 text-yellow-700",
      cardBg:
        "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white dark:from-yellow-900 dark:via-yellow-800 dark:to-gray-900",
    },
  ];