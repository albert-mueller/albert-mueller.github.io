#!/usr/bin/env node
// Mirrors the patcher's GitHub Discussions into the website:
//   - pinned discussions first, in pin order
//   - then every other open discussion of every category, newest first
// Closed discussions are left out, so closing one removes it from the site.
// Set ANNOUNCEMENTS_CATEGORY (e.g. "announcements") to limit the list to
// one category again.
//
// Open issues are mirrored the same way (pinned first, then newest).
//
// Writes:
//   .vitepress/announcements.json  - read at build time to generate
//                                    /announcements/ and one page per post
//   public/announcements.xml       - RSS 2.0 feed of the same posts
//   .vitepress/issues.json         - same for /issues/
//   public/issues.xml              - RSS 2.0 feed of the open issues
//
// All four files are build artifacts (git-ignored). The CI workflow runs this
// script before `vitepress build`. Locally:
//   GITHUB_TOKEN=$(gh auth token) yarn announcements
//
// The GitHub GraphQL API needs a token even for public data; the workflow's
// built-in GITHUB_TOKEN is enough since the patcher repo is public.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT_JSON = path.join(ROOT, '.vitepress', 'announcements.json')
const OUT_FEED = path.join(ROOT, 'public', 'announcements.xml')
const OUT_ISSUES_JSON = path.join(ROOT, '.vitepress', 'issues.json')
const OUT_ISSUES_FEED = path.join(ROOT, 'public', 'issues.xml')

const REPO = process.env.ANNOUNCEMENTS_REPO || 'albert-mueller/OpenCore-Legacy-Patcher-T2'
const CATEGORY = process.env.ANNOUNCEMENTS_CATEGORY || ''
const LIMIT = Number(process.env.ANNOUNCEMENTS_LIMIT || 100)
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

const SITE_URL = 'https://albert-mueller.github.io/'
const SITE_TITLE = 'OpenCore Legacy Patcher T2'

const [OWNER, NAME] = REPO.split('/')

// Note: repository.discussionCategory(slug:) can't be resolved with a GitHub
// Actions token ("Could not resolve to a DiscussionCategory"), so list the
// categories and pick the right one by slug instead.
const CATEGORIES_QUERY = `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    discussionCategories(first: 100) { nodes { id name slug } }
  }
}`

const DISCUSSION_FIELDS = `
fragment AnnouncementFields on Discussion {
  number
  title
  url
  closed
  createdAt
  updatedAt
  lastEditedAt
  bodyHTML
  bodyText
  author { login url }
  category { name slug }
  comments { totalCount }
}`

const DISCUSSIONS_QUERY = `
query ($owner: String!, $name: String!, $category: ID, $first: Int!, $after: String) {
  repository(owner: $owner, name: $name) {
    discussions(first: $first, after: $after, categoryId: $category, states: [OPEN],
                orderBy: { field: CREATED_AT, direction: DESC }) {
      pageInfo { hasNextPage endCursor }
      nodes { ...AnnouncementFields }
    }
  }
}
${DISCUSSION_FIELDS}`

const PINNED_QUERY = `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    pinnedDiscussions(first: 25) {
      nodes { discussion { ...AnnouncementFields } }
    }
  }
}
${DISCUSSION_FIELDS}`

const ISSUE_FIELDS = `
fragment IssueFields on Issue {
  number
  title
  url
  closed
  createdAt
  updatedAt
  lastEditedAt
  bodyHTML
  bodyText
  author { login url }
  labels(first: 10) { nodes { name color } }
  comments { totalCount }
}`

const ISSUES_QUERY = `
query ($owner: String!, $name: String!, $first: Int!, $after: String) {
  repository(owner: $owner, name: $name) {
    issues(first: $first, after: $after, states: [OPEN],
           orderBy: { field: CREATED_AT, direction: DESC }) {
      pageInfo { hasNextPage endCursor }
      nodes { ...IssueFields }
    }
  }
}
${ISSUE_FIELDS}`

const PINNED_ISSUES_QUERY = `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    pinnedIssues(first: 3) {
      nodes { issue { ...IssueFields } }
    }
  }
}
${ISSUE_FIELDS}`

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'oclp-t2-website',
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    throw new Error(`GitHub API responded with ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  return json.data
}

function excerpt(text, max = 220) {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, '')}…`
}

