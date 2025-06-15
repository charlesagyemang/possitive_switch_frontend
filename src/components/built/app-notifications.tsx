import React from "react";

function ErrorMessage({
  message,
  lite,
}: {
  message?: string | null;
  lite?: boolean;
}) {
  if (!message) return null;

  const classes = lite ? "" : "px-4 bg-red-50";
  return (
    <div
      className={`my-2 py-3 rounded-md text-sm ${classes} text-red-800 transition-opacity duration-400`}
      role="alert"
      style={{ opacity: message ? 1 : 0 }}
    >
      <strong>Oops! </strong> {message}
    </div>
  );
}

export const SuccessMessage = ({
  message,
  lite,
}: {
  message?: string | null;
  lite?: boolean;
}) => {
  if (!message) return null;

  const classes = lite ? "" : "px-4 bg-green-50";
  return (
    <div
      className={`my-2 py-3 ${classes} text-sm rounded-md text-green-800 transition-opacity duration-400`}
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
