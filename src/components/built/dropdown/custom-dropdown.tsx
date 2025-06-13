
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
export type DOption = {
  label: string;
  value: string;
  Icon?: LucideIcon;
  render?: () => React.ReactNode;
  onClick: () => void;
};
type DropdownProps = {
  name?: string;
  options: DOption[];
  children: React.ReactNode;
  className?: string;
};
export function AsDropdownMenu(props: DropdownProps) {
  const { children, options, name } = props;

  const render = (option: DOption) => {
    if (option.render) {
      return option.render();
    }
    return (
      <>
        {option.Icon && <option.Icon className="mr-2" />}
        {option.label}
      </>
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {name && <DropdownMenuLabel>{name}</DropdownMenuLabel>}
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => option?.onClick()}
            >
              {render(option)}

              {/* {option.value && (
                <DropdownMenuShortcut>{option.value}</DropdownMenuShortcut>
              )} */}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
