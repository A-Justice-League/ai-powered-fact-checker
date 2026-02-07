import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Download } from "lucide-react";
import type { AnalysisResult } from "@/data/mockData";

interface Props {
  history: AnalysisResult[];
  onClearHistory: () => void;
}

import { AnimatePresence, motion } from "framer-motion";

const HistoryPanel = ({ history, onClearHistory }: Props) => {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <section className="relative py-8 bg-neutral-light/10 border-t border-neutral-light/50 backdrop-blur-sm mt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setOpen(!open)}
            className="group flex items-center gap-2.5 text-sm font-bold text-brand-navy hover:text-brand-cyan transition-colors focus:outline-none rounded-lg px-2 py-1 -ml-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-navy/5 text-brand-muted group-hover:bg-brand-cyan/10 group-hover:text-brand-cyan transition-colors">
              <Clock className="h-4 w-4" />
            </div>
            Recent History ({history.length})
            {open ? <ChevronUp className="h-4 w-4 opacity-70" /> : <ChevronDown className="h-4 w-4 opacity-70" />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={onClearHistory}
                className="text-xs font-semibold text-brand-muted hover:text-danger bg-transparent hover:bg-danger/5 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-danger/20"
              >
                Clear All
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2 pb-6">
                {history.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative flex flex-col justify-between rounded-xl border border-white/20 bg-white/60 dark:bg-card/60 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md ${h.score >= 70 ? "bg-brand-cyan shadow-brand-cyan/20" : h.score >= 40 ? "bg-warning shadow-warning/20" : "bg-danger shadow-danger/20"
                        }`}>
                        {h.score}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${h.summaryVerdict === "TRUE" ? "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" :
                          h.summaryVerdict === "FALSE" ? "bg-danger/10 text-danger border-danger/20" :
                            "bg-warning/10 text-warning border-warning/20"
                        }`}>
                        {h.summaryVerdict}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-brand-navy line-clamp-2 leading-snug" title={h.inputPreview}>
                        "{h.inputPreview}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-navy/5 dark:border-white/5 pt-3 mt-auto">
                      <p className="text-[10px] font-medium text-brand-muted uppercase tracking-wide">
                        {new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <button
                        onClick={() => {
                          // Ideally, this would load the result back into the main view
                          // specific logic could be added to Index.tsx to handle this
                          const url = `${window.location.origin}${window.location.pathname}?result=${btoa(encodeURIComponent(JSON.stringify(h)))}`;
                          window.location.href = url;
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-brand-navy bg-brand-navy/5 hover:bg-brand-navy/10 px-2 py-1 rounded transition-colors"
                      >
                        <Download className="h-3 w-3" /> Restore
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HistoryPanel;
