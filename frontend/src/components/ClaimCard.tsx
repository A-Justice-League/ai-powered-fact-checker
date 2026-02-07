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
  TRUE: "bg-brand-cyan text-primary-foreground",
  FALSE: "bg-danger text-primary-foreground",
  UNSURE: "bg-warning text-brand-navy",
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-xl border border-neutral-light/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-brand-navy leading-snug flex-1">{claim.text}</p>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${verdictStyles[claim.verdict]}`}>
          {claim.verdict}
        </span>
      </div>

      <p className="mt-3 text-sm text-brand-muted leading-relaxed">{claim.explanation}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {claim.sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-3 py-1 text-xs text-brand-deep font-medium hover:bg-neutral-light/60 transition-colors"
          >
            {s.domain}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-neutral-light/40 pt-3">
        <button
          onClick={copyText}
          className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-navy transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
          aria-label="Copy claim text"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-brand-cyan" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={onShare}
          className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-navy transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
          aria-label="Share claim"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          Inspect sources
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 rounded-lg bg-surface/50 p-4 text-xs text-brand-muted space-y-2"
        >
          <p className="font-medium text-brand-navy">Grounding Metadata</p>
          {claim.sources.map((s, i) => (
            <div key={i} className="rounded bg-card p-2 border border-neutral-light/40">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline font-medium">
                {s.title}
              </a>
              <p className="text-brand-muted mt-0.5">{s.domain}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClaimCard;
