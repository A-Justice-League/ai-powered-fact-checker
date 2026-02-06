# Google Search Grounding Implementation Guide 🔍

## Overview

**Google Search Grounding** is a core engine of the AI-Powered Fact Checker. It connects **Gemini 3** to Google Search, allowing the model to bridge its internal knowledge cutoff with real-time web data. This document details our direct REST implementation, verification steps, and how we expose grounding metadata to users.

---

## 🛠️ How It Works

Gemini 3 models (especially `flash-preview`) have a native capability to generate and execute Google Search queries.

### 1. Model Autonomy
We don't tell Gemini *what* to search for. Instead, we provide the **Google Search Tool** in the API request. When Gemini processes the fact-check prompt, it identifies claims that require external verification and automatically triggers the search tool.

### 2. Implementation: Direct REST API
For the Gemini 3 Hackathon, we use a **direct REST API integration** for maximum control over the grounding payload.

**Location:** `backend/app/services/gemini.py`

```python
# Payload structure sent to https://generativelanguage.googleapis.com/v1beta/models/...
payload = {
    "contents": [{"parts": [{"text": prompt}]}],
    "tools": [
        {"googleSearch": {}} # This enables the grounding engine
    ],
    "generationConfig": {
        "responseMimeType": "application/json"
    }
}
```

### 3. Verification & Metadata Extraction
The API response doesn't just return text; it returns **Grounding Metadata**. We specifically extract:
- **`webSearchQueries`**: The actual queries Gemini ran on Google.
- **`sources`**: Relevant URLs, titles, and snippets found during the search.

---

## 📋 Response Comparison

### Non-Grounded (Internal Knowledge Only)
Without grounding, Gemini relies solely on training data.
- **Accuracy**: May hallucinate details for very recent or niche events.
- **Evidence**: Cannot cite specific URLs or real-time pages.
- **Format**: Generic explanation without verification path.

### Grounded (Live Web Verification)
With grounding enabled, the response in our application includes:
```json
{
  "summaryVerdict": "The claim is verified by recent news reports.",
  "searchQueries": [
    "latest global temperature report feb 2026",
    "NASA global warming stats 2026"
  ],
  "claims": [
    {
      "text": "2025 was the second hottest year on record.",
      "verdict": "TRUE",
      "explanation": "According to reports from NOAA and NASA released in Jan 2026...",
      "sources": [
        {
          "domain": "nasa.gov",
          "title": "NASA Analysis: 2025 Temperature Data",
          "url": "https://climate.nasa.gov/news/..."
        }
      ]
    }
  ]
}
```

---

## 🔍 How to Verify Grounding is Working

Developers and auditors can verify that the grounding engine is active through two methods:

### 1. Response Metadata (API Level)
Check the `searchQueries` field in the API response. If this list contains queries, Gemini successfully triggered its search engine.

### 2. Frontend "Grounding Queries" Section
In the UI, after an analysis completes, look for the **"Gemini 3 Grounding Queries"** badge group. This displays the exact search terms Gemini used.

### 3. Source Traceability
Click on the cited sources. Real-time grounding always provides **active URLs**. If the URLs point to specific news articles or reports matching the claim's timeline, grounding is functioning correctly.

---

## 🏗️ Technical Architecture of Grounding

1. **Extraction**: Gemini identifies factual claims in the input.
2. **Query Generation**: Gemini writes 1-3 search queries per claim.
3. **Execution**: The Google Search engine processes these queries.
4. **Retrieval**: Search results are fed back into Gemini's context window.
5. **Synthesis**: Gemini compares the claims against the search results.
6. **Output**: Gemini generates the final JSON with citations.

---

## 📚 Official Resources

- **Gemini Grounding Overview**: [Google AI Documentation](https://ai.google.dev/gemini-api/docs/google-search)
- **Controlled Generation (JSON Mode)**: [Response Schema Guide](https://ai.google.dev/gemini-api/docs/control-generation)
- **Model Variants**: [Gemini 3 Capability Matrix](https://deepmind.google/technologies/gemini/)

---

## 🚀 Future Roadmap for Grounding
- **Confidence Scores**: Adding a "Source Authority" rating.
- **Multi-Search Reasoning**: Allowing Gemini to perform iterative searches if the first result is insufficient.
- **Grounding Chunks**: Highlighting the specific text segment in a source that supports a claim.
