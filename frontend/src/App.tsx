import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Define API URL (same as correctly defined in Index.tsx)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const App = () => {
  useEffect(() => {
    // Function to ping the backend health/root endpoint
    const pingBackend = async () => {
      // Skip in test environment to avoid interfering with mocks
      if (import.meta.env.MODE === 'test') return;

      try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
          console.log("Backend health check: OK");
        } else {
          console.warn("Backend health check: Failed", response.status);
        }
      } catch (error) {
        console.error("Backend health check: Error", error);
      }
    };

    // Initial ping
    pingBackend();

    // Set interval for 3 minutes (180000 ms)
    const intervalId = setInterval(pingBackend, 3 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
