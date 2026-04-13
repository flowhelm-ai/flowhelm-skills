---
name: google-calendar
description: Google Calendar API operations via the google_workspace MCP tool — events, agenda, scheduling, freebusy.
version: 1.0.0
requires:
  tools: [google_workspace]
---

# Google Calendar

Use the `google_workspace` MCP tool to manage calendars and events. Pass a command string — the system handles authentication and execution.

## Command Syntax

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

## Helper Commands

### View Agenda

```
calendar +agenda
```

| Flag | Required | Description |
|------|----------|-------------|
| `--today` | No | Show today's events |
| `--tomorrow` | No | Show tomorrow's events |
| `--week` | No | Show this week's events |
| `--days` | No | Number of days ahead to show |
| `--calendar` | No | Filter by calendar name or ID |
| `--timezone` | No | IANA timezone (e.g., America/New_York) |

Examples:
```
calendar +agenda
calendar +agenda --today
calendar +agenda --week --format table
calendar +agenda --days 3 --calendar 'Work'
calendar +agenda --today --timezone America/Los_Angeles
```

Read-only — never modifies events.

### Create Event

```
calendar +insert --summary <TEXT> --start <TIME> --end <TIME>
```

| Flag | Required | Description |
|------|----------|-------------|
| `--summary` | Yes | Event title |
| `--start` | Yes | Start time (ISO 8601, e.g., 2026-06-17T09:00:00-07:00) |
| `--end` | Yes | End time (ISO 8601) |
| `--calendar` | No | Calendar ID (default: primary) |
| `--location` | No | Event location |
| `--description` | No | Event description |
| `--attendee` | No | Attendee email (repeatable) |
| `--meet` | No | Add Google Meet link |

Examples:
```
calendar +insert --summary 'Team Standup' --start '2026-06-17T09:00:00-07:00' --end '2026-06-17T09:30:00-07:00'
calendar +insert --summary 'Review' --start '2026-06-17T14:00:00-07:00' --end '2026-06-17T15:00:00-07:00' --attendee alice@example.com --meet
calendar +insert --summary 'Lunch' --start '2026-06-17T12:00:00-07:00' --end '2026-06-17T13:00:00-07:00' --location 'Cafe Roma'
```

> **Write command** — confirm with the user before executing.

## Raw API Methods

### List Events

```
calendar events list --params '{"calendarId": "primary", "timeMin": "2026-06-17T00:00:00Z", "timeMax": "2026-06-18T00:00:00Z", "singleEvents": true, "orderBy": "startTime"}'
```

### Get Event

```
calendar events get --params '{"calendarId": "primary", "eventId": "EVENT_ID"}'
```

### Update Event

```
calendar events patch --params '{"calendarId": "primary", "eventId": "EVENT_ID"}' --json '{"summary": "Updated Title", "location": "New Location"}'
```

### Delete Event

```
calendar events delete --params '{"calendarId": "primary", "eventId": "EVENT_ID"}'
```

> **Write command** — confirm with the user before executing.

### Move Event to Another Calendar

```
calendar events move --params '{"calendarId": "primary", "eventId": "EVENT_ID", "destination": "TARGET_CALENDAR_ID"}'
```

### Quick Add (natural language)

```
calendar events quickAdd --params '{"calendarId": "primary", "text": "Lunch with Alice tomorrow at noon"}'
```

### Check Free/Busy

```
calendar freebusy query --json '{"timeMin": "2026-06-17T00:00:00Z", "timeMax": "2026-06-18T00:00:00Z", "items": [{"id": "alice@example.com"}, {"id": "bob@example.com"}]}'
```

### List Calendars

```
calendar calendarList list
```

### Get Calendar Settings

```
calendar settings list
```

## Tips

- Use RFC 3339 format for times: `2026-06-17T09:00:00-07:00` (with timezone offset) or `2026-06-17T16:00:00Z` (UTC).
- `calendarId: "primary"` refers to the user's main calendar.
- `singleEvents: true` expands recurring events into individual instances.
- `orderBy: "startTime"` requires `singleEvents: true`.
- The `quickAdd` method parses natural language (e.g., "Meeting with Bob at 3pm tomorrow").
- Use `--format table` for human-readable agenda output.
