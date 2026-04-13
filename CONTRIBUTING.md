# Contributing Skills to FlowHelm

Thank you for contributing to the FlowHelm skills registry. This guide covers how to create, test, and submit a skill.

## Before You Start

1. Check the [available skills](README.md) to avoid duplicates
2. Read an existing skill's `SKILL.md` for the expected format and tone
3. For complex skills, open an issue first to discuss the design

## Creating a Skill

### 1. Directory Structure

Create a directory under `skills/` with your skill name:

```
skills/my-skill/
├── SKILL.md          # Required: frontmatter + agent instructions
└── scripts/          # Optional: supporting scripts
    └── helper.sh
```

### 2. SKILL.md Format

```markdown
---
name: my-skill
description: One-line description (max 256 characters).
version: 1.0.0
requires:
  channels: []      # FlowHelm channels needed (telegram, gmail, whatsapp)
  bins: []          # Binary dependencies (checked at install time)
  env: []           # Environment variables required at runtime
  skills: []        # Other skills that must be installed first
  os: []            # OS restrictions (linux, macos). Empty = all.
---

# My Skill

Write instructions as if talking to the agent. This content is loaded
into Claude Code's context when the skill is active.
```

### 3. Naming Conventions

- Lowercase with hyphens: `my-skill`, not `MySkill` or `my_skill`
- Must start with a letter: `a-z`
- Only alphanumeric and hyphens: `a-z`, `0-9`, `-`
- Max 64 characters
- Use a descriptive name: `google-email` not `gmail`, `data-analysis` not `da`

### 4. Writing Instructions

The body of `SKILL.md` is loaded into the agent's context. Write as if you're briefing a capable assistant:

- **Be specific** — include exact command syntax, API patterns, and formatting rules
- **Be concise** — every token counts. Cut fluff, keep signal
- **Use examples** — show the agent what good output looks like
- **Structure with headers** — the agent scans for relevant sections
- **Declare limitations** — if something doesn't work, say so

### 5. Add to registry.json

Add your skill entry to `registry.json`:

```json
{
  "name": "my-skill",
  "description": "One-line description matching your SKILL.md frontmatter.",
  "version": "1.0.0",
  "path": "skills/my-skill",
  "sha256": "..."
}
```

Generate the SHA-256 hash:

```bash
shasum -a 256 skills/my-skill/SKILL.md | cut -d' ' -f1
```

### 6. Validate

Run the validation script before submitting:

```bash
npx tsx scripts/validate.ts
```

This checks frontmatter format, registry consistency, naming conventions, and SHA-256 integrity.

## Submitting

1. Fork this repository
2. Create your skill directory and update `registry.json`
3. Run `npx tsx scripts/validate.ts` to verify
4. Open a pull request with a clear description of what the skill does
5. Sign the CLA when prompted by the bot (first PR only)

## Review Criteria

Pull requests are reviewed for:

- **Quality**: Clear, actionable instructions that improve agent behavior
- **Security**: Skills with `requires.bins` or scripts are reviewed more carefully
- **Naming**: Follows conventions, no conflicts with existing skills
- **Scope**: One skill per PR unless they're closely related
- **Testing**: Author has tested with a running FlowHelm instance

## Updating an Existing Skill

1. Edit the `SKILL.md` file
2. Bump the `version` in both `SKILL.md` frontmatter and `registry.json`
3. Update the `sha256` in `registry.json`
4. Submit a PR describing the changes

## License

By submitting a skill, you agree that your contribution is licensed under Apache 2.0 (or the license specified in your skill directory). You retain copyright to your contribution.
