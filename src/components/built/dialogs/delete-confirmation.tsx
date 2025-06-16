import React from "react";
import CustomButton from "../button/custom-button";

type cancel = {
  label?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

type confirm = {
  label?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
};
function DeleteConfirmation({
  cancel,
  confirm,
}: {
  cancel?: cancel;
  confirm?: confirm;
}) {
  return (
    <div>
      <p>Are you sure you want to delete this?</p>

      <div className="flex justify-end mt-4">
        <CustomButton
          onClick={() => cancel?.onClick?.()}
          variant="outline"
          className="mr-2"
        >
          {cancel?.label || "Cancel"}
        </CustomButton>
        <CustomButton
          onClick={() => confirm?.onClick?.()}
          loading={confirm?.loading}
          className="bg-red-600"
        >
          {confirm?.label || "Yes"}
        </CustomButton>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
