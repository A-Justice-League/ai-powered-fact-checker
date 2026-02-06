import { useState } from "react";
import { Menu, X, HelpCircle } from "lucide-react";
import logo from "@/assets/logo-verifact.jpeg";
import HowItWorksModal from "./HowItWorksModal";

const navLinks = [
  { label: "Docs", href: "#" },
  { label: "Demo", href: "#" },
  { label: "GitHub", href: "#" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-light/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="VeriFact AI" className="h-9 w-9 rounded-lg" />
            <span className="text-lg font-bold text-brand-navy tracking-tight hidden sm:inline">
              Veri<span className="text-brand-cyan">Fact</span> AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-brand-muted hover:text-brand-navy transition-colors"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => setHowOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-muted hover:text-brand-cyan transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              How it works
            </button>
          </nav>

          <button
            className="md:hidden p-2 text-brand-navy"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-neutral-light/50 bg-card px-4 pb-4 pt-2">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block py-2 text-sm font-medium text-brand-muted hover:text-brand-navy"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setHowOpen(true); setMenuOpen(false); }}
              className="block py-2 text-sm font-medium text-brand-muted hover:text-brand-cyan"
            >
              How it works
            </button>
          </div>
        )}
      </header>
      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />
    </>
  );
};

export default Header;
