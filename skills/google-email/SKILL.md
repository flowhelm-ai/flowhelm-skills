---
name: google-email
description: Gmail — email etiquette, response formatting, and full API operations via the google_workspace MCP tool.
version: 1.0.0
requires:
  tools: [google_workspace]
  channels: [gmail]
---

# Google Email

This skill covers both **how to communicate via email** (formatting, etiquette, tone) and **how to operate on email** (send, search, read, reply, forward, triage, labels, drafts) using the `google_workspace` MCP tool.

---

## Part 1: Email Communication

You are communicating with the user via email (Gmail). Your responses should read like professional, well-formatted emails rather than chat messages.

### Email Context

When you receive a message, it includes structured metadata:

- **From**: Sender name and email address
- **Subject**: Email subject line
- **Date**: When the email was sent
- **Thread**: Whether this is part of an ongoing conversation
- **Labels**: Gmail labels (Inbox, Important, etc.)

Use this context to understand priority and tone. An email labeled "Important" from the user's manager warrants a different approach than a newsletter notification.

### Response Formatting

Email supports rich formatting. Structure your responses for readability:

- **Use paragraphs** — Email is not chat. Write in complete sentences with logical paragraph breaks.
- **Use headings** for long responses with multiple sections.
- **Use bullet points** for lists of items, options, or action items.
- **Use bold** for key terms, deadlines, or action items the reader should not miss.
- **Keep subject-relevant** — Stay on topic. If the user asked about one thing, don't add unrelated information.

### Email Etiquette

1. **Match the sender's tone** — If the email is formal ("Dear...", "Best regards"), respond formally. If casual ("Hey!", "Thanks!"), respond casually.
2. **Be concise but complete** — Email readers expect a complete answer. Unlike chat, they may not check back for hours. Include all necessary information in one response.
3. **No greeting/signature needed** — The adapter handles email headers. Don't add "Dear User" or "Best regards" — focus on the content.
4. **Action items first** — If the email requires action, state what needs to happen at the top, then provide supporting detail.
5. **Quote sparingly** — Don't repeat the entire incoming email. Reference specific points when needed.

### Thread Behavior

- In a thread, you have context from previous messages. Reference earlier points naturally without re-explaining.
- If the thread has diverged from the original subject, note the topic shift.
- For long threads, summarize the current state before adding your response.

### Handling Different Email Types

**Notifications and Alerts**: Acknowledge concisely. State action if needed, confirm receipt if informational.

**Questions and Requests**: Answer directly — lead with the answer, then explain. If the request involves multiple steps, number them.

**FYI / Information Sharing**: Acknowledge receipt. Extract and highlight key takeaways. Note any follow-up actions or deadlines.

### Cross-Channel Notifications

When an email triggers a notification on another channel (e.g., Telegram), the user sees a brief summary there. Your full response is sent via email. Write the email response as the complete, authoritative reply — the notification is just an alert.

### Email-Specific Tips

1. **Longer responses are acceptable** — Unlike chat, email readers expect thorough responses. Don't artificially truncate.
2. **Structure over brevity** — A well-structured 200-word email is better than a terse 20-word reply that requires follow-up.
3. **Links and references** — Include full URLs rather than hyperlinked text when sharing resources.
4. **Code and technical content** — Use code blocks. Most email clients render monospace formatting.
5. **Attachments** — You cannot send attachments directly in responses. Use the API commands below to send emails with attachments.

---

## Part 2: Gmail API Operations

Use the `google_workspace` MCP tool to manage email programmatically. Pass a command string — the system handles authentication and execution.

### Command Syntax

```
<service> <resource> <method> [flags]
```

### Common Flags

| Flag | Description |
|------|-------------|
| `--params '{"key": "val"}'` | URL/query parameters (JSON in single quotes) |
| `--json '{"key": "val"}'` | Request body (JSON in single quotes) |
| `--format table` | Output as table instead of JSON |
| `--page-all` | Auto-paginate all results |
| `--dry-run` | Preview without executing |

### Helper Commands

Helper commands (prefixed with `+`) simplify common operations. Always prefer helpers over raw API calls when available.

#### Send Email

```
gmail +send --to <EMAILS> --subject <SUBJECT> --body <TEXT>
```

| Flag | Required | Description |
|------|----------|-------------|
| `--to` | Yes | Recipient(s), comma-separated |
| `--subject` | Yes | Subject line |
| `--body` | Yes | Body text (plain text, or HTML with `--html`) |
| `--cc` | No | CC recipient(s) |
| `--bcc` | No | BCC recipient(s) |
| `--from` | No | Send-as alias |
| `--attach` | No | File path (repeatable) |
| `--html` | No | Treat body as HTML |
| `--draft` | No | Save as draft instead of sending |

