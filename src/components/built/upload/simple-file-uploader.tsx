import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React, {
  useRef,
  useState,
  ChangeEvent,
  DragEvent,
  CSSProperties,
} from "react";

type FileUploaderProps = {
  accept?: string; // e.g. "image/*,application/pdf"
  multiple?: boolean;
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  label?: string;
  description?: string;
  uploadButtonText?: string;
  removeButtonText?: string;
  dropzoneText?: string;
  className?: string;
  style?: CSSProperties;
  previewStyle?: CSSProperties;
  fileInfoStyle?: CSSProperties;
};

const defaultTexts = {
  label: "Upload Files",
  description: "Drag & drop images here, or click to select files.",
  uploadButtonText: "Browse",
  removeButtonText: "Remove",
  dropzoneText: "Drop files here",
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024,
    sizes = ["Bytes", "KB", "MB", "GB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const SimpleFileUploader: React.FC<FileUploaderProps> = ({
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  onChange,
  label = defaultTexts.label,
  description = defaultTexts.description,
  uploadButtonText = defaultTexts.uploadButtonText,
  removeButtonText = defaultTexts.removeButtonText,
  dropzoneText = defaultTexts.dropzoneText,
  className = "",
  style = {},
  previewStyle = {},
  fileInfoStyle = {},
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (selectedFiles: FileList | File[]) => {
    let newFiles = Array.from(selectedFiles);
    if (!multiple) newFiles = newFiles.slice(0, 1);
    let updatedFiles = [...files, ...newFiles];
    if (maxFiles) updatedFiles = updatedFiles.slice(0, maxFiles);
    // Remove duplicates by name and size
    updatedFiles = updatedFiles.filter(
      (file, idx, arr) =>
        arr.findIndex((f) => f.name === file.name && f.size === file.size) ===
        idx
    );
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = ""; // reset input
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const removeFile = (idx: number) => {
    const updatedFiles = files.filter((_, i) => i !== idx);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`max-w-lg w-full  font-sans ${className}`} style={style}>
      {label && (
        <label className="block font-semibold text-lg mb-1">{label}</label>
      )}
      {description && (
        <div className="text-gray-500 mb-3 text-sm">{description}</div>
      )}
      <div
        className={` min-h-[150px]
                    w-full rounded-xl p-8 sm:p-5 flex flex-col items-center justify-center cursor-pointer transition-all mb-5 border-2
                    ${
                      dragActive
                        ? "border-green-500 bg-green-50"
                        : "border-dashed border-gray-200 bg-gray-50"
                    }
                    focus:outline-none
                `}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        tabIndex={0}
        role="button"
        aria-label={dropzoneText}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
        <Upload size={32} className="text-gray-300 mb-2" />
        <div className="text-base text-gray-800 mb-2">{dropzoneText}</div>
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          {uploadButtonText}
        </Button>
        {/* <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 text-sm font-medium shadow"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          {uploadButtonText}
        </button> */}
      </div>
      {files.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex flex-row gap-4 py-2" style={{ minHeight: 80 }}>
            {files.map((file, idx) => {
              const isImage = file.type.startsWith("image/");
              return (
                <div
                  key={file.name + file.size}
                  className="flex flex-col items-center bg-white rounded-lg  border border-gray-100 p-2 min-w-[90px]"
                  style={previewStyle}
                >
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-md border border-gray-100 mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md text-2xl text-gray-400 mb-2">
                      📄
                    </div>
                  )}
                  <div
                    className="flex-1 min-w-0 text-center"
                    style={fileInfoStyle}
                  >
                    <div className="font-medium text-xs truncate w-16">
                      {file.name}
                    </div>
                    <div className="text-gray-400 text-[10px]">
                      {formatBytes(file.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className=" hover:bg-red-500 text-red-600 hover:text-white rounded-md px-2 py-0.5 text-xs font-medium mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                  >
                    {removeButtonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
