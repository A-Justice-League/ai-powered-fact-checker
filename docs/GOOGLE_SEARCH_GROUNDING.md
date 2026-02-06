# Google Search Grounding Implementation Guide

## Overview

**Google Search Grounding** is a feature of the Gemini API that allows the AI model to search the web in real-time to verify factual claims. This document explains how it's implemented in our AI-Powered Fact Checker.

---

## What is Google Search Grounding?

Google Search Grounding enables Gemini to:
- **Search the live web** during content generation
- **Cite sources** for its claims
- **Verify information** against up-to-date data
- **Ground responses** in real-world evidence

This is critical for fact-checking because it allows Gemini to:
1. Extract claims from user input
2. **Automatically search Google** to find supporting or contradicting evidence
3. Return structured verdicts (TRUE/FALSE/UNSURE) with cited sources

---

## Implementation Details

### Location in Codebase
The grounding feature is implemented in:
```
backend/app/services/gemini.py
```

### Code Walkthrough

#### 1. Configuring the Grounding Tool

In the `GeminiService` class, we configure grounding before making API calls:

```python
from google.genai import types

# Configure Google Search Grounding
grounding_tool = types.Tool(
    google_search=types.GoogleSearch()
)

config = types.GenerateContentConfig(
    tools=[grounding_tool],
    response_mime_type="application/json"
)
```

**Key Points:**
- `types.Tool` is the wrapper for any tool the model can use
- `types.GoogleSearch()` specifically enables web search
- The tool is passed to `GenerateContentConfig` via the `tools` parameter

#### 2. Making a Grounded Request

```python
response = self.client.models.generate_content(
    model="gemini-2.0-flash",
    contents=prompt,
    config=config  # This includes the grounding tool
)
```

When we pass the `config` with the grounding tool:
- Gemini will automatically search Google when it needs to verify claims
- The search is triggered internally by Gemini based on the prompt
- We don't manually specify *what* to search—Gemini decides based on the claims

#### 3. Prompt Design for Grounding

Our prompt explicitly instructs Gemini to use the search tool:

```python
prompt = """
You are a professional fact-checking assistant. 
Analyze the following text and extract the key factual claims.
For each claim, use Google Search to verify its accuracy.

Response Format Schema:
{
    "summaryVerdict": "A brief overview of the overall truthfulness",
    "claims": [
        {
            "text": "The exact claim extracted",
            "verdict": "TRUE" | "FALSE" | "UNSURE",
            "explanation": "Brief reasoning based on search results",
            "sources": [
                {
                    "domain": "example.com",
                    "title": "Page Title",
                    "url": "https://example.com/source"
                }
            ]
        }
    ]
}
"""
```

**Critical Phrase:**
> "For each claim, **use Google Search** to verify its accuracy."

This explicitly tells Gemini to leverage the grounding tool.

---

## How It Works (Step-by-Step)

### Text Analysis Flow

1. **User submits text** → Frontend sends to `/analyze-text`
2. **Backend receives request** → Extracts text from `FactCheckRequest`
3. **GeminiService constructs prompt** → Adds instructions to use search
4. **Grounding tool is enabled** → `types.Tool(google_search=...)`
5. **Gemini API call is made** → Model receives prompt + tool config
6. **Gemini extracts claims** internally
7. **Gemini searches Google** for each claim (automatic, behind the scenes)
8. **Gemini synthesizes results** → Returns JSON with verdicts + sources
9. **Backend parses response** → Creates `Claim` objects with `Source` citations
10. **Frontend displays results** → Users see verdicts and clickable source links

### Image Analysis Flow

Same as above, but:
- Input is `types.Part.from_bytes(image_data)`
- Gemini first "reads" the image to extract text/claims
- Then searches Google to verify the extracted claims

---

## Response Structure with Grounding

### Example Grounded Response

When grounding is successful, the response includes structured sources:

```json
{
  "claims": [
    {
      "text": "Global temperatures have risen by 1.1°C since pre-industrial times.",
      "verdict": "TRUE",
      "explanation": "Consistent with NASA and IPCC data from 2021.",
      "sources": [
        {
          "domain": "nasa.gov",
          "title": "Global Temperature | NASA",
          "url": "https://climate.nasa.gov/vital-signs/global-temperature/"
        },
        {
          "domain": "ipcc.ch",
          "title": "AR6 Climate Change 2021",
          "url": "https://www.ipcc.ch/report/ar6/wg1/"
        }
      ]
    }
  ]
}
```

