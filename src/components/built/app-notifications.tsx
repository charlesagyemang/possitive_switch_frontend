import React from "react";

function ErrorMessage({ message }: { message?: string | null | undefined }) {
  if (!message) return null;
  return (
    <div
      className="my-2 px-4 py-3 rounded-md  bg-red-50 text-red-800 transition-opacity duration-400"
      role="alert"
      style={{ opacity: message ? 1 : 0 }}
    >
      <strong>Oops! </strong> {message}
    </div>
  );
}

export const SuccessMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div
      className="my-2 px-4 py-3 rounded-md  bg-green-50 text-green-800 transition-opacity duration-400"
      role="alert"
      style={{ opacity: message ? 1 : 0 }}
    >
      <strong>Success! </strong> {message}
    </div>
  );
};

export const AppNotifications = {
  Error: ErrorMessage,
  Success: SuccessMessage,
};

export default AppNotifications;
