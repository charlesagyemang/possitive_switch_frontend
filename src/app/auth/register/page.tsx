import React from "react";
import { AuthLayout } from "../auth-layout";
import RegistrationForm from "./registration-form";

function RegistrationPage() {
  return (
    <AuthLayout>
      <RegistrationForm />
    </AuthLayout>
  );
}

export default RegistrationPage;
