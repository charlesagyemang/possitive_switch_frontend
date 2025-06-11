import {
  Control,
  FieldValues,
  FieldErrors,
  useController,
} from "react-hook-form";
import { Textarea, Textbox } from "../input/input";
import { RadioGroup } from "@radix-ui/react-dropdown-menu";
import { RadioGroupComponent } from "../radio/radio";
import { Label } from "@/components/ui/label";

export const FORM_FIELD_TYPES = {
  text: "text",
  number: "number",
  email: "email",
  password: "password",
  date: "date",
  checkbox: "checkbox",
  radio: "radio",
  select: "select",
  textarea: "textarea",
  radioGroup: "radio-group",
};
export type CustomFormField = {
  type: (typeof FORM_FIELD_TYPES)[keyof typeof FORM_FIELD_TYPES];
  name: string;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  rules?: any;
  labelAccessor?: (item: Record<string, string> | string) => string;
  valueAccessor?: (item: Record<string, string> | string) => string;
  className?: string;
  defaultValue?: string;
  items?: Record<string, string>[] | string[];
  onChange?: (value: string) => void;
};

const renderLabel = (field: CustomFormField) => {
  if (field.label) {
    return (
      <Label htmlFor={field.name} className="text-sm flex items-center mb-1">
        {field.label}
        {field.required && <span className="text-red-600">*</span>}
      </Label>
    );
  }
  return null;
};
export const renderFormField = (
  field: CustomFormField,
  control: Control<FieldValues, any>,
  errors: FieldErrors<FieldValues>
) => {
  switch (field.type) {
    case "text":
    case "number":
    case "email":
    case "date":
      return (
        <div key={field.name} className="mb-2">
          {renderLabel(field)}
          <Textbox
            {...field}
            register={control.register}
            name={field.name}
            control={control}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            rules={field.rules}
            errors={errors}
            type={field.type}
          />
        </div>
      );

    case "textarea":
      return (
        <div key={field.name} className="mb-1">
          {renderLabel(field)}
          <Textarea
            {...field}
            register={control.register}
            name={field.name}
            control={control}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            rules={field.rules}
            errors={errors}
          />
        </div>
      );
    case "radio-group":
      const { field: cField } = useController({
        name: field.name,
        control,
        rules: field.rules ? field.rules : { required: field.required },
      });
      return (
        <div key={field.name} className="mb-2">
          {renderLabel(field)}
          <RadioGroupComponent
            {...field}
            defaultValue={cField.value}
            items={field.options || []}
            name={field.name}
            onChange={(value: string) => {
              cField.onChange(value);
            }}
            className="w-full"
          />
          {errors[field.name] && (
            <span className="text-red-500 text-xs">
              {errors[field.name]?.message as string}
            </span>
          )}
        </div>
      );
    default:
      return null;
  }
};
