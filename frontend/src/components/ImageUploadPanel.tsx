import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/60 dark:bg-card/40 backdrop-blur-md p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/5 to-transparent rounded-2xl -z-10" />

      <h2 className="text-xl font-bold text-brand-navy mb-2">Upload Screenshot</h2>
      <p className="text-sm text-brand-muted mb-6">Drag & drop or click to upload a news screenshot for OCR & fact-checking.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 group overflow-hidden ${dragActive
          ? "border-brand-cyan bg-brand-cyan/10 scale-[1.02]"
          : "border-neutral-light/60 hover:border-brand-cyan/50 hover:bg-neutral-light/20 dark:hover:bg-white/5"
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
          <div className="flex flex-col items-center gap-3 text-brand-muted transition-transform duration-300 group-hover:-translate-y-1">
            <div className="p-4 rounded-full bg-brand-navy/5 dark:bg-white/10 mb-1 group-hover:bg-brand-cyan/10">
              <ImageIcon className="h-8 w-8 text-brand-muted group-hover:text-brand-cyan transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-navy">Click to upload</p>
              <p className="text-xs opacity-70 mt-1">or drag and drop PNG/JPG</p>
            </div>
          </div>
        )}

        {state === "uploading" && (
          <div className="flex flex-col items-center gap-2 text-brand-cyan animate-pulse">
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
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-neutral-light/50 bg-neutral-light/10">
              <img src={preview} alt="Uploaded" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                Click to change
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs font-bold uppercase tracking-wide">Ready to Analyze</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => selectedFile && onUpload(selectedFile)}
        disabled={isLoading || !selectedFile}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-4 text-base font-bold text-white shadow-brand hover:shadow-lg hover:shadow-brand-cyan/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-background focus:ring-brand-cyan"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        {isLoading ? "Analyzing..." : "Analyze Image"}
      </button>
    </div>
  );
};

export default ImageUploadPanel;
