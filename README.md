# FlowHelm Skills Registry

Official skill registry for [FlowHelm](https://github.com/flowhelm-ai/flowhelm) — the secure, multi-tenant AI agent orchestrator.

## Available Skills

| Skill | Description | Requires |
|---|---|---|
| [telegram](skills/telegram/) | Telegram message formatting, media handling, group chat behavior | `channels: [telegram]` |
| [whatsapp](skills/whatsapp/) | WhatsApp message formatting, reactions, media handling, platform conventions | `channels: [whatsapp]` |
| [voice](skills/voice/) | Voice message handling — transcription awareness, conversational tone | `channels: [telegram, whatsapp]` |
| [browser](skills/browser/) | Web browsing — page fetching, content extraction, search workflows | — |
| [google-email](skills/google-email/) | Gmail — email etiquette, response formatting, full API operations | `channels: [gmail]` |
| [google-calendar](skills/google-calendar/) | Google Calendar — events, agenda, scheduling, freebusy | `channels: [gmail]` |
| [google-contacts](skills/google-contacts/) | Google Contacts — search, create, update, delete contacts | `channels: [gmail]` |
| [google-drive](skills/google-drive/) | Google Drive — files, folders, sharing, upload, permissions | `channels: [gmail]` |
| [google-tasks](skills/google-tasks/) | Google Tasks — task lists, tasks, due dates, completion | `channels: [gmail]` |

## Installing Skills

```bash
# Install from registry
flowhelm install telegram

# List installed skills
flowhelm list

# Search available skills
flowhelm search telegram

# Uninstall
flowhelm uninstall telegram
```

Skills can also be installed via chat — ask your agent to run `install_skill`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting skills.

## License

Skills in this repository are licensed under Apache 2.0 unless stated otherwise in the skill directory.
