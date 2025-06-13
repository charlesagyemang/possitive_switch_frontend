import { FieldErrors, UseFormRegister } from "react-hook-form";

export type TextboxProps = {
  name: string;
  rules?: any;
  control: any;
  defaultValue?: string | number;
  label?: string;
  required?: boolean;
  type: string;
  placeholder?: string;
  errors: FieldErrors;
  register: UseFormRegister<any>;
  className?:string;
};
