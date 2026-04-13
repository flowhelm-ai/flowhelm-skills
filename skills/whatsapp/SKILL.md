---
name: whatsapp
description: WhatsApp-specific message formatting, reactions, media handling, read receipts, and platform conventions.
version: 1.0.0
requires:
  channels: [whatsapp]
---

# WhatsApp Features

You are communicating with the user via WhatsApp. This skill teaches you WhatsApp-specific features and platform conventions for a natural messaging experience.

## Message Formatting

WhatsApp supports basic formatting:

- **Bold**: `*bold*`
- _Italic_: `_italic_`
- ~Strikethrough~: `~strikethrough~`
- `Monospace`: `` `monospace` ``
- Code blocks: ` ```code block``` `
- Bulleted lists: Lines starting with `- ` or `* `
- Numbered lists: Lines starting with `1. `, `2. `, etc.
- Quotes: Lines starting with `> `

WhatsApp does **not** support:
- Hyperlinks with display text (`[text](url)`) — links must be sent as plain URLs
- Headers or headings
- Inline images or media in text
- Tables

When including URLs, send them as plain text. WhatsApp auto-generates link previews.

## Message Length

WhatsApp technically supports ~65,000 characters per message, but the adapter splits at 4096 for readability. For best results:

- Keep responses concise — WhatsApp is a mobile-first platform
- Use bullet points and numbered lists for structured content
- Break complex answers into short paragraphs
- Put the most important information in the first paragraph

## Media Handling

### Receiving Media

- **Voice Notes**: Voice notes are automatically transcribed using the service container's speech-to-text pipeline. You receive the transcription as text. If the transcription seems uncertain, ask the user to rephrase.
- **Images**: When the user sends a photo, you receive the image for analysis. The caption (if any) appears as the text message.
- **Documents**: Not yet supported — the user should copy-paste text content instead.

### Sending Media

Currently, responses are text-only. If you need to share visual content:
- Describe it in detail
- Share URLs directly — WhatsApp will generate a link preview
- For code, use monospace formatting or code blocks

## Reply Context

When the user replies to a specific message (long-press → Reply), you receive the reply context. Use this to understand what they're referencing. This is especially important in longer conversations where context may be ambiguous.

## Group Chat Behavior

In WhatsApp groups:
- Messages come from individual participants. Check the sender name for context.
- You receive the group JID as the chat identifier and the individual's JID as the sender.
- Be mindful that responses are visible to all group members.
- If a message seems directed at someone else, don't respond unless explicitly mentioned.
- WhatsApp groups can have up to 1024 members — keep responses relevant and concise.

## WhatsApp-Specific Conventions

1. **Conversational tone** — WhatsApp users expect chat-style communication. Keep responses natural, not formal.
2. **Short messages preferred** — Mobile screens are small. Prefer 2-3 short paragraphs over one long block.
3. **Lists over paragraphs** — Bullet points and numbered lists are much easier to read on mobile.
4. **Code blocks for technical content** — Always wrap code, commands, JSON, or file paths in code blocks.
5. **Avoid walls of text** — If you need to give a long explanation, split it into digestible chunks.
6. **No emoji overuse** — A well-placed emoji can improve readability, but don't add emoji to every line.
7. **Plain URLs** — Never try to use markdown link syntax. Just paste the URL directly.

## Session and Connectivity

- WhatsApp Web sessions require the phone to have internet connectivity.
- If the session disconnects, the adapter will automatically attempt to reconnect with exponential backoff.
- After extended inactivity (~2 weeks), re-pairing via QR code scan may be required.
- If you notice the user hasn't received responses, suggest they check their WhatsApp Web session status.

## Differences from Telegram

If this agent also has a Telegram channel active, be aware of key differences:

| Feature | Telegram | WhatsApp |
|---|---|---|
| Formatting | MarkdownV2 (rich) | Basic (bold, italic, mono) |
| Links | `[text](url)` supported | Plain URLs only |
| Message limit | 4096 chars | ~65K chars (split at 4096) |
| Inline keyboards | Supported via skill | Not available |
| Polls | Supported via skill | Not available |
| Bot identity | Dedicated bot account | Personal phone number |
