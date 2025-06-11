import React, { ReactNode, useCallback, useState } from "react";
import AppModal from "./modal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ModalProps = {
  description?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
};

function useModal() {
  const [isOpen, setOpen] = useState(false);
  const [title, setTitle] = useState("Modal Title");
  const [component, setComponent] = useState<ReactNode | null>();

  const Modal = useCallback(
    (props: ModalProps) => {
      const { description } = props;
      if (!isOpen) return null;
      const renderBody = () => {
        if (component) return component;

        return (
          <>
            <DialogDescription>{description}</DialogDescription>
          </>
        );
      };
      return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {renderBody()}
          </DialogContent>
        </Dialog>
      );
    },
    [isOpen, component, title]
  );

  const open = (component: ReactNode, title: string) => {
    setOpen(true);
    setTitle(title || "Modal Title");
    setComponent(component);
  };

  return {
    ModalPortal: Modal,
    isOpen,
    close: () => setOpen(false),
    open,
  };
}

export default useModal;
