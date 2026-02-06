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
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const getColor = () => {
    if (score >= 70) return "text-brand-cyan";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="flex flex-col items-center rounded-xl border border-neutral-light/60 bg-card p-8 shadow-card">
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(207,28%,31%)" strokeWidth="8" opacity="0.1" />
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            className="transition-all duration-100"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6BA6BE" />
              <stop offset="100%" stopColor="#36526A" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold ${getColor()}`}>{animatedScore}</span>
          <span className="text-xs text-brand-muted font-medium">/ 100</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-medium text-brand-navy max-w-[200px]">{verdict}</p>
    </div>
  );
};

export default CredibilityGauge;
