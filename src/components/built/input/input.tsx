import { Input } from "@/components/ui/input";
import { TextboxProps } from "./input-types";
import { FieldErrors, FieldError } from "react-hook-form";

import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";


function getErrorMessage(
  errors: FieldErrors,
  name: string
): string | undefined {
  return errors[name] && (errors[name] as FieldError).message;
}

export const Textbox = ({
  name,
  rules,
  defaultValue,
  label,
  required,
  type,
  errors,
  register,
  placeholder = "Enter text...",
  className = "",
}: TextboxProps) => {
  const error = getErrorMessage(errors, name);
  return (
    <div>
      {/* {label && (
        <Label htmlFor={name} className="text-sm">
          {label}
          {required && <span className="text-red-600">*</span>}
        </Label>
      )} */}
      <Input
        className={className}
        {...register(
          name,
          rules ??
            (required && { required: `${label?.toLowerCase()} is required` })
        )}
        type={type || "text"}
        placeholder={placeholder || label}
        defaultValue={defaultValue}
        id={name}
        aria-invalid={!!errors[name]}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
export const Textarea = ({
  name,
  rules,
  defaultValue,
  label,
  required,
  errors,
  register,
  placeholder = "Enter text...",
  rows = 4,
  className,
}: Omit<TextboxProps, "type"> & { rows?: number }) => {
  const error = getErrorMessage(errors, name);
  return (
    <div>
      {/* {label && (
        <Label htmlFor={name} className="text-sm">
          {label}
          {required && <span className="text-red-600">*</span>}
        </Label>
      )} */}
      <ShadcnTextarea
        className={className}
        {...register(
          name,
          rules ??
            (required && { required: `${label?.toLowerCase()} is required` })
        )}
        id={name}
        rows={rows}
        placeholder={placeholder || label}
        defaultValue={defaultValue}
        aria-invalid={!!errors[name]}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
