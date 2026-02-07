import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Loader2, Send } from "lucide-react";

interface Props {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const TextInputPanel = ({ onAnalyze, isLoading, inputRef }: Props) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = inputRef || localRef;

  useEffect(() => {
    if (error && text.length >= 50) setError("");
  }, [text, error]);

  const handleSubmit = () => {
    if (text.trim().length < 50) {
      setError("Please enter at least 50 characters for meaningful analysis.");
      return;
    }
    setError("");
    onAnalyze(text);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const estimatedClaims = Math.max(1, Math.floor(text.split(/[.!?]+/).filter(Boolean).length));

  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/60 dark:bg-card/40 backdrop-blur-md p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent rounded-2xl -z-10" />

      <h2 className="text-xl font-bold text-brand-navy mb-2">Analyze Text</h2>
      <p className="text-sm text-brand-muted mb-6">Paste an article chunk, social media post, or any text statement to fact-check with Gemini.</p>

      <div className="relative group">
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 'Studies show that drinking 5 liters of coffee daily reverse ages you...'"
          rows={6}
          className="w-full rounded-xl border border-neutral-light/50 bg-white/50 dark:bg-surface/50 px-5 py-4 text-base text-brand-navy placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan transition-all duration-200 resize-none shadow-sm group-hover:shadow-md"
          aria-label="Text input for fact checking"
        />
        <div className="absolute bottom-3 right-3 pointer-events-none text-xs text-brand-muted bg-white/80 dark:bg-surface/80 px-2 py-1 rounded-md backdrop-blur-sm border border-neutral-light/20">
          {text.length} chars
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-brand-muted px-1">
        <div className="flex gap-4">
          {text.length > 10 && <span className="text-brand-cyan font-medium">~{estimatedClaims} claim{estimatedClaims !== 1 ? "s" : ""} detected</span>}
        </div>
        <div className="flex items-center gap-1.5 opacity-70">
          <span className="text-[10px] border border-brand-muted/30 rounded px-1.5 py-0.5">Ctrl + Enter</span>
          <span>to send</span>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-danger font-bold flex items-center gap-2 animate-pulse" role="alert">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger"></span>
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-4 text-base font-bold text-white shadow-brand hover:shadow-lg hover:shadow-brand-cyan/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-background focus:ring-brand-cyan"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {isLoading ? "Consulting Gemini..." : "Analyze Authenticity"}
      </button>
    </div>
  );
};

export default TextInputPanel;
