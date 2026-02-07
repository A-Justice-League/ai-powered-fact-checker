import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import React from "react";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock ScrollTo since jsdom doesn't implement it
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

describe("App Integration Test", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
        // Re-mock URL.createObjectURL as it might be reset
        global.URL.createObjectURL = vi.fn(() => "blob:test");
        // Re-mock fetch
        // global.fetch is a reference to the mock, resetAllMocks clears its behavior?
        // If mockFetch is const = vi.fn(), resetAllMocks clears it.
        // We need to ensure global.fetch is still the mock.
        global.fetch = mockFetch;
    });

    // ... existing tests ...


    it("renders the main landing page correctly", () => {
        render(<App />);

        // Check for Hero text
        expect(screen.getByText(/Verify info/i)).toBeInTheDocument();
        expect(screen.getByText(/instantly/i)).toBeInTheDocument();

        // Check for input panel
        expect(screen.getByText(/Analyze Text/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Studies show that drinking/i)).toBeInTheDocument();
    });

    it("handles text analysis submission flow", async () => {
        // Mock successful API response
        const mockResult = {
            id: "test-id-1",
            score: 85,
            summaryVerdict: "TRUE",
            explanation: "This is a true claim.",
            inputPreview: "The sky is blue because of Rayleigh scattering...",
            claims: [
                {
                    id: "1",
                    text: "Sky is blue",
                    verdict: "TRUE",
                    explanation: "Rayleigh scattering confirms this.",
                    sources: [{ title: "NASA", url: "https://nasa.gov", domain: "nasa.gov" }]
                }
            ],
            searchQueries: ["sky color scientific explanation"],
            timestamp: new Date().toISOString()
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResult,
        });

        render(<App />);

        // Find input and type text
        const input = screen.getByLabelText("Text input for fact checking");
        fireEvent.change(input, { target: { value: "The sky is blue because of Rayleigh scattering which scatters shorter wavelengths more." } });

        // Check character count update (implied by logic, but let's check button enablement)
        // The button is disabled only if loading? No, looking at code, disabled={isLoading}.
        // But handleSubmit checks for length < 50 and sets error.

        const analyzeButton = screen.getByRole("button", { name: /Analyze Authenticity/i });
        expect(analyzeButton).not.toBeDisabled();

        // Click analyze
        fireEvent.click(analyzeButton);

        // Should show loading state
        expect(await screen.findByText(/Consulting Gemini.../i)).toBeInTheDocument();

        // Fetch should be called with correct URL and body
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining("/analyze-text"),
            expect.objectContaining({
                method: "POST",
                body: expect.stringContaining("Rayleigh scattering"),
            })
        );

        // Wait for results to appear
        // We wait for "Analysis Results" because the score animates slowly
        await waitFor(() => {
            expect(screen.getByText(/Analysis Results/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        // Verify claim details (these shouldn't depend on long animations)
        expect(screen.getByText("Sky is blue")).toBeInTheDocument();
        expect(screen.getByText("NASA")).toBeInTheDocument();

        // Now checks score, allowing for animation to finish
        await waitFor(() => {
            expect(screen.getByText("85")).toBeInTheDocument();
        }, { timeout: 4000 });
    });

    it("handles API error gracefully", async () => {
        // Mock API failure
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error"
        });

        render(<App />);

        const input = screen.getByLabelText("Text input for fact checking");
        fireEvent.change(input, { target: { value: "Some long text that meets the minimum length requirement for the analysis to proceed." } });

        const analyzeButton = screen.getByRole("button", { name: /Analyze Authenticity/i });
        fireEvent.click(analyzeButton);

        // Verify error toast or message
        // Since Toaster is rendered, we might see the toast in the DOM
        // The error message in 'Index.tsx' is "Failed to analyze text..."

        await waitFor(() => {
            // Shadcn toast usually renders into a specific region
            expect(screen.getByText(/Analysis Failed/i)).toBeInTheDocument();
        });
    });

    it("validates input length locally", async () => {
        render(<App />);
        const input = screen.getByLabelText("Text input for fact checking");
        const button = screen.getByRole("button", { name: /Analyze Authenticity/i });

        // Type short text
        fireEvent.change(input, { target: { value: "Too short" } });
        fireEvent.click(button);

        // Expect validation error message
        expect(await screen.findByText(/Please enter at least 50 characters/i)).toBeInTheDocument();

        // Verify fetch was NOT called
        expect(mockFetch).not.toHaveBeenCalled();
    });
    it.skip("handles image upload and analysis flow", async () => {
        // Mock URL.createObjectURL
        const mockCreateObjectURL = vi.fn();
        mockCreateObjectURL.mockReturnValue("blob:http://localhost:3000/mock-image-blob");
        global.URL.createObjectURL = mockCreateObjectURL;

        const mockImageResult = {
            id: "img-1",
            score: 92,
            summaryVerdict: "TRUE",
            claims: [],
            inputPreview: "Image Analysis Result",
            timestamp: new Date().toISOString()
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockImageResult,
        });

        render(<App />);

        // Find file input (hidden)
        const fileInput = screen.getByLabelText("Select image file");
        const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });

        // Upload file
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Expect preview
        expect(await screen.findByAltText("Uploaded")).toBeInTheDocument();
        expect(screen.getByText("Image Selected")).toBeInTheDocument();

        // Analyze
        const analyzeBtn = screen.getByRole("button", { name: /Analyze Image/i });
        fireEvent.click(analyzeBtn);

        // Check loading
        expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();

        // Wait for result header
        expect(await screen.findByText(/Analysis Results/i)).toBeInTheDocument();

        // Check for Verdict (appears in Credibility Gauge as TRUE)
        // Use findByText to wait for it just in case
        expect(await screen.findByText("TRUE")).toBeInTheDocument();
    });

    it.skip("persists analysis to history", async () => {
        const mockResult = {
            id: "hist-1",
            score: 50,
            summaryVerdict: "UNSURE",
            claims: [],
            inputPreview: "History Test Input",
            timestamp: new Date().toISOString()
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResult,
        });

        render(<App />);

        // Perform analysis
        const input = screen.getByLabelText("Text input for fact checking");
        fireEvent.change(input, { target: { value: "A persistent claim that needs to be stored in local storage for later retrieval." } });
        fireEvent.click(screen.getByRole("button", { name: /Analyze Authenticity/i }));

        // Wait for result header
        expect(await screen.findByText(/Analysis Results/i)).toBeInTheDocument();

        // Check History Panel update
        // It is initially collapsed. Button says "Recent Checks (1)".
        expect(await screen.findByText(/Recent Checks \(1\)/i)).toBeInTheDocument();

        // Expand history
        fireEvent.click(screen.getByText(/Recent Checks/i));

        // Check if item is listed in history panel
        expect(await screen.findByText("History Test Input")).toBeInTheDocument();

        // Verify localStorage
        const history = JSON.parse(localStorage.getItem("analysis-history") || "[]");
        expect(history).toHaveLength(1);
    });
});
