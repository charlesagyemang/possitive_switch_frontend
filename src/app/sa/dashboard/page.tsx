"use client";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import PageTitle from "@/components/built/text/page-title";
import { Smile } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users, UserCheck, Building2, User } from "lucide-react";

export default function SadminDashboard() {
  return (
    <SuperAdminRoot>
      <SadminSpace>
        <PageTitle
          // Icon={Smile}
          title="Welcome, Mr Admin"
          description="You are a super admin, manage all the companies and candidates from here!"
        />

        <div className="mt-6">
          {/*
            Dashboard cards data
            */}
          {(() => {
            const cards = [
              {
                title: "Candidates Invited",
                description:
                  "Total number of candidates invited for all companies",
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

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                  <Card
                    key={card.title}
                    className={`border-none shadow-lg hover:shadow-xl transition-shadow duration-200 ${card.cardBg}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {card.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                          {card.description}
                        </CardDescription>
                      </div>
                      <span
                        className={`rounded-full p-3 flex items-center justify-center ${card.iconBg} shadow-md`}
                      >
                        <card.icon className="w-6 h-6" />
                      </span>
                    </CardHeader>
                    <CardContent>
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {card.value}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      </SadminSpace>
    </SuperAdminRoot>
  );
}