async function fetchAnnouncements() {
  let categoryId = null
  if (CATEGORY) {
    const categoryData = await graphql(CATEGORIES_QUERY, { owner: OWNER, name: NAME })
    const categories = categoryData.repository?.discussionCategories?.nodes ?? []
    const category = categories.find((c) => c.slug === CATEGORY || c.name.toLowerCase() === CATEGORY.toLowerCase())
    if (!category) {
      const available = categories.map((c) => c.slug).join(', ') || 'none visible'
      throw new Error(`Discussion category "${CATEGORY}" not found in ${REPO} (available: ${available})`)
    }
    categoryId = category.id
  }

  const nodes = []
  let after = null
  do {
    const data = await graphql(DISCUSSIONS_QUERY, {
      owner: OWNER,
      name: NAME,
      category: categoryId,
      first: Math.min(50, LIMIT - nodes.length),
      after,
    })
    const page = data.repository.discussions
    nodes.push(...page.nodes)
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (after && nodes.length < LIMIT)

  const pinnedData = await graphql(PINNED_QUERY, { owner: OWNER, name: NAME })
  const pinned = pinnedData.repository.pinnedDiscussions.nodes.map((n) => n.discussion)
  const pinnedNumbers = new Set(pinned.map((d) => d.number))

  const merged = [...pinned, ...nodes.filter((d) => !pinnedNumbers.has(d.number))]
    .filter((d) => !d.closed)

  return merged.map((d) => ({
    number: d.number,
    pinned: pinnedNumbers.has(d.number),
    category: d.category?.name ?? null,
    title: d.title.trim(),
    url: d.url,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    lastEditedAt: d.lastEditedAt,
    // null when the author's GitHub account was deleted ("ghost")
    author: d.author ? { login: d.author.login, url: d.author.url } : null,
    comments: d.comments.totalCount,
    excerpt: excerpt(d.bodyText),
    // Already sanitised by GitHub, same HTML github.com renders.
    bodyHTML: d.bodyHTML,
  }))
}

async function fetchIssues() {
  const nodes = []
  let after = null
  do {
    const data = await graphql(ISSUES_QUERY, {
      owner: OWNER,
      name: NAME,
      first: Math.min(50, LIMIT - nodes.length),
      after,
    })
    const page = data.repository.issues
    nodes.push(...page.nodes)
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (after && nodes.length < LIMIT)

  const pinnedData = await graphql(PINNED_ISSUES_QUERY, { owner: OWNER, name: NAME })
  const pinned = pinnedData.repository.pinnedIssues.nodes.map((n) => n.issue)
  const pinnedNumbers = new Set(pinned.map((i) => i.number))

  return [...pinned, ...nodes.filter((i) => !pinnedNumbers.has(i.number))]
    .filter((i) => !i.closed)
    .map((i) => ({
      number: i.number,
      pinned: pinnedNumbers.has(i.number),
      category: null,
      labels: i.labels.nodes.map((l) => ({ name: l.name, color: l.color })),
      title: i.title.trim(),
      url: i.url,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      lastEditedAt: i.lastEditedAt,
      author: i.author ? { login: i.author.login, url: i.author.url } : null,
      comments: i.comments.totalCount,
      excerpt: excerpt(i.bodyText),
      bodyHTML: i.bodyHTML,
    }))
}

// What the two mirrored lists look like on the site and in their feeds.
const KINDS = {
  announcements: {
    json: OUT_JSON,
    feed: OUT_FEED,
    path: 'announcements/',
    feedFile: 'announcements.xml',
    title: `${SITE_TITLE} – Announcements`,
    description: `Open discussions about ${SITE_TITLE}, mirrored from GitHub Discussions.`,
    discuss: 'Discuss this announcement on GitHub',
  },
  issues: {
    json: OUT_ISSUES_JSON,
    feed: OUT_ISSUES_FEED,
    path: 'issues/',
    feedFile: 'issues.xml',
    title: `${SITE_TITLE} – Issues`,
    description: `Open issues of ${SITE_TITLE}, mirrored from GitHub.`,
    discuss: 'Discuss this issue on GitHub',
  },
}

const escapeXml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const cdata = (s) => `<![CDATA[${String(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

function buildFeed(announcements, kind) {
  // Use the newest activity rather than "now" so the feed only changes when
  // an announcement actually changes.
  const newest = announcements
    .map((a) => a.lastEditedAt || a.createdAt)
    .sort()
    .at(-1)

  const items = announcements.map((a) => {
    const link = `${SITE_URL}${kind.path}${a.number}.html`
    const content = `${a.bodyHTML}\n<p><a href="${escapeXml(a.url)}">${kind.discuss}</a></p>`
    return [
      '    <item>',
      `      <title>${escapeXml(a.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(a.url)}</guid>`,
      `      <comments>${escapeXml(a.url)}</comments>`,
      `      <pubDate>${new Date(a.createdAt).toUTCString()}</pubDate>`,
      a.author ? `      <dc:creator>${escapeXml(a.author.login)}</dc:creator>` : null,
      `      <description>${escapeXml(a.excerpt)}</description>`,
      `      <content:encoded>${cdata(content)}</content:encoded>`,
      '    </item>',
    ].filter(Boolean).join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(kind.title)}</title>`,
    `    <link>${escapeXml(`${SITE_URL}${kind.path}`)}</link>`,
    `    <description>${escapeXml(kind.description)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${escapeXml(`${SITE_URL}${kind.feedFile}`)}" rel="self" type="application/rss+xml"/>`,
    newest ? `    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : null,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].filter((line) => line !== null).join('\n')
}

function write(kindName, items) {
  const kind = KINDS[kindName]
  fs.mkdirSync(path.dirname(kind.json), { recursive: true })
  fs.mkdirSync(path.dirname(kind.feed), { recursive: true })
  const source = kindName === 'issues' ? `${REPO} (issues)` : `${REPO} (${CATEGORY || 'all categories'})`
  fs.writeFileSync(kind.json, `${JSON.stringify({ source, [kindName]: items }, null, 2)}\n`)
  fs.writeFileSync(kind.feed, buildFeed(items, kind))
}

function readExisting(kindName) {
  try {
    return JSON.parse(fs.readFileSync(KINDS[kindName].json, 'utf8'))[kindName] ?? []
  } catch {
    return []
  }
}

function writeExisting() {
  for (const kindName of Object.keys(KINDS)) write(kindName, readExisting(kindName))
}

async function main() {
  if (!TOKEN) {
    console.warn('GITHUB_TOKEN is not set - skipping the download of announcements and issues.')
    if (process.env.CI) process.exit(1)
    writeExisting()
    return
  }
  const announcements = await fetchAnnouncements()
  const issues = await fetchIssues()
  write('announcements', announcements)
  write('issues', issues)
  console.log(`Wrote ${announcements.length} announcement(s) and ${issues.length} issue(s) from ${REPO}`)
}

main().catch((err) => {
  console.error(`::error::Could not fetch announcements/issues: ${err.message}`)
  // In CI, fail instead of deploying a site that silently lost its
  // announcements; the previously deployed site stays online.
  if (process.env.CI) process.exit(1)
  writeExisting()
})
