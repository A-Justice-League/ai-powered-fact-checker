import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import CredibilityGauge from "./CredibilityGauge";
import ClaimCard from "./ClaimCard";
import type { AnalysisResult } from "@/data/mockData";

interface Props {
  result: AnalysisResult | null;
  isLoading: boolean;
  onShare?: () => void;
}

const SkeletonGauge = () => (
  <div className="animate-pulse rounded-xl border border-neutral-light/60 bg-card p-8 flex flex-col items-center h-full justify-center">
    <div className="h-40 w-40 rounded-full border-[12px] border-surface bg-transparent mb-6" />
    <div className="h-6 w-32 rounded bg-surface mb-3" />
    <div className="h-4 w-24 rounded bg-surface" />
  </div>
);

const SkeletonCard = ({ index }: { index: number }) => (
  <div
    className="rounded-xl border border-neutral-light/60 bg-card p-5 shadow-card animate-pulse"
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="h-5 w-3/4 rounded bg-surface" />
      <div className="h-6 w-16 rounded-full bg-surface" />
    </div>
    <div className="space-y-2.5 mb-5">
      <div className="h-3.5 w-full rounded bg-surface" />
      <div className="h-3.5 w-[90%] rounded bg-surface" />
      <div className="h-3.5 w-[95%] rounded bg-surface" />
    </div>
    <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-light/30">
      <div className="h-6 w-24 rounded-full bg-surface" />
      <div className="h-6 w-20 rounded-full bg-surface" />
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

const ResultsPanel = ({ result, isLoading, onShare }: Props) => {
  if (!isLoading && !result) return null;

  return (
    <section className="py-12" aria-live="polite" aria-label="Analysis results">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-brand-navy"
          >
            Analysis Results
          </motion.h2>

          {onShare && !isLoading && result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 text-brand-cyan font-semibold rounded-full border border-brand-cyan/20 hover:bg-brand-cyan/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share Result
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            <SkeletonGauge />
            <div className="md:col-span-2 space-y-4">
              <SkeletonCard index={0} />
              <SkeletonCard index={1} />
              <SkeletonCard index={2} />
            </div>
          </div>
        ) : result ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <CredibilityGauge score={result.score} verdict={result.summaryVerdict} />
              </motion.div>
              <div className="md:col-span-2 space-y-4">
                {result.claims.map((claim, i) => (
                  <motion.div key={claim.id} variants={itemVariants} custom={i}>
                    <ClaimCard claim={claim} index={i} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Gemini 3 Search Queries Section */}
            {result.searchQueries && result.searchQueries.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-12 p-6 rounded-2xl bg-brand-navy/5 border border-brand-navy/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                  <h3 className="text-lg font-semibold text-brand-navy">Gemini 3 Grounding Queries</h3>
                </div>
                <p className="text-sm text-brand-muted mb-4">
                  To verify these claims, Gemini generated and executed the following Google Search queries in real-time:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.searchQueries.map((query, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-white border border-brand-navy/10 text-brand-navy text-sm font-medium shadow-sm hover:border-brand-cyan/30 transition-colors"
                    >
                      🔍 {query}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
};

export default ResultsPanel;
