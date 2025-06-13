"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useEffect,  useState } from "react";
export type CustomTabItem = {
  name: string;
  key: string;
  icon?: React.ReactNode;
  render: () => ReactNode;
};

type TabComponentProps = {
  defaultTab?: string;
  className?: string;
  items: CustomTabItem[];
};
export function CustomTabComponent(props: TabComponentProps) {
  const { defaultTab, items } = props;
  const [activeTab, setActiveTab] = useState<string | undefined>();

  useEffect(() => {
    // This effect runs once when the component mounts
    if (defaultTab) {
      return setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="flex gap-2">
          {items.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              className="capitalize p-4 cursor-pointer"
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon && <span className="">{item.icon}</span>}
              {item.name}
            </TabsTrigger>
          ))}
          {/* <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger> */}
        </TabsList>
        {items.map((item) => {
          return (
            <TabsContent key={item.key} value={item.key} className={`w-full`}>
              {item.render()}
            </TabsContent>
          );
        })}
        {/* <TabsContent value={"account"}>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Username</Label>
                <Input id="tabs-demo-username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
