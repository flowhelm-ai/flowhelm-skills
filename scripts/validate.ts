#!/usr/bin/env npx tsx
/**
 * Validates all skills in the registry.
 *
 * Checks:
 * 1. Every directory in skills/ has a valid SKILL.md with frontmatter
 * 2. registry.json is valid and consistent with skill directories
 * 3. SHA-256 hashes match (if present)
 * 4. No orphaned entries (registry references non-existent skill)
 * 5. No unlisted skills (skill dir exists but not in registry)
 * 6. Naming conventions enforced
 *
 * Exit code 0 = all checks pass, 1 = failures found.
 */

import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import { createHash } from 'node:crypto';

// ─── Types ──────────────────────────────────────────────────────────────────

interface RegistryEntry {
  name: string;
  description: string;
  version: string;
  path: string;
  sha256?: string;
}

interface Registry {
  version: number;
  skills: RegistryEntry[];
}

interface ValidationError {
  skill: string;
  message: string;
}

// ─── Frontmatter Parser ─────────────────────────────────────────────────────

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data: Record<string, unknown> = {};
  let currentKey: string | null = null;
  let currentObj: Record<string, unknown> | null = null;

  for (const line of (match[1] ?? '').split('\n')) {
    const trimmed = line.trimEnd();
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const indented = trimmed.match(/^[ ]{2}(\w[\w-]*)\s*:\s*(.*)$/);
    if (indented && currentObj && currentKey) {
      const val = (indented[2] ?? '').trim();
      const arrMatch = val.match(/^\[(.*)\]$/);
      currentObj[indented[1] ?? ''] = arrMatch
        ? (arrMatch[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
        : val;
      continue;
    }

    const top = trimmed.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (top) {
      const key = top[1] ?? '';
      const val = (top[2] ?? '').trim();
      if (val === '') {
        currentKey = key;
        currentObj = {};
        data[key] = currentObj;
      } else {
        currentKey = null;
        currentObj = null;
        const arrMatch = val.match(/^\[(.*)\]$/);
        data[key] = arrMatch
          ? (arrMatch[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
          : val;
      }
    }
  }

  return data;
}

// ─── Validation ──────────────────────────────────────────────────────────────

async function validate(): Promise<boolean> {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const rootDir = path.resolve(scriptDir, '..');
  const skillsDir = path.join(rootDir, 'skills');
  const registryPath = path.join(rootDir, 'registry.json');
  const errors: ValidationError[] = [];

  // 1. Load and validate registry.json
  if (!fs.existsSync(registryPath)) {
    console.error('ERROR: registry.json not found');
    process.exit(1);
  }

  let registry: Registry;
  try {
    const raw = await fsp.readFile(registryPath, 'utf-8');
    registry = JSON.parse(raw) as Registry;
  } catch (err) {
    console.error(`ERROR: registry.json is not valid JSON: ${String(err)}`);
    process.exit(1);
  }

  if (typeof registry.version !== 'number') {
    errors.push({ skill: 'registry.json', message: 'Missing or invalid "version" field' });
  }

  if (!Array.isArray(registry.skills)) {
    console.error('ERROR: registry.json "skills" is not an array');
    process.exit(1);
  }

  // Check for duplicate names
  const names = registry.skills.map((s) => s.name);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length > 0) {
    errors.push({ skill: 'registry.json', message: `Duplicate skill names: ${dupes.join(', ')}` });
  }

  // 2. Validate each registry entry
  for (const entry of registry.skills) {
    const { name } = entry;

    // Naming convention
    if (!/^[a-z][a-z0-9-]*$/.test(name)) {
      errors.push({ skill: name, message: 'Name must be lowercase alphanumeric with hyphens' });
    }

    // Version must be semver
    if (!/^\d+\.\d+\.\d+$/.test(entry.version)) {
      errors.push({ skill: name, message: `Invalid version: ${entry.version}` });
    }

    // Description required
    if (!entry.description || entry.description.length === 0) {
      errors.push({ skill: name, message: 'Missing description' });
    }
    if (entry.description && entry.description.length > 256) {
      errors.push({ skill: name, message: `Description too long: ${String(entry.description.length)} chars (max 256)` });
    }

    // Path must exist
    const skillDir = path.join(rootDir, entry.path);
    if (!fs.existsSync(skillDir)) {
      errors.push({ skill: name, message: `Path does not exist: ${entry.path}` });
      continue;
    }

    // SKILL.md must exist
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) {
      errors.push({ skill: name, message: 'SKILL.md not found' });
      continue;
    }

    // Validate frontmatter
    const content = await fsp.readFile(skillMdPath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (fm['name'] !== name) {
      errors.push({ skill: name, message: `Frontmatter name "${String(fm['name'])}" does not match registry name "${name}"` });
    }

    if (!fm['description']) {
      errors.push({ skill: name, message: 'Frontmatter missing description' });
    }

    if (!fm['version']) {
      errors.push({ skill: name, message: 'Frontmatter missing version' });
    }

    // SHA-256 verification
    if (entry.sha256) {
      const hash = createHash('sha256').update(content).digest('hex');
      if (hash !== entry.sha256) {
        errors.push({
          skill: name,
          message: `SHA-256 mismatch: registry=${entry.sha256}, actual=${hash}`,
        });
      }
    }
  }

  // 3. Check for unlisted skills (dirs without registry entries)
  if (fs.existsSync(skillsDir)) {
    const dirs = await fsp.readdir(skillsDir, { withFileTypes: true });
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;
      const skillMdPath = path.join(skillsDir, dir.name, 'SKILL.md');
      if (!fs.existsSync(skillMdPath)) continue;

      const inRegistry = registry.skills.some((s) => s.name === dir.name);
      if (!inRegistry) {
        errors.push({ skill: dir.name, message: 'Skill directory exists but not listed in registry.json' });
      }
    }
  }

  // 4. Report results
  if (errors.length === 0) {
    console.log(`✓ All ${String(registry.skills.length)} skills validated successfully.`);
    return true;
  }

  console.error(`\n${String(errors.length)} validation error(s):\n`);
  for (const err of errors) {
    console.error(`  [${err.skill}] ${err.message}`);
  }
  console.error('');
  return false;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const ok = await validate();
  process.exit(ok ? 0 : 1);
}

void main();
