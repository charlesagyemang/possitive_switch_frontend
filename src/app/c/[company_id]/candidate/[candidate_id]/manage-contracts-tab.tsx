import CustomButton from "@/components/built/button/custom-button";
import useModal from "@/components/built/modal/useModal";
import { GenericTable } from "@/components/built/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";

function ManageCandidateContracts() {
  const { ModalPortal, open } = useModal();
  return (
    <div className="mt-6 ">
      <ModalPortal className="!max-w-3xl w-full" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-lg font-semibold">Manage Contracts</h5>
          <p className="text-gray-500">
            Handle all contracts related to this candidate here. You can create,
            view, and manage contracts efficiently.
          </p>
        </div>
        <CustomButton
          onClick={() =>
            open(
              <p>List the available contract templates</p>,
              "Contract Templates"
            )
          }
        >
          <Plus size={18} /> Create A Contract
        </CustomButton>
      </div>

      <Card className="shadow-none p-6 mb-6">
        <CardContent>
          <GenericTable
            name="Contracts"
            data={[]}
            columns={[]}
            noRecordsText="No contracts found."
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageCandidateContracts;
