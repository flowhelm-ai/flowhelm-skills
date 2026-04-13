---
name: google-contacts
description: Google Contacts (People API) operations via the google_workspace MCP tool — search, create, update, delete contacts.
version: 1.0.0
requires:
  tools: [google_workspace]
---

# Google Contacts

Use the `google_workspace` MCP tool to manage contacts via the Google People API. Pass a command string — the system handles authentication and execution.

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

## Contact Operations

### Search Contacts

```
people people searchContacts --params '{"query": "Alice", "readMask": "names,emailAddresses,phoneNumbers"}'
```

The `readMask` controls which fields are returned. Common fields: `names`, `emailAddresses`, `phoneNumbers`, `organizations`, `addresses`, `birthdays`, `biographies`, `photos`.

**Important**: The People API caches search results. For a fresh search, send a warmup request first with an empty query:
```
people people searchContacts --params '{"query": "", "readMask": "names"}'
```

### Get Contact

```
people people get --params '{"resourceName": "people/CONTACT_ID", "personFields": "names,emailAddresses,phoneNumbers,organizations"}'
```

Use `people/me` for the authenticated user's profile.

### Create Contact

```
people people createContact --json '{"names": [{"givenName": "Alice", "familyName": "Smith"}], "emailAddresses": [{"value": "alice@example.com", "type": "work"}], "phoneNumbers": [{"value": "+1-555-0100", "type": "mobile"}]}'
```

> **Write command** — confirm with the user before executing.

### Update Contact

```
people people updateContact --params '{"resourceName": "people/CONTACT_ID", "updatePersonFields": "names,emailAddresses"}' --json '{"etag": "ETAG", "names": [{"givenName": "Alice", "familyName": "Johnson"}], "emailAddresses": [{"value": "alice.j@example.com"}]}'
```

**Important**: You must include the `etag` from the contact's current data. Get it first with a `get` call.

> **Write command** — confirm with the user before executing.

### Delete Contact

```
people people deleteContact --params '{"resourceName": "people/CONTACT_ID"}'
```

> **Write command** — confirm with the user before executing.

## Contact Group Operations

### List Groups

```
people contactGroups list
```

### Create Group

```
people contactGroups create --json '{"contactGroup": {"name": "Project Team"}}'
```

### Add to Group

```
people contactGroups members modify --params '{"resourceName": "contactGroups/GROUP_ID"}' --json '{"resourceNamesToAdd": ["people/CONTACT_ID_1", "people/CONTACT_ID_2"]}'
```

## Other Contacts

"Other contacts" are auto-created from interactions (emails sent/received).

### Search Other Contacts

```
people otherContacts search --params '{"query": "bob", "readMask": "names,emailAddresses,phoneNumbers"}'
```

**Note**: This requires the `contacts.other.readonly` OAuth scope. If you get a 403 error, use `people people searchContacts` instead (searches your saved contacts).

### List Other Contacts

```
people otherContacts list --params '{"readMask": "names,emailAddresses", "pageSize": 100}'
```

## Directory (Workspace domains only)

### Search Directory

```
people people searchDirectoryPeople --params '{"query": "alice", "readMask": "names,emailAddresses", "sources": ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"]}'
```

### List Directory

```
people people listDirectoryPeople --params '{"readMask": "names,emailAddresses", "sources": ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"], "pageSize": 100}'
```

## Tips

- `resourceName` format is `people/CONTACT_ID` (e.g., `people/c751617559026799946`).
- Always include `readMask` or `personFields` — the API returns nothing without it.
- Common `readMask` fields: `names`, `emailAddresses`, `phoneNumbers`, `organizations`, `addresses`, `birthdays`, `biographies`, `photos`, `memberships`.
- Contact search matches on names, nicknames, email addresses, phone numbers, and organizations.
- Mutate requests for the same user should be sent sequentially (API limitation).
- Use `--page-all` when listing contacts to get all pages automatically.
