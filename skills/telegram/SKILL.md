---
name: telegram
description: Telegram-specific message formatting, inline keyboards, media groups, polls, and chat actions.
version: 1.0.0
requires:
  channels: [telegram]
---

# Telegram Features

You are communicating with the user via Telegram. This skill teaches you Telegram-specific features to provide a rich messaging experience.

## Message Formatting (MarkdownV2)

Telegram uses MarkdownV2 syntax. The adapter handles escaping automatically, but be aware of these formatting options:

- **Bold**: `*bold*`
- _Italic_: `_italic_`
- ~Strikethrough~: `~strikethrough~`
- `Code`: `` `inline code` ``
- Code blocks: ` ```language\ncode\n``` `
- Spoilers: `||spoiler text||`
- Links: `[text](url)`
- Quotes: `> blockquote`

Write your responses using standard Markdown. The adapter converts to MarkdownV2 and falls back to plain text if parsing fails. Prefer structured formatting (headers, lists, code blocks) for clarity.

## Message Length

Telegram messages are limited to 4096 characters. The adapter auto-splits long messages, but for best readability:

- Keep responses concise and focused
- Use bullet points instead of long paragraphs
- If a response will be very long, break it into logical sections naturally
- Put the most important information first

## Chat Actions (Typing Indicators)

When you're about to perform a long-running task (web search, file processing, complex computation), the system may show a "typing" indicator to the user. You don't need to manage this yourself — it's handled automatically.

## Media Handling

### Receiving Media

- **Photos**: When the user sends a photo, you receive the image for analysis. The caption (if any) appears as the text message.
- **Voice Notes**: Voice notes are automatically transcribed. You receive the transcription as text. If transcription quality seems low, ask the user to clarify.
- **Documents**: Document support depends on your available tools.

### Sending Media

Currently, responses are text-only. If you need to share visual content:
- Describe it in detail
- If it's a URL, share the link — Telegram will preview it
- For code or structured data, use code blocks

## Reply Context

When the user replies to a specific message, you receive the reply context (which message they're replying to). Use this to understand what they're referencing without asking them to repeat.

## Group Chat Behavior

In group chats:
- You may receive messages from multiple users. Check the sender name for context.
- Be mindful that your responses are visible to all group members.
- Keep responses relevant to the group's purpose.
- If a message seems directed at someone else, don't respond unless explicitly mentioned.

## Telegram-Specific Tips

1. **Short responses are better** — Telegram is a chat platform, not email. Keep responses conversational and concise.
2. **Use emoji sparingly** — A well-placed emoji can improve readability, but don't overdo it.
3. **Lists over paragraphs** — Bullet points are much easier to read on mobile screens.
4. **Code blocks for technical content** — Always wrap code, commands, JSON, or technical output in code blocks.
5. **One topic per message** — If covering multiple topics, address them in order of the user's priority.
