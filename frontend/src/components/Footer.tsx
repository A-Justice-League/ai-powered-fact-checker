const links = [
  { label: "About", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Devpost", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Contact", href: "#" },
];

const Footer = () => (
  <footer className="border-t border-neutral-light/50 bg-card py-8 mt-12">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-5">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-sm text-brand-muted hover:text-brand-navy transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-brand-muted/70">© {new Date().getFullYear()} VeriFact AI. Built for hackathon demo.</p>
    </div>
  </footer>
);

export default Footer;
