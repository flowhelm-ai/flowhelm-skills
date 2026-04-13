---
name: google-tasks
description: Google Tasks API operations via the google_workspace MCP tool — task lists, tasks, due dates, completion.
version: 1.0.0
requires:
  tools: [google_workspace]
---

# Google Tasks

Use the `google_workspace` MCP tool to manage task lists and tasks. Pass a command string — the system handles authentication and execution.

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

## Task List Operations

### List All Task Lists

```
tasks tasklists list
```

### Create Task List

```
tasks tasklists insert --json '{"title": "Project Alpha"}'
```

> **Write command** — confirm with the user before executing.

### Rename Task List

```
tasks tasklists patch --params '{"tasklist": "TASKLIST_ID"}' --json '{"title": "New Name"}'
```

### Delete Task List

```
tasks tasklists delete --params '{"tasklist": "TASKLIST_ID"}'
```

> **Write command** — confirm with the user before executing.

## Task Operations

### List Tasks

```
tasks tasks list --params '{"tasklist": "TASKLIST_ID"}'
```

To include completed tasks:
```
tasks tasks list --params '{"tasklist": "TASKLIST_ID", "showCompleted": true, "showHidden": true}'
```

### Create Task

```
tasks tasks insert --params '{"tasklist": "TASKLIST_ID"}' --json '{"title": "Write report", "notes": "Include Q2 figures", "due": "2026-06-20T00:00:00Z"}'
```

> **Write command** — confirm with the user before executing.

### Create Subtask

```
tasks tasks insert --params '{"tasklist": "TASKLIST_ID", "parent": "PARENT_TASK_ID"}' --json '{"title": "Gather data"}'
```

### Update Task

```
tasks tasks patch --params '{"tasklist": "TASKLIST_ID", "task": "TASK_ID"}' --json '{"title": "Updated title", "notes": "Updated notes"}'
```

### Complete Task

```
tasks tasks patch --params '{"tasklist": "TASKLIST_ID", "task": "TASK_ID"}' --json '{"status": "completed"}'
```

### Uncomplete Task

```
tasks tasks patch --params '{"tasklist": "TASKLIST_ID", "task": "TASK_ID"}' --json '{"status": "needsAction"}'
```

### Set Due Date

```
tasks tasks patch --params '{"tasklist": "TASKLIST_ID", "task": "TASK_ID"}' --json '{"due": "2026-06-25T00:00:00Z"}'
```

### Move Task (reorder or reparent)

```
tasks tasks move --params '{"tasklist": "TASKLIST_ID", "task": "TASK_ID", "parent": "NEW_PARENT_ID", "previous": "PREVIOUS_SIBLING_ID"}'
```

Omit `parent` to move to top level. Omit `previous` to move to first position.

### Delete Task

```
tasks tasks delete --params '{"tasklist": "TASKLIST_ID", "task": "TASK_ID"}'
```

> **Write command** — confirm with the user before executing.

### Clear Completed Tasks

```
tasks tasks clear --params '{"tasklist": "TASKLIST_ID"}'
```

Hides all completed tasks from the list. They can still be retrieved with `showCompleted: true`.

## Common Workflows

### Review Overdue Tasks

```
tasks tasks list --params '{"tasklist": "TASKLIST_ID", "dueMax": "2026-06-17T00:00:00Z", "showCompleted": false}'
```

### List Today's Tasks

```
tasks tasks list --params '{"tasklist": "TASKLIST_ID", "dueMin": "2026-06-17T00:00:00Z", "dueMax": "2026-06-18T00:00:00Z", "showCompleted": false}'
```

## Tips

- Use `@default` as the tasklist ID for the user's default task list.
- Due dates use RFC 3339 format: `2026-06-20T00:00:00Z`. Only the date portion matters — time is always midnight UTC.
- Task status is either `needsAction` or `completed`.
- A user can have up to 2,000 task lists and 20,000 non-hidden tasks per list.
- Subtasks are up to 2,000 per parent task.
- `--page-all` fetches all pages when lists are long.
- Completed tasks are hidden by default. Use `showCompleted: true` to include them.
