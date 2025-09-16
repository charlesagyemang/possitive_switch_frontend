import { Q_LIST_COMPANIES, Q_LOAD_ONE_COMPANY } from "@/api/auth/constants";
import { useCompanyLogoHandler } from "@/api/companies/company-api";
import { Company } from "@/app/seed/companies";
import AppNotifications from "@/components/built/app-notifications";
import CustomButton from "@/components/built/button/custom-button";
import CustomTooltip from "@/components/built/tooltip/custom-tooltip";
import { SimpleFileUploader } from "@/components/built/upload/simple-file-uploader";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

function UploadCompanyLogo({
  company,
  close,
  onUpdated,
}: {
  company: Company;
  close?: () => void;
  onUpdated?: (logoUrl: string) => void;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { run, isPending, error } = useCompanyLogoHandler();
  const client = useQueryClient();

  const upload = () => {
    run(
      { id: company.id, logo: logoFile },
      {
        onSuccess: (response) => {
          // Print full API response for debugging/verification
          try {
            console.log(
              "\n===== COMPANY LOGO UPLOAD RESPONSE =====\n",
              JSON.stringify(response, null, 2)
            );
          } catch (e) {
            console.log("\n===== COMPANY LOGO UPLOAD RESPONSE (raw) =====\n", response);
          }

          // Extract and persist new logo URL
          const newLogoUrl = response?.data?.logo_url;
          if (newLogoUrl) {
            try {
              const stored = localStorage.getItem("companyData");
              if (stored) {
                const obj = JSON.parse(stored);
                obj.logo_url = newLogoUrl;
                localStorage.setItem("companyData", JSON.stringify(obj));
              }
            } catch (err) {
              console.warn("Failed to update localStorage companyData with new logo_url", err);
            }
            // Notify parent so UI updates immediately
            onUpdated?.(newLogoUrl);
            // Force full reload so every place picks up new logo domain/config
            try {
              setTimeout(() => {
                window.location.reload();
              }, 50);
            } catch {}
          }
          // Optimistic UI update already handled; still refetch to be safe
          client.invalidateQueries({ queryKey: [Q_LIST_COMPANIES] });
          client.invalidateQueries({ queryKey: [Q_LOAD_ONE_COMPANY, company.id] });
          setLogoFile(null); // Reset the file input after successful upload
          close?.();
        },
      }
    );
  };

  return (
    <div>
      {/* <p>Upload logo for {company?.name}</p> */}
      <SimpleFileUploader
        multiple={false}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        onChange={(files) => {
          const file = files?.[0];
          setLogoFile(file);
        }}
        label="Upload Logo"
        dropzoneText="Drop Logo here"
        uploadButtonText="Select logo"
      />

      <AppNotifications.Error message={error?.message} />
      <div className="flex items-center justify-end mt-1">
        <CustomButton
          onClick={() => upload()}
          loading={isPending}
          disabled={!!!logoFile}
        >
          <CustomTooltip
            asChild
            tip={!!logoFile ? "Finish" : "Select a logo first"}
          >
            <span>Upload</span>
          </CustomTooltip>
        </CustomButton>
      </div>
    </div>
  );
}

export default UploadCompanyLogo;
