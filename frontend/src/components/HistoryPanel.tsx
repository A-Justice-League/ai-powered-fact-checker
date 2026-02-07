import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Download } from "lucide-react";
import type { AnalysisResult } from "@/data/mockData";

interface Props {
  history: AnalysisResult[];
  onClearHistory: () => void;
}

const HistoryPanel = ({ history, onClearHistory }: Props) => {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <section className="py-8 bg-neutral-light/20 border-t border-neutral-light/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
          >
            <Clock className="h-4 w-4" />
            Recent Checks ({history.length})
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {open && (
            <button
              onClick={onClearHistory}
              className="text-xs text-brand-muted hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-md transition-colors font-medium border border-transparent hover:border-danger/20"
            >
              Clear History
            </button>
          )}
        </div>

        {open && (
          <div className="mt-4 space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-neutral-light/60 bg-card px-5 py-3 shadow-card">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground ${h.score >= 70 ? "bg-brand-cyan" : h.score >= 40 ? "bg-warning" : "bg-danger"
                    }`}>
                    {h.score}
                  </div>
                  <div>
                    <p className="text-sm text-brand-navy font-medium truncate max-w-xs">{h.inputPreview}</p>
                    <p className="text-xs text-brand-muted">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  className="text-xs text-brand-muted hover:text-brand-cyan flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
                  aria-label="Export report"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HistoryPanel;
