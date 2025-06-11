import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

type RadioGroupComponentProps = {
  defaultValue?: string;
  items: Record<string, string>[] | string[];
  labelAccessor?: (item: Record<string, string> | string) => string;
  valueAccessor?: (item: Record<string, string> | string) => string;
  onChange: (value: string) => void;
  className?: string;
  name: string;
  //   control: any;
  //   rules?: any;
  //   required?: boolean;
};
export function RadioGroupComponent(props: RadioGroupComponentProps) {
  const [value, setValue] = useState(props.defaultValue || "");
  const {
    defaultValue,
    items,
    labelAccessor,
    valueAccessor,
    className,
    onChange,
    name,
    // control,
    // rules,
    // required,
  } = props;

  //   const { field } = useController({ name, control });

  const getValue = (item: Record<string, string> | string) => {
    if (valueAccessor) return valueAccessor(item);
    return item?.toString() || "";
  };
  const getLabel = (item: Record<string, string> | string) => {
    if (labelAccessor) return labelAccessor(item);
    return item?.toString() || "";
  };

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  return (
    <RadioGroup
      name="name"
      value={value}
      onValueChange={(val: string) => {
        setValue(val);
        onChange(val);
        // field.onChange(val);
      }}
      className={`${className || ""}`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <RadioGroupItem value={getValue(item)} id={`radio-${index}`} />
          <Label htmlFor={`radio-${index}`}>{getLabel(item)}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