**Key Fields from Grounding:**
- `sources[].domain`: The website domain Gemini found
- `sources[].title`: The page title
- `sources[].url`: Direct link to the source

These are **real URLs** that Gemini discovered through Google Search.

---

## Grounding Metadata (Advanced)

The Gemini API response includes a `groundingMetadata` field (not currently exposed in our frontend):

```python
# In the raw response object:
response.grounding_metadata
```

This metadata includes:
- **`webSearchQueries`**: The exact search queries Gemini generated
- **`groundingChunks`**: Text snippets from discovered sources
- **`groundingSupports`**: Mapping of response text to supporting chunks

### Future Enhancement

We could expose this metadata to show users:
- "Gemini searched for: 'global temperature increase since 1850'"
- Inline citations next to specific sentences

---

## Verification Steps

### How to Confirm Grounding is Working

1. **Run a test analysis** with a well-known fact:
   ```bash
   curl -X POST http://localhost:8000/analyze-text \
     -H "Content-Type: application/json" \
     -d '{"text": "The Eiffel Tower is 330 meters tall."}'
   ```

2. **Check the response** for sources:
   ```json
   {
     "sources": [
       {
         "domain": "toureiffel.paris",
         "title": "The Eiffel Tower: Key figures",
         "url": "https://www.toureiffel.paris/en/the-monument"
       }
     ]
   }
   ```

3. **If sources are present**, grounding is working!
4. **If sources are empty**, check:
   - Is `GEMINI_API_KEY` valid?
   - Is the Google Search Grounding feature enabled for your API key?
   - Is the prompt clear about using search?

---

## Limitations & Edge Cases

### When Grounding May Fail

1. **Subjective Claims**: "Chocolate is the best dessert"
   - No objective truth to search for
   - Gemini will likely return `UNSURE`

2. **Very Recent Events**: Breaking news from the last few hours
   - Search may not have indexed results yet
   - Gemini may return `UNSURE` with limited sources

3. **Obscure Topics**: Highly niche or technical claims
   - Few search results available
   - Sources may be low-quality

4. **Ambiguous Phrasing**: "He said it was true"
   - Missing context (who is "he"? what is "it"?)
   - Gemini may ask for clarification or return `UNSURE`

---

## Cost & Rate Limits

### API Pricing
- Google Search Grounding adds **extra cost** per Gemini request
- Check current pricing: https://ai.google.dev/pricing

### Rate Limits
- Gemini API has request-per-minute limits
- Grounding may count as additional quota usage
- See: https://ai.google.dev/gemini-api/docs/quota

### Optimization Tips
- Cache results for identical inputs
- Batch requests when possible
- Use grounding only when necessary (not for every analysis)

---

## Supported Models

Google Search Grounding is supported on:
- ✅ **Gemini 2.0 Flash** (our current model)
- ✅ Gemini 2.5 Pro
- ✅ Gemini 2.5 Flash
- ✅ Gemini 3 Flash Preview (for hackathon)

**Not supported on:**
- ❌ Gemini 1.0 models (legacy)

---

## Troubleshooting

### "Sources array is empty"

**Possible Causes:**
1. Grounding tool not configured correctly
2. Prompt doesn't explicitly request search
3. API key lacks grounding permissions

**Solution:**
- Verify `types.Tool(google_search=types.GoogleSearch())` is in config
- Check prompt includes "use Google Search to verify"
- Test with the official Gemini API playground

### "Model returned non-JSON response"

**Possible Causes:**
1. Gemini ignored the JSON schema
2. Grounding metadata broke JSON structure

**Solution:**
- Our code has fallback regex extraction: `re.search(r'\{.*\}', response.text)`
- This handles cases where Gemini adds extra text around JSON

### "Rate limit exceeded"

**Solution:**
- Implement retry logic (see Issue #5)
- Add exponential backoff
- Cache results (see Issue #7)

---

## References

- **Official Documentation**: https://ai.google.dev/gemini-api/docs/google-search
- **Python SDK Guide**: https://github.com/googleapis/python-genai
- **Grounding Best Practices**: https://ai.google.dev/gemini-api/docs/grounding

---

## Next Steps

To improve our grounding implementation:

1. **Expose grounding metadata** in the frontend (show search queries)
2. **Add grounding confidence scores** (how strongly does the source support the claim?)
3. **Filter low-quality sources** (prioritize authoritative domains)
4. **Add "Search on Google" links** for users to verify manually

See **Issue #4** for the full tracking of these enhancements.
