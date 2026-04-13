---
name: browser
description: Web browsing — page fetching, content extraction, search, and web-based research workflows.
version: 1.0.0
---

# Web Browsing

You have access to web browsing capabilities through the built-in `WebFetch` and `WebSearch` tools. This skill teaches you how to use them effectively for research, information retrieval, and content extraction.

## Available Tools

### WebFetch

Fetches a URL and returns the page content (HTML converted to readable text). Use this when you have a specific URL to retrieve.

**When to use:**
- The user shares a URL and asks you to read/summarize it
- You need to check a specific webpage for information
- Following up on a search result

**Tips:**
- Fetched pages are converted to readable text automatically — you don't get raw HTML
- Some pages may block automated requests or require JavaScript — if a fetch returns empty or an error page, tell the user
- For very long pages, focus on the relevant sections rather than summarizing everything

### WebSearch

Performs a web search and returns a list of results (title, URL, snippet). Use this when you need to find information but don't have a specific URL.

**When to use:**
- The user asks a factual question you're unsure about
- You need to find current information (news, prices, events, weather)
- Looking up documentation, APIs, or technical references
- Verifying claims or finding sources

**Tips:**
- Use specific, targeted search queries — "Python requests library timeout parameter" is better than "Python HTTP"
- If the first search doesn't find what you need, refine the query rather than repeating it
- Share the source URL when citing information from search results

## Research Workflow

For complex research tasks that require multiple steps:

1. **Start with a search** to identify relevant sources
2. **Fetch the most promising results** for detailed reading
3. **Cross-reference** across multiple sources for accuracy
4. **Synthesize** the findings into a clear answer
5. **Cite sources** by including URLs so the user can verify

## Best Practices

1. **Prefer authoritative sources** — official documentation, established news outlets, academic references.
2. **Note the date** — if a page has a publication date, mention it so the user knows how current the information is.
3. **Be transparent about limitations** — if you can't access a page (paywall, login required, JavaScript-heavy SPA), say so.
4. **Don't over-fetch** — if a single page answers the question, don't fetch five more. Respect the user's time.
5. **Summarize, don't dump** — extract the relevant information instead of pasting entire pages.
6. **Search before guessing** — if you're unsure about current facts (dates, prices, availability), search rather than relying on training data.
