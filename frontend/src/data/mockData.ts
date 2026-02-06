export interface Claim {
  id: string;
  text: string;
  verdict: "TRUE" | "FALSE" | "UNSURE";
  explanation: string;
  sources: { domain: string; title: string; url: string }[];
}

export interface AnalysisResult {
  id: string;
  score: number;
  summaryVerdict: string;
  claims: Claim[];
  searchQueries?: string[];
  timestamp: string;
  inputPreview: string;
}

export const mockResult: AnalysisResult = {
  id: "1",
  score: 72,
  summaryVerdict: "Mixed credibility — some claims verified, others lack evidence.",
  claims: [
    {
      id: "c1",
      text: "Global temperatures have risen by 1.1°C since pre-industrial times.",
      verdict: "TRUE",
      explanation: "This is consistent with data from NASA, NOAA, and the IPCC Sixth Assessment Report (2021).",
      sources: [
        { domain: "nasa.gov", title: "Global Temperature | NASA", url: "https://climate.nasa.gov/vital-signs/global-temperature/" },
        { domain: "ipcc.ch", title: "AR6 Climate Change 2021", url: "https://www.ipcc.ch/report/ar6/wg1/" },
      ],
    },
    {
      id: "c2",
      text: "Electric vehicles produce zero emissions throughout their lifecycle.",
      verdict: "FALSE",
      explanation: "While EVs produce zero tailpipe emissions, manufacturing batteries and generating electricity can produce significant emissions depending on the energy grid.",
      sources: [
        { domain: "epa.gov", title: "Greenhouse Gas Emissions from EVs", url: "https://www.epa.gov/greenvehicles" },
      ],
    },
    {
      id: "c3",
      text: "AI models can now pass the Turing test consistently.",
      verdict: "UNSURE",
      explanation: "While some AI systems have passed limited versions of the Turing test, there is no consensus that any model consistently passes rigorous evaluations.",
      sources: [
        { domain: "arxiv.org", title: "Evaluating LLM Conversational Ability", url: "https://arxiv.org" },
        { domain: "nature.com", title: "Can machines think?", url: "https://nature.com" },
      ],
    },
    {
      id: "c4",
      text: "The Amazon rainforest produces 20% of the world's oxygen.",
      verdict: "FALSE",
      explanation: "This is a common misconception. The Amazon consumes nearly as much oxygen as it produces through decomposition. Net oxygen contribution is close to zero.",
      sources: [
        { domain: "nationalgeographic.com", title: "Why the Amazon doesn't produce 20% of Earth's oxygen", url: "https://nationalgeographic.com" },
      ],
    },
  ],
  timestamp: new Date().toISOString(),
  inputPreview: "Global temperatures have risen by 1.1°C since pre-industrial times. Electric vehicles produce zero emissions...",
};

export const mockHistory: AnalysisResult[] = [
  { ...mockResult, id: "h1", timestamp: new Date(Date.now() - 3600000).toISOString(), score: 85, inputPreview: "Study shows coffee reduces heart disease risk..." },
  { ...mockResult, id: "h2", timestamp: new Date(Date.now() - 7200000).toISOString(), score: 34, inputPreview: "5G towers linked to health concerns in new report..." },
];
