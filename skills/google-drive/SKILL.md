---
name: google-drive
description: Google Drive API operations via the google_workspace MCP tool — files, folders, sharing, upload, permissions.
version: 1.0.0
requires:
  tools: [google_workspace]
---

# Google Drive

Use the `google_workspace` MCP tool to manage files, folders, and shared drives. Pass a command string — the system handles authentication and execution.

## Command Syntax

```
<service> <resource> <method> [flags]
```

### Common Flags

| Flag | Description |
|------|-------------|
| `--params '{"key": "val"}'` | URL/query parameters (JSON in single quotes) |
| `--json '{"key": "val"}'` | Request body (JSON in single quotes) |
| `-o, --output <PATH>` | Save binary response to file |
| `--upload <PATH>` | Upload file content |
| `--format table` | Output as table instead of JSON |
| `--page-all` | Auto-paginate all results |

## Helper Commands

### Upload File

```
drive +upload <FILE_PATH>
```

| Flag | Required | Description |
|------|----------|-------------|
| `<file>` | Yes | Path to file |
| `--parent` | No | Parent folder ID |
| `--name` | No | Target filename (defaults to source) |

Examples:
```
drive +upload ./report.pdf
drive +upload ./report.pdf --parent FOLDER_ID
drive +upload ./data.csv --name 'Sales Data.csv'
```

MIME type is detected automatically.

> **Write command** — confirm with the user before executing.

## File Operations

### List Files

```
drive files list --params '{"pageSize": 10, "fields": "files(id,name,mimeType,modifiedTime,size)"}'
```

### Search Files

```
drive files list --params '{"q": "name contains '\''report'\'' and mimeType = '\''application/pdf'\''", "fields": "files(id,name,mimeType,modifiedTime)"}'
```

Common search operators for `q`:
- `name contains 'term'` — file name contains term
- `mimeType = 'application/pdf'` — filter by type
- `'FOLDER_ID' in parents` — files in specific folder
- `trashed = false` — exclude trash
- `modifiedTime > '2026-01-01T00:00:00'` — modified after date
- `sharedWithMe = true` — shared files
- `starred = true` — starred files

### Get File Metadata

```
drive files get --params '{"fileId": "FILE_ID", "fields": "id,name,mimeType,size,modifiedTime,webViewLink,parents"}'
```

### Download File

```
drive files get --params '{"fileId": "FILE_ID", "alt": "media"}' -o ./downloaded-file.pdf
```

### Export Google Doc as PDF

```
drive files export --params '{"fileId": "DOC_ID", "mimeType": "application/pdf"}' -o ./document.pdf
```

Export MIME types: `application/pdf`, `text/plain`, `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx), `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (docx).

### Create File

```
drive files create --json '{"name": "New Document", "mimeType": "application/vnd.google-apps.document"}' --params '{"fields": "id,name,webViewLink"}'
```

Google Workspace MIME types:
- `application/vnd.google-apps.document` — Google Docs
- `application/vnd.google-apps.spreadsheet` — Google Sheets
- `application/vnd.google-apps.presentation` — Google Slides
- `application/vnd.google-apps.folder` — Folder

> **Write command** — confirm with the user before executing.

### Create Folder

```
drive files create --json '{"name": "Project Files", "mimeType": "application/vnd.google-apps.folder"}' --params '{"fields": "id,name"}'
```

### Move File to Folder

```
drive files update --params '{"fileId": "FILE_ID", "addParents": "FOLDER_ID", "removeParents": "OLD_FOLDER_ID", "fields": "id,name,parents"}'
```

### Copy File

```
drive files copy --params '{"fileId": "FILE_ID"}' --json '{"name": "Copy of Document"}' --params '{"fields": "id,name,webViewLink"}'
```

### Rename File

```
drive files update --params '{"fileId": "FILE_ID", "fields": "id,name"}' --json '{"name": "New Name.pdf"}'
```

### Trash File

```
drive files update --params '{"fileId": "FILE_ID"}' --json '{"trashed": true}'
```

> **Write command** — confirm with the user before executing.

## Sharing and Permissions

### Share with User

```
drive permissions create --params '{"fileId": "FILE_ID"}' --json '{"role": "writer", "type": "user", "emailAddress": "alice@example.com"}'
```

Roles: `reader`, `commenter`, `writer`, `organizer` (shared drives only).

> **Write command** — confirm with the user before executing.

### Share with Anyone (link sharing)

```
drive permissions create --params '{"fileId": "FILE_ID"}' --json '{"role": "reader", "type": "anyone"}'
```

### List Permissions

```
drive permissions list --params '{"fileId": "FILE_ID", "fields": "permissions(id,role,type,emailAddress,displayName)"}'
```

### Remove Permission

```
drive permissions delete --params '{"fileId": "FILE_ID", "permissionId": "PERMISSION_ID"}'
```

## Storage Info

```
drive about get --params '{"fields": "storageQuota"}'
```

## Tips

- Always include `fields` parameter to control which fields are returned — the API returns minimal data by default.
- File search (`q` parameter) uses Drive's query language, not SQL. String values use single quotes inside the query.
- `--page-all` fetches all pages automatically. Use `pageSize` to control page size (max 1000).
- Google Workspace files (Docs, Sheets, Slides) have zero `size` — they don't count against quota.
- Use `export` for Google Workspace files, `get` with `alt=media` for binary files.
- Max upload size: 5 TB. Max export size: 10 MB.
