import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Download } from "lucide-react";
import type { AnalysisResult } from "@/data/mockData";

interface Props {
  history: AnalysisResult[];
  onClearHistory: () => void;
  onSelectHistory: (item: AnalysisResult) => void;
}

import { AnimatePresence, motion } from "framer-motion";

const HistoryPanel = ({ history, onClearHistory, onSelectHistory }: Props) => {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
        >
          <Clock className="h-4 w-4" />
          Recent Checks ({history.length})
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden"
            >
              {history.map((h) => (
                <div key={h.id} className="group flex flex-col justify-between rounded-2xl border border-neutral-light/60 bg-card p-5 shadow-sm hover:shadow-md hover:border-brand-cyan/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-sm ${h.score >= 70 ? "bg-brand-cyan" : h.score >= 40 ? "bg-warning" : "bg-danger"
                      }`}>
                      {h.score}
                    </div>
                    <span className="text-xs text-brand-muted font-medium bg-neutral-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                      {new Date(h.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-brand-navy font-medium line-clamp-3 leading-relaxed">
                      "{h.inputPreview}"
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectHistory(h)}
                    className="w-full mt-auto flex items-center justify-center gap-2 text-sm font-semibold text-brand-cyan bg-brand-cyan/5 hover:bg-brand-cyan/10 border border-brand-cyan/20 py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HistoryPanel;
