import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MoveLeft, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [location.pathname, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-deep/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="relative inline-block mb-6">
          <h1 className="text-[10rem] md:text-[14rem] font-extrabold text-neutral-light/20 dark:text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-brand-cyan/10 backdrop-blur-sm animate-pulse">
              <HelpCircle className="w-16 h-16 text-brand-cyan" />
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-3">
              Page Not Found
            </h2>
            <p className="text-lg text-brand-muted">
              We've searched our database but couldn't verify the existence of this page.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 backdrop-blur-sm border border-neutral-light/50 rounded-xl p-4 inline-block w-full max-w-sm"
          >
            <p className="text-sm text-brand-muted mb-3 font-medium">Redirecting automatically in</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-neutral-light/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="h-full bg-brand-cyan"
                />
              </div>
              <span className="text-2xl font-bold text-brand-cyan tabular-nums w-8 text-right">{countdown}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-navy hover:bg-brand-navy/90 dark:bg-brand-cyan dark:hover:bg-brand-cyan/90 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
            >
              <MoveLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Return Home Immediately
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
