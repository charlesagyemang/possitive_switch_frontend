import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import PageTitle from "@/components/built/text/page-title";
import { Button } from "@/components/ui/button";
import { Landmark, Plus } from "lucide-react";
import React from "react";

function OneCompanyDashboard() {
  const cards = [
    {
      title: "Total Invites",
      value: 42,
      description: "Total candidates invited to this company",
      icon: <Landmark className="w-7 h-7 text-blue-600" />,
      gradient:
        "from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800 dark:to-gray-900",
      ring: "ring-2 ring-blue-400/30",
    },
    {
      title: "Employees",
      value: 18,
      description: "Active employees in this company",
      icon: <Plus className="w-7 h-7 text-green-600" />,
      gradient:
        "from-green-100 via-green-50 to-white dark:from-green-900 dark:via-green-800 dark:to-gray-900",
      ring: "ring-2 ring-green-400/30",
    },
    {
      title: "Pending Invites",
      value: 7,
      description: "Invitations awaiting response",
      icon: <Landmark className="w-7 h-7 text-yellow-600" />,
      gradient:
        "from-yellow-100 via-yellow-50 to-white dark:from-yellow-900 dark:via-yellow-800 dark:to-gray-900",
      ring: "ring-2 ring-yellow-400/30",
    },
    //   {
    //     title: "Departments",
    //     value: 3,
    //     description: "Departments in this company",
    //     icon: <Plus className="w-7 h-7 text-purple-600" />,
    //     gradient:
    //       "from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-900",
    //     ring: "ring-2 ring-purple-400/30",
    //   },
  ];

  return (
    <SuperAdminRoot>
      <SadminSpace>
        <div className="flex items-center justify-between mb-6">
          <PageTitle
            Icon={Landmark}
            title="New Fire Company"
            description="Create a new company to manage candidates and employees."
          />

          <Button variant="outline">
            <Plus /> New Candidate
          </Button>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.title}
                className={`relative overflow-hidden rounded-2xl shadow-md p-6 bg-gradient-to-br ${card.gradient} ${card.ring} transition-transform hover:scale-[1.03]`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                      {card.title}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </div>
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 p-3 shadow">
                    {card.icon}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-400 dark:text-gray-400">
                  {card.description}
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SadminSpace>
    </SuperAdminRoot>
  );
}

export default OneCompanyDashboard;
