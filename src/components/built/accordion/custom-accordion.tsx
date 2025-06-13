"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";

type dataType = {
  id: string;
  title?: string;
  renderHeader?: (data: any) => React.ReactNode;
  render?: (data: any) => React.ReactNode;
  content?: React.ReactNode;
  headerClassName?: string;
};
export type FlexibleAccordionItem = dataType;
type AccordionProps = {
  data: dataType[];
  defaultValue?: string;
};
export function FlexibleAccordion(props: AccordionProps) {
  const [targetValue, setTargetValue] = useState<string>("");
  const { defaultValue, data } = props;

  const header = (item: dataType) => {
    if (item.renderHeader) {
      const value = targetValue === item.id ? "" : item.id;
      return (
        <div onClick={() => setTargetValue(value)}>
          {item.renderHeader(item)}
        </div>
      );
    }
    return (
      <AccordionTrigger
        className={`${item.headerClassName || ""}`}
        // custom={!!item.renderHeader}
      >
        {item.title}
      </AccordionTrigger>
    );
  };

  useEffect(() => {
    if (defaultValue) setTargetValue(defaultValue);
  }, [defaultValue]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultValue}
      value={targetValue}
      onValueChange={(value) => {
        setTargetValue(value);
      }}
    >
      {data.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          {header(item)}
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {item.render ? item.render(item) : item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
