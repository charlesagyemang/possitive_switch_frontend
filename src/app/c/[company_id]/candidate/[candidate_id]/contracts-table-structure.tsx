import { ApiCandidate } from "@/app/seed/candidates";
import { ApiCandidateContract } from "@/app/seed/contracts";
import {
  AsDropdownMenu,
  DOption,
} from "@/components/built/dropdown/custom-dropdown";
import { Button } from "@/components/ui/button";
import { formatDateString } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CheckCircle,
  Clock,
  Ellipsis,
  FileText,
  Mail,
  Send,
  Signature,
  Stamp,
  X,
} from "lucide-react";

const contractColumnHelper = createColumnHelper<ApiCandidateContract>();

export const candidateContractsColumns = ({
  actions,
  send,
  approve,
  approveAndSend,
}: {
  actions: (r: ApiCandidateContract) => DOption[];
  send?: (r: ApiCandidateContract) => void;
  approve?: (r: ApiCandidateContract) => void;
  approveAndSend?: (r: ApiCandidateContract) => void;
}) => {
  return [
    contractColumnHelper.accessor((row) => row, {
      id: "name",
      header: "Contract Name",
      cell: (info) => {
        const row = info.getValue();

        return (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm truncate w-[160px] font-medium">
              {row?.contract_template?.name}
            </span>
          </div>
        );
      },
    }),

    contractColumnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        let color = "bg-gray-200 text-gray-800";
        let icon = null;

        switch (status) {
          case "sent":
            color = "bg-blue-50 text-blue-800";
            icon = <Send className="w-4 h-4 mr-1 inline" />;
            break;
          case "signed":
            color = "bg-green-50 text-green-800";
            icon = <Signature className="w-4 h-4 mr-1 inline" />;
            break;
          case "approved":
            color = "bg-green-50 text-green-800";
            icon = <CheckCircle className="w-4 h-4 mr-1 inline" />;
            break;

          case "draft":
          case "pending":
            color = "bg-orange-50 text-orange-700";
            icon = <Clock className="w-4 h-4 mr-1 inline" />;
            break;
          case "rejected":
            color = "bg-red-100 text-red-800";
            icon = <X className="w-4 h-4 mr-1 inline" />;
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }

        return (
          <span
            className={`inline-flex items-center capitalize px-2 py-1 rounded text-xs font-semibold ${color}`}
          >
            {icon}
            {status}
          </span>
        );
      },
    }),
    contractColumnHelper.accessor("created_at", {
      header: "created",
      cell: (info) => <span>{formatDateString(info.getValue())}</span>,
    }),
    contractColumnHelper.accessor((row) => row, {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const row = info.getValue();
        const isApproved = row.status === "approved";
        const isSent = row.status === "sent";
        return (
          <div>
            <div className="flex gap-2">
              {isApproved || isSent ? (
                <Button
                  onClick={() => {
                    if (send) send(row);
                  }}
                  size="sm"
                  variant="outline"
                  className="flex cursor-pointer items-center gap-1"
                >
                  <Send className="size-4" />
                  {isSent ? "Send Again" : "Send"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      if (approve) approve(row);
                    }}
                    size="sm"
                    variant="outline"
                    className="flex cursor-pointer items-center gap-1"
                  >
                    <Stamp className="size-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      if (approveAndSend) approveAndSend(row);
                    }}
                    size="sm"
                    variant="outline"
                    className="flex cursor-pointer items-center gap-1"
                  >
                    <Mail className="size-4" />
                    Approve &amp; Send
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      },
    }),
    // contractColumnHelper.accessor((row) => row, {
    //   header: "Options",
    //   cell: (info) => {
    //     const row = info.getValue();
    //     const options = actions(row);
    //     return (
    //       <AsDropdownMenu
    //         options={options}
    //         className="text-xs font-medium text-gray-600 hover:text-gray-900"
    //       >
    //         <Button variant="ghost" size="sm" className="p-2">
    //           <Ellipsis className="size-4" />
    //         </Button>
    //       </AsDropdownMenu>
    //     );
    //   },
    // }),
  ];
};
