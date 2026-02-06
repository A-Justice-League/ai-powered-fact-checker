import { ArrowRight, Upload } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onCheckText: () => void;
  onUpload: () => void;
}

const Hero = ({ onCheckText, onUpload }: Props) => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-navy leading-tight tracking-tight">
            Stop misinformation<br />
            <span className="text-gradient">before you share it.</span>
          </h1>
          <p className="mt-5 text-lg text-brand-muted max-w-lg leading-relaxed">
            Paste text or upload a screenshot — VeriFact AI checks claims with Gemini 3 and live Google Search grounding. Fast, explainable, and citation-backed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onCheckText}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Check Text <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onUpload}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-deep px-6 py-3 text-sm font-semibold text-brand-deep hover:bg-brand-deep hover:text-primary-foreground hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Upload className="h-4 w-4" /> Upload Screenshot
            </button>
          </div>
        </motion.div>

        {/* Right — mockup card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="rounded-2xl border border-neutral-light/60 bg-card p-6 shadow-card-hover relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-brand" />
            <div className="flex items-center gap-4 mb-5">
              <CredibilityRingMini score={72} />
              <div>
                <p className="font-bold text-brand-navy text-lg">72 / 100</p>
                <p className="text-sm text-brand-muted">Mixed credibility</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { text: "Global temps rose 1.1°C", verdict: "TRUE" as const },
                { text: "EVs have zero lifecycle emissions", verdict: "FALSE" as const },
                { text: "AI passes Turing test consistently", verdict: "UNSURE" as const },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface/60 px-4 py-3">
                  <span className="text-sm text-brand-navy font-medium truncate mr-3">{c.text}</span>
                  <VerdictBadge verdict={c.verdict} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const CredibilityRingMini = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="56" height="56" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(207,28%,31%)" strokeWidth="4" opacity="0.15" />
      <circle
        cx="24" cy="24" r="20" fill="none"
        stroke="url(#gaugeGrad)" strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 24 24)"
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6BA6BE" />
          <stop offset="100%" stopColor="#36526A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const VerdictBadge = ({ verdict }: { verdict: "TRUE" | "FALSE" | "UNSURE" }) => {
  const styles = {
    TRUE: "bg-brand-cyan text-primary-foreground",
    FALSE: "bg-danger text-primary-foreground",
    UNSURE: "bg-warning text-brand-navy",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[verdict]}`}>
      {verdict}
    </span>
  );
};

export default Hero;
