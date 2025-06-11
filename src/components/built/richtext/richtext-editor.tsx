"use client";

import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";

export default function RichTextEditor({
  className,
  style,
  onChange,
  defaultValue,
}: {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (!quill) return;

    // Set default value once when quill is ready
    if (defaultValue && quill.root.innerHTML.trim() === "<p><br></p>") {
      quill.root.innerHTML = defaultValue;
    }

    const handleTextChange = () => {
      onChange?.(quill.root.innerHTML);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill]); // 👈 CLEAN and stable

  return (
    <div
      className={`scrollbar-hide ${className}`}
      style={{
        overflowY: "scroll",
        width: "100%",
        height: 300,
        ...(style || {}),
      }}
    >
      <div ref={quillRef} />
    </div>
  );
}
