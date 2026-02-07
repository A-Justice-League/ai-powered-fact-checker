import { useState } from "react";
import { Copy, ExternalLink, ChevronDown, ChevronUp, Check, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Claim } from "@/data/mockData";

interface Props {
  claim: Claim;
  index: number;
  onShare?: () => void;
}

const verdictStyles = {
  TRUE: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/50",
  FALSE: "bg-danger/20 text-danger border-danger/50",
  UNSURE: "bg-warning/20 text-warning border-warning/50",
};

const ClaimCard = ({ claim, index, onShare }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(claim.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", bounce: 0.3 }}
      className="group relative rounded-2xl border border-white/20 bg-white/60 dark:bg-card/40 backdrop-blur-md p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:bg-white/70 dark:hover:bg-card/50"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-base font-bold text-brand-navy leading-snug flex-1 tracking-tight">
          {claim.text}
        </h3>
        <span
          className={`shrink-0 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${verdictStyles[claim.verdict]}`}
        >
          {claim.verdict}
        </span>
      </div>

      <p className="text-sm text-brand-muted leading-relaxed mb-4">
        {claim.explanation}
      </p>

      {/* Sources Tag Cloud */}
      <div className="flex flex-wrap gap-2 mb-4">
        {claim.sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/5 border border-brand-navy/10 px-3 py-1.5 text-xs text-brand-deep font-medium hover:bg-brand-navy/10 hover:border-brand-navy/30 transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/70"></span>
            {s.domain}
            <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-brand-navy/5 dark:border-white/10 pt-4 mt-2">
        <div className="flex gap-1">
          <button
            onClick={copyText}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-cyan bg-transparent hover:bg-brand-cyan/10 px-2.5 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
            aria-label="Copy claim text"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Text"}
          </button>
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-cyan bg-transparent hover:bg-brand-cyan/10 px-2.5 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
            aria-label="Share claim"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-navy dark:hover:text-white transition-colors group-hover:translate-x-0.5 transform duration-300"
        >
          {expanded ? "Hide Sources" : "Inspect Sources"}
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Expandable Sources Panel */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-3">
          <div className="bg-brand-navy/5 dark:bg-white/5 rounded-xl p-4 border border-brand-navy/5 dark:border-white/5">
            <p className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">Grounding Metadata</p>
            <div className="space-y-2">
              {claim.sources.map((s, i) => (
                <div key={i} className="group/link flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                  <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-brand-cyan/50 group-hover/link:bg-brand-cyan transition-colors" />
                  <div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-navy hover:text-brand-cyan hover:underline decoration-brand-cyan/30 underline-offset-4 transition-colors display-block">
                      {s.title}
                    </a>
                    <p className="text-xs text-brand-muted mt-0.5">{s.domain}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimCard;
