import { useState, useRef, DragEvent } from "react";
import { Upload, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

type UploadState = "idle" | "uploading" | "processing" | "done";

interface Props {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploadPanel = ({ onUpload, isLoading }: Props) => {
  const [state, setState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    setState("done");
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="rounded-xl border border-neutral-light/60 bg-card p-6 shadow-card">
      <h2 className="text-lg font-semibold text-brand-navy mb-1">Upload Screenshot</h2>
      <p className="text-sm text-brand-muted mb-4">Drag & drop or click to upload a screenshot for OCR analysis.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${dragActive ? "border-brand-cyan bg-brand-cyan/5" : "border-neutral-light hover:border-brand-muted"
          }`}
        role="button"
        tabIndex={0}
        aria-label="Upload image for fact checking"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          aria-label="Select image file"
        />

        {state === "idle" && (
          <div className="flex flex-col items-center gap-2 text-brand-muted">
            <ImageIcon className="h-10 w-10 opacity-40" />
            <p className="text-sm font-medium">Drop PNG or JPEG here</p>
            <p className="text-xs opacity-60">or click to browse</p>
          </div>
        )}

        {state === "uploading" && (
          <div className="flex flex-col items-center gap-2 text-brand-cyan">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading...</p>
          </div>
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center gap-2 text-brand-deep">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Running OCR...</p>
          </div>
        )}

        {state === "done" && preview && (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="Uploaded" className="h-40 rounded-lg object-contain" />
            <div className="flex items-center gap-1 text-brand-cyan">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Image Selected</span>
            </div>
          </div>
        )}
      </div>

      {state === "done" && selectedFile && (
        <button
          onClick={() => onUpload(selectedFile)}
          disabled={isLoading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isLoading ? "Analyzing..." : "Analyze Image"}
        </button>
      )}
    </div>
  );
};

export default ImageUploadPanel;
