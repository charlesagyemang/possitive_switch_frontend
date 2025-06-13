"use client";
import { ACTIVITIES_EXAMPLE, Activity } from "@/app/seed/activities";
import SuperAdminRoot from "@/app/shared/wrappers/sadmin-root";
import SadminSpace from "@/app/shared/wrappers/sadmin-space";
import { GenericTable } from "@/components/built/table/data-table";
import PageTitle from "@/components/built/text/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Handshake,
  Landmark,
  Mail,
  PersonStanding,
  Plus,
} from "lucide-react";
import React from "react";
import { invitationColumns } from "./company-table-structure";
import {
  CandidateInvitation,
  INVITATION_EXAMPLES,
} from "@/app/seed/candidates";
import { DOption } from "@/components/built/dropdown/custom-dropdown";
import { useRouter, useParams } from "next/navigation";

function OneCompanyDashboard() {
  const router = useRouter();
  const params = useParams();

  const cards = [
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

  const companyId = params.company_id as string;
  const makeActions = (row: CandidateInvitation): DOption[] => {
    return [
      {
        label: "View Details",
        value: "view_details",
        Icon: Eye,
        onClick: () => {
          router.push(`/c/${companyId}/invitation/${row.id}`);
          // handle view details
        },
      },
    ];
  };

  return (
    <SuperAdminRoot>
      <SadminSpace>
        <div className="flex items-center justify-between mb-6">
          <PageTitle
            Icon={Landmark}
            title="New Fire Media"
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
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-8">
          <div className="lg:col-span-7">
            {/* Left side content (70%) */}
            <Card className="shadow-none">
              <CardContent>
                <GenericTable
                  pageSize={7}
                  name="Invited Candidates"
                  columns={invitationColumns({ actions: makeActions })}
                  data={INVITATION_EXAMPLES}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            {/* Right side content (30%) */}

            <Card className="shadow-none">
              <CardContent>
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    Recent Activities
                  </h2>
                  <ul className="space-y-2 overflow-y-scroll scrollbar-hide max-h-[500px]">
                    {ACTIVITIES_EXAMPLE.map((activity) => (
                      <React.Fragment key={activity.id}>
                        <ActivityCard activity={activity} />
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SadminSpace>
    </SuperAdminRoot>
  );
}

export default OneCompanyDashboard;

const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <li
      key={activity.id}
      className="flex items-start gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <div
        className={`flex items-center justify-center rounded-full w-7 h-7
          ${
            activity.type === "invite"
              ? "bg-blue-100 dark:bg-blue-900"
              : activity.type === "sign"
              ? "bg-green-100 dark:bg-green-900"
              : activity.type === "add"
              ? "bg-yellow-100 dark:bg-yellow-900"
              : activity.type === "accept"
              ? "bg-purple-100 dark:bg-purple-900"
              : "bg-gray-200 dark:bg-gray-700"
          }
        `}
      >
        {activity.type === "invite" && (
          <Mail className="w-4 h-4 text-blue-600" />
        )}
        {activity.type === "sign" && (
          <Handshake className="w-4 h-4 text-green-600" />
        )}
        {activity.type === "add" && (
          <Plus className="w-4 h-4 text-yellow-600" />
        )}
        {activity.type === "accept" && (
          <PersonStanding className="w-4 h-4 text-purple-600" />
        )}
      </div>
      <div className="text-xs">
        <span className="font-medium text-gray-900 dark:text-white capitalize">
          {activity.type}
        </span>
        <span className="ml-1 text-gray-600 dark:text-gray-400">
          {activity.notes}
        </span>
        <div className="text-[10px] text-gray-400 mt-0.5">
          {new Date(activity.created_at).toLocaleString()}
        </div>
      </div>
    </li>
  );
};
