import React, { useCallback, useEffect, useState } from "react";
import { CustomTabComponent, TabComponentProps } from "./tab-component";
import { set } from "date-fns";

function useCustomTabs({ defaultTab = "" }: { defaultTab?: string } = {}) {
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, []);
  const TabComponent = useCallback(
    (props: TabComponentProps) => {
      return <CustomTabComponent {...props} defaultTab={activeTab} />;
    },
    [activeTab]
  );

  return { TabComponent, setActiveTab, activeTab };
}

export default useCustomTabs;
