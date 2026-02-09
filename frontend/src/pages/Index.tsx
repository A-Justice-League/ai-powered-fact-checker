import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TextInputPanel from "@/components/TextInputPanel";
import ImageUploadPanel from "@/components/ImageUploadPanel";
import ResultsPanel from "@/components/ResultsPanel";
import HistoryPanel from "@/components/HistoryPanel";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { AnalysisResult } from "@/data/mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>("analysis-history", []);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => textRef.current?.focus(), 400);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get("result");
    if (resultParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(resultParam)));
        setResult(decoded);
        // Scroll to results after a short delay to allow rendering
        setTimeout(() => {
          const resultsEl = document.querySelector('[aria-label="Analysis results"]');
          resultsEl?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } catch (e) {
        console.error("Failed to parse shared result", e);
        toast({
          title: "Error",
          description: "Invalid shared link.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleShare = () => {
    if (!result) return;
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(result)));
      const url = `${window.location.origin}${window.location.pathname}?result=${encoded}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Share this analysis result with others.",
      });
    } catch (e) {
      console.error("Share error", e);
      toast({
        title: "Share Failed",
        description: "Could not generate share link.",
        variant: "destructive"
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Analysis history has been cleared.",
    });
  };

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze text. Please check if the backend is running.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 50));

      toast({
        title: "Analysis Complete",
        description: "Gemini has finished fact-checking the content.",
      });

      // Scroll to results
      setTimeout(() => {
        const resultsEl = document.querySelector('[aria-label="Analysis results"]');
        resultsEl?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (error) {
      console.error("Analysis Error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeImage = async (file: File) => {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/analyze-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image. Please check if the backend is running.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 50));

      toast({
        title: "Image Analysis Complete",
        description: "Gemini has processed the image and verified the claims.",
      });

      // Scroll to results
      setTimeout(() => {
        const resultsEl = document.querySelector('[aria-label="Analysis results"]');
        resultsEl?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (error) {
      console.error("Image Analysis Error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onCheckText={scrollToInput} onUpload={scrollToInput} />

      <div ref={inputSectionRef} className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <TextInputPanel onAnalyze={handleAnalyze} isLoading={isLoading} inputRef={textRef} />
          <ImageUploadPanel onUpload={handleAnalyzeImage} isLoading={isLoading} />
        </div>
      </div>

      <ResultsPanel result={result} isLoading={isLoading} onShare={handleShare} />
      <HistoryPanel history={history} onClearHistory={clearHistory} />
      <Footer />
    </div>
  );
};

export default Index;
