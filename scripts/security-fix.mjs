#!/usr/bin/env node
// Used by .github/workflows/security-scan.yml.
//
// Reads an OSV-Scanner JSON report for yarn.lock and prints a Markdown
// summary of the vulnerable packages. With --apply it also raises the
// affected versions in package.json to the nearest fixed release:
//   - direct dependencies: their range in (dev)dependencies is raised
//   - indirect dependencies: a "**/<name>" entry in "resolutions" is added
//     (or an existing resolution for that package is raised)
// Afterwards the workflow runs `yarn install` to update yarn.lock.
//
// A package is left alone (and reported as "needs manual fix") when no fixed
// version exists yet, or when its vulnerable copies span several major
// versions, since forcing one version on all of them could break the site.
//
// Exit codes: 0 = no vulnerabilities, 2 = vulnerabilities found, 1 = error.

import { readFileSync, writeFileSync } from 'node:fs'

const [reportPath, ...flags] = process.argv.slice(2)
const apply = flags.includes('--apply')
if (!reportPath) {
  console.error('usage: security-fix.mjs <osv-report.json> [--apply]')
  process.exit(1)
}

// --- minimal semver helpers (no dependencies) ------------------------------
function parse(v) {
  const m = String(v).trim().replace(/^v/, '').match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?/)
  if (!m) return null
  return { major: +m[1], minor: +(m[2] ?? 0), patch: +(m[3] ?? 0), pre: m[4] ?? '' }
}
function cmp(a, b) {
  const x = parse(a), y = parse(b)
  if (!x || !y) return 0
  for (const k of ['major', 'minor', 'patch']) if (x[k] !== y[k]) return x[k] - y[k]
  if (x.pre === y.pre) return 0
  if (!x.pre) return 1 // 1.0.0 > 1.0.0-beta
  if (!y.pre) return -1
  return x.pre < y.pre ? -1 : 1
}
const major = (v) => parse(v)?.major
// Lowest concrete version mentioned in a range such as "^6.2.2" or ">=1.0".
const rangeMin = (range) => String(range).match(/\d+(?:\.\d+){0,2}(?:-[0-9A-Za-z.-]+)?/)?.[0]

// For one installed version, find the lowest version that fixes this advisory.
// Returns { affected: false } | { affected: true, fixed: string | null }
function fixFor(vuln, name, version) {
  let affected = false
  let fixed = null
  for (const aff of vuln.affected ?? []) {
    if (aff.package?.name !== name || aff.package?.ecosystem !== 'npm') continue
    if ((aff.versions ?? []).includes(version)) affected = true
    for (const range of aff.ranges ?? []) {
      if (range.type !== 'SEMVER' && range.type !== 'ECOSYSTEM') continue
      let start = null
      for (const ev of range.events ?? []) {
        if (ev.introduced !== undefined) start = ev.introduced
        const end = ev.fixed ?? ev.last_affected
        if (end === undefined || start === null) continue
        const inRange = (start === '0' || cmp(version, start) >= 0)
          && (ev.fixed !== undefined ? cmp(version, end) < 0 : cmp(version, end) <= 0)
        if (inRange) {
          affected = true
          if (ev.fixed !== undefined && (!fixed || cmp(ev.fixed, fixed) < 0)) fixed = ev.fixed
        }
        start = null
      }
      // Open-ended range: introduced with no fix after it
      if (start !== null && (start === '0' || cmp(version, start) >= 0)) affected = true
    }
  }
  return { affected, fixed }
}

// --- read the report -------------------------------------------------------
let report
try {
  report = JSON.parse(readFileSync(reportPath, 'utf8') || '{}')
} catch (err) {
  console.error(`Could not read ${reportPath}: ${err.message}`)
  process.exit(1)
}

// name -> { versions: Map(version -> { ids:Set, fixed, unfixable }), severity }
const vulnerable = new Map()
for (const result of report.results ?? []) {
  for (const pkg of result.packages ?? []) {
    const { name, version, ecosystem } = pkg.package ?? {}
    if (ecosystem !== 'npm' || !name || !version) continue
    const severity = Math.max(0, ...(pkg.groups ?? []).map((g) => parseFloat(g.max_severity) || 0))
    for (const vuln of pkg.vulnerabilities ?? []) {
      // OSV-Scanner only lists advisories that affect this version; fixFor()
      // just looks up the nearest fixed release.
      const { fixed } = fixFor(vuln, name, version)
      const entry = vulnerable.get(name) ?? { versions: new Map(), severity: 0 }
      entry.severity = Math.max(entry.severity, severity)
      const v = entry.versions.get(version) ?? { ids: new Set(), fixed: null, unfixable: false }
      v.ids.add(vuln.id)
      if (fixed) {
        if (!v.fixed || cmp(fixed, v.fixed) > 0) v.fixed = fixed
      } else {
        v.unfixable = true
      }
      entry.versions.set(version, v)
      vulnerable.set(name, entry)
    }
  }
}

if (vulnerable.size === 0) {
  console.log('No known vulnerabilities in the website dependencies.')
  process.exit(0)
}

// --- decide on fixes -------------------------------------------------------
const pkgJson = apply ? JSON.parse(readFileSync('package.json', 'utf8')) : null
const changed = []
const manual = []

for (const [name, entry] of [...vulnerable].sort()) {
  const versions = [...entry.versions]
  const ids = [...new Set(versions.flatMap(([, v]) => [...v.ids]))].join(', ')
  const label = `\`${name}\` ${versions.map(([ver]) => ver).join(', ')} (${ids}${entry.severity ? `, CVSS ${entry.severity}` : ''})`

  if (versions.some(([, v]) => v.unfixable)) {
    manual.push(`${label}: no fixed version listed in the advisory yet`)
    continue
  }
  const target = versions.map(([, v]) => v.fixed).sort(cmp).at(-1)
  const majors = new Set(versions.map(([, v]) => major(v.fixed)))
  if (majors.size > 1) {
    manual.push(`${label}: vulnerable copies on several major versions (fixes ${versions.map(([, v]) => v.fixed).join(', ')})`)
    continue
  }
  if (!apply) {
    changed.push(`${label} → ${target}`)
    continue
  }

  const wanted = `^${target}`
  let touched = false
  for (const field of ['dependencies', 'devDependencies']) {
    const deps = pkgJson[field]
    if (deps?.[name] && cmp(rangeMin(deps[name]), target) < 0) {
      deps[name] = wanted
      touched = true
    }
  }
  pkgJson.resolutions ??= {}
  const res = pkgJson.resolutions
  for (const key of Object.keys(res)) {
    if ((key === name || key.endsWith(`/${name}`)) && cmp(rangeMin(res[key]), target) < 0) {
      res[key] = wanted
      touched = true
    }
  }
  const isDirect = Boolean(pkgJson.dependencies?.[name] || pkgJson.devDependencies?.[name])
  const nested = versions.length > 1 || !isDirect
  if (nested && !res[`**/${name}`]) {
    res[`**/${name}`] = wanted
    touched = true
  }
  if (touched) changed.push(`${label} → ${wanted}`)
  else manual.push(`${label}: already pinned to a fixed range, but yarn.lock still resolves a vulnerable version`)
}

if (apply) writeFileSync('package.json', `${JSON.stringify(pkgJson, null, 3)}\n`)

// --- summary ---------------------------------------------------------------
const out = []
if (changed.length) out.push(apply ? '### Fixed automatically' : '### Fixable', ...changed.map((l) => `- ${l}`), '')
if (manual.length) out.push('### Needs a manual fix', ...manual.map((l) => `- ${l}`), '')
console.log(out.join('\n'))
process.exit(2)
