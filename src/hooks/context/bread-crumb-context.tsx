import { getBreadcrumbs } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type BreadCrumbType = {
  key: string;
  name: string;
  url: string;
};
type BreadCrumbContextType = {
  crumbs: BreadCrumbType[];
};

const BreadCrumbContext = createContext<BreadCrumbContextType | null>(null);

const exclude = ["sa", "c", "invitation"];

const alias: Record<string, string> = {
  sa: "Super Admin",
  c: "Company",
  admin: "Admin",
  user: "User",
};
export const BreadCrumbProvider = ({ children }: { children: ReactNode }) => {
  const [crumbs, setCrumbs] = useState<BreadCrumbType[]>([]);

  const link = usePathname();
  // const getLink = () => {
  //   if (typeof window === "undefined") return "";
  //   return window.location.pathname;
  // };
  // const link = getLink();
  // const memoizedLink = useMemo(() => link, [link]);

  useEffect(() => {
    const c = getBreadcrumbs(window?.location.pathname);
    const objs = c.map((crumb, index) => {
      const truncatedList = c.slice(0, index + 1);
      const excluded = exclude.includes(crumb);
      return {
        key: crumb,
        name: alias[crumb] || crumb,
        url: excluded ? "#" : `/${truncatedList.join("/")}`,
      };
    });
    setCrumbs(objs);
  }, [link]);

  return (
    <BreadCrumbContext.Provider value={{ crumbs }}>
      {children}
    </BreadCrumbContext.Provider>
  );
};

export const useBreadCrumbs = (): BreadCrumbContextType => {
  const context = useContext(BreadCrumbContext);
  if (!context) {
    throw new Error("useBreadCrumb must be used within a BreadCrumbProvider");
  }
  return context;
};
