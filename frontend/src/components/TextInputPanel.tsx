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
    <div className="rounded-xl border border-neutral-light/60 bg-card p-6 shadow-card">
      <h2 className="text-lg font-semibold text-brand-navy mb-1">Analyze Text</h2>
      <p className="text-sm text-brand-muted mb-4">Paste an article, social media post, or any text to fact-check.</p>

      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste article or post text..."
        rows={6}
        className="w-full rounded-lg border border-neutral-light bg-surface/40 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition"
        aria-label="Text input for fact checking"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-brand-muted">
        <div className="flex gap-4">
          <span>{text.length} characters</span>
          {text.length > 10 && <span>~{estimatedClaims} claim{estimatedClaims !== 1 ? "s" : ""}</span>}
        </div>
        <span className="text-brand-muted/60">Ctrl+Enter to submit</span>
      </div>

      {error && (
        <p className="mt-2 text-sm text-danger font-medium" role="alert">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isLoading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
};

export default TextInputPanel;