Examples:
```
gmail +send --to alice@example.com --subject 'Hello' --body 'Hi Alice!'
gmail +send --to alice@example.com --subject 'Report' --body '<b>Summary</b>' --html --cc bob@example.com
gmail +send --to alice@example.com --subject 'Files' --body 'See attached' --attach report.pdf
```

> **Write command** — confirm with the user before executing.

#### Read Email

```
gmail +read --id <MESSAGE_ID>
```

| Flag | Required | Description |
|------|----------|-------------|
| `--id` | Yes | Gmail message ID |
| `--headers` | No | Include From, To, Subject, Date |
| `--html` | No | Return HTML body instead of plain text |

Examples:
```
gmail +read --id 18f1a2b3c4d
gmail +read --id 18f1a2b3c4d --headers
```

#### Triage Inbox

```
gmail +triage
```

| Flag | Required | Description |
|------|----------|-------------|
| `--max` | No | Max messages (default: 20) |
| `--query` | No | Gmail search query (default: is:unread) |
| `--labels` | No | Include label names |

Examples:
```
gmail +triage
gmail +triage --max 5 --query 'from:boss'
gmail +triage --labels
```

Read-only — never modifies the mailbox.

#### Reply

```
gmail +reply --message-id <ID> --body <TEXT>
```

| Flag | Required | Description |
|------|----------|-------------|
| `--message-id` | Yes | Message ID to reply to |
| `--body` | Yes | Reply text |
| `--to` | No | Additional To recipient(s) |
| `--cc` | No | CC recipient(s) |
| `--bcc` | No | BCC recipient(s) |
| `--attach` | No | File path (repeatable) |
| `--html` | No | Treat body as HTML |
| `--draft` | No | Save as draft |

Automatically sets In-Reply-To, References, and threadId headers.

> **Write command** — confirm with the user before executing.

#### Reply All

```
gmail +reply-all --message-id <ID> --body <TEXT>
```

Same flags as `+reply`, plus:

| Flag | Description |
|------|-------------|
| `--remove` | Exclude recipient(s) from reply-all (comma-separated) |

Replies to sender and all original To/CC recipients.

> **Write command** — confirm with the user before executing.

#### Forward

```
gmail +forward --message-id <ID> --to <EMAILS>
```

| Flag | Required | Description |
|------|----------|-------------|
| `--message-id` | Yes | Message ID to forward |
| `--to` | Yes | Recipient(s) |
| `--body` | No | Note above forwarded message |
| `--cc` | No | CC recipient(s) |
| `--attach` | No | Additional file (repeatable) |
| `--no-original-attachments` | No | Exclude original attachments |
| `--html` | No | Treat body as HTML |
| `--draft` | No | Save as draft |

Original attachments included by default.

> **Write command** — confirm with the user before executing.

### Raw API Methods

For operations not covered by helpers, use the raw API:

#### Search Messages

```
gmail users messages list --params '{"userId": "me", "q": "from:alice subject:report", "maxResults": 10}'
```

#### Get Message (metadata)

```
gmail users messages get --params '{"userId": "me", "id": "MESSAGE_ID", "format": "metadata", "metadataHeaders": ["Subject", "From", "Date"]}'
```

#### Get Message (full)

```
gmail users messages get --params '{"userId": "me", "id": "MESSAGE_ID", "format": "full"}'
```

#### List Labels

```
gmail users labels list --params '{"userId": "me"}'
```

#### Modify Labels

```
gmail users messages modify --params '{"userId": "me", "id": "MESSAGE_ID"}' --json '{"addLabelIds": ["STARRED"], "removeLabelIds": ["UNREAD"]}'
```

#### Trash / Untrash

```
gmail users messages trash --params '{"userId": "me", "id": "MESSAGE_ID"}'
gmail users messages untrash --params '{"userId": "me", "id": "MESSAGE_ID"}'
```

#### Search Threads

```
gmail users threads list --params '{"userId": "me", "q": "subject:meeting"}'
```

#### Get User Profile

```
gmail users getProfile --params '{"userId": "me"}'
```

#### List Drafts

```
gmail users drafts list --params '{"userId": "me"}'
```

#### Settings — Vacation Responder

```
gmail users settings getVacation --params '{"userId": "me"}'
gmail users settings updateVacation --params '{"userId": "me"}' --json '{"enableAutoReply": true, "responseSubject": "Out of Office", "responseBodyPlainText": "I am away."}'
```

### API Tips

- Always use `"userId": "me"` in params for the authenticated user.
- Gmail search syntax works in the `q` parameter: `from:`, `to:`, `subject:`, `is:unread`, `has:attachment`, `after:2024/01/01`, `label:important`.
- Use `--format table` for human-readable output when triaging.
- With `--html`, use fragment tags (`<p>`, `<b>`, `<a>`) — no `<html>` wrapper needed.
- Max attachment size: 25 MB total.
