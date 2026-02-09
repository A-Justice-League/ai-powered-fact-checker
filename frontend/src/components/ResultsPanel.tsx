import { motion } from "framer-motion";
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

const ResultsPanel = ({ result, isLoading, onShare }: Props) => {
  if (!isLoading && !result) return null;

  return (
    <section className="py-12" aria-live="polite" aria-label="Analysis results">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-brand-navy mb-8"
        >
          Analysis Results
        </motion.h2>

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
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <CredibilityGauge score={result.score} verdict={result.summaryVerdict} />
              <div className="md:col-span-2 space-y-4">
                {result.claims.map((claim, i) => (
                  <ClaimCard key={claim.id} claim={claim} index={i} onShare={onShare} />
                ))}
              </div>
            </div>

            {/* Gemini 3 Search Queries Section */}
            {result.searchQueries && result.searchQueries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ResultsPanel;
