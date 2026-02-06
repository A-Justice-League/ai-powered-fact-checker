import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Cpu, FileCheck } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { icon: Search, title: "Extract Claims", desc: "We parse your text or image into individual factual claims." },
  { icon: Cpu, title: "AI + Live Search", desc: "Gemini 3 evaluates each claim using real-time Google Search grounding." },
  { icon: FileCheck, title: "Cite Sources", desc: "Every verdict comes with linked, verifiable sources you can inspect." },
];

const HowItWorksModal = ({ open, onClose }: Props) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md bg-card">
      <DialogHeader>
        <DialogTitle className="text-brand-navy">How VeriFact AI Works</DialogTitle>
        <DialogDescription className="text-brand-muted">
          Three steps to verified facts.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-2">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-brand">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-brand-navy text-sm">{s.title}</p>
              <p className="text-sm text-brand-muted">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default HowItWorksModal;
