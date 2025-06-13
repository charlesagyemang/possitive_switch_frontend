import { getBreadcrumbs } from "@/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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

const exclude = ["sa"];

const alias: Record<string, string> = {
  sa: "Super Admin",
  c: "Company",
  admin: "Admin",
  user: "User",
};
export const BreadCrumbProvider = ({ children }: { children: ReactNode }) => {
  const [crumbs, setCrumbs] = useState<BreadCrumbType[]>([]);

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
  }, []);

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
