import { ArrowRight, Upload } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onCheckText: () => void;
  onUpload: () => void;
}

const Hero = ({ onCheckText, onUpload }: Props) => (
  <section className="relative py-20 md:py-32 overflow-hidden">
    {/* Geometric Background Shapes */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-cyan/5 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-deep/5 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

    <div className="container mx-auto px-4 z-10 relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            Powered by Gemini 1.5 Pro
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-navy leading-[1.1] tracking-tight mb-6">
            Verify info <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-brand">instantly.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Stop misinformation in its tracks. VeriFact AI uses advanced LLMs and real-time Google Grounding to fact-check text and images in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={onCheckText}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy dark:bg-brand-cyan px-8 py-4 text-base font-bold text-white dark:text-brand-navy shadow-lg shadow-brand-navy/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-background focus:ring-brand-cyan"
            >
              Start Fact Check
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onUpload}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-neutral-light/60 dark:border-white/10 bg-card px-8 py-4 text-base font-bold text-brand-navy hover:bg-neutral-light/20 hover:border-brand-muted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-background focus:ring-neutral-light"
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </button>
          </div>
        </motion.div>

        {/* Right — Interactive 3D-like Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="hidden lg:block relative"
        >
          {/* Decorative elements behind card */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-cyan/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-deep/20 rounded-full blur-2xl" />

          <div className="relative rounded-3xl border border-white/20 bg-white/40 dark:bg-card/40 backdrop-blur-xl p-8 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-black/5 dark:border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <CredibilityRingMini score={85} />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-navy text-lg">85</div>
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy text-xl">Analysis Report</h3>
                  <p className="text-sm text-brand-muted font-medium">Verified sources found</p>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Verified
              </div>
            </div>

            {/* Staggered List */}
            <div className="space-y-4">
              {[
                { text: 'Global temperatures rose by 1.1°C since 1880.', verdict: 'TRUE', delay: 0.2 },
                { text: 'Vaccines contain microchips for tracking.', verdict: 'FALSE', delay: 0.4 },
                { text: 'Quantum computing breaks current encryption.', verdict: 'UNSURE', delay: 0.6 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + item.delay, duration: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-surface/60 border border-white/20 dark:border-white/5 shadow-sm"
                >
                  <p className="text-sm font-medium text-brand-navy pr-4">{item.text}</p>
                  <VerdictBadge verdict={item.verdict as "TRUE" | "FALSE" | "UNSURE"} />
                </motion.div>
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
