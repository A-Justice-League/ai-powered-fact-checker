import { useEffect, useState } from "react";

interface Props {
  score: number;
  verdict: string;
}

const CredibilityGauge = ({ score, verdict }: Props) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Quartic ease-out
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const getColor = () => {
    if (score >= 70) return "text-brand-cyan drop-shadow-[0_0_8px_rgba(107,166,190,0.5)]";
    if (score >= 40) return "text-warning drop-shadow-[0_0_8px_rgba(240,180,41,0.5)]";
    return "text-danger drop-shadow-[0_0_8px_rgba(232,91,91,0.5)]";
  };

  const getStrokeColor = () => {
    if (score >= 70) return "#6BA6BE"; // brand-cyan
    if (score >= 40) return "#F0B429"; // warning
    return "#E85B5B"; // danger
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/60 dark:bg-card/40 backdrop-blur-md p-8 shadow-xl transition-transform hover:scale-[1.02] duration-300">
      <div className="relative group cursor-default">
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500`} style={{ backgroundColor: getStrokeColor() }} />

        <svg width="160" height="160" viewBox="0 0 140 140" className="relative z-10">
          {/* Background Track */}
          <circle cx="70" cy="70" r={radius} fill="none" className="stroke-neutral-light/30 dark:stroke-white/10" strokeWidth="12" />

          {/* Progress Arc */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            className="transition-all duration-300 ease-out drop-shadow-sm"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-2">
          <span className={`text-[3.5rem] font-black tracking-tighter leading-none ${getColor()} transition-colors duration-300`}>
            {animatedScore}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted/70 mt-1">Score</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-xl font-bold text-brand-navy mb-1">{verdict}</h3>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-brand-muted/30 to-transparent mx-auto" />
        <p className="text-xs font-medium text-brand-muted mt-2 uppercase tracking-wide">Credibility Rating</p>
      </div>
    </div>
  );
};

export default CredibilityGauge;
