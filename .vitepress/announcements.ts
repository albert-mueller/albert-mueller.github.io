// Shared loader for the announcements written by scripts/fetch-announcements.mjs.
// Used by the config (sidebar), the dynamic route announcements/[number]
// and the data loader for the announcement lists.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

export interface Comment {
    url: string
    createdAt: string
    lastEditedAt: string | null
    author: { login: string, url: string } | null
    bodyHTML: string
}

export interface Announcement {
    number: number
    pinned: boolean
    category: string | null
    // Only set for issues
    labels?: { name: string, color: string }[]
    commentList?: Comment[]
    title: string
    url: string
    createdAt: string
    updatedAt: string
    lastEditedAt: string | null
    author: { login: string, url: string } | null
    comments: number
    excerpt: string
    bodyHTML: string
}

export const ANNOUNCEMENTS_FILE = fileURLToPath(new URL('./announcements.json', import.meta.url))

export const ISSUES_FILE = fileURLToPath(new URL('./issues.json', import.meta.url))

// Returns [] when the file has not been generated (e.g. local build without
// a token), so the rest of the site still builds.
function load(file: string, key: string): Announcement[] {
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'))
        return Array.isArray(data[key]) ? data[key] : []
    } catch {
        return []
    }
}

export const loadAnnouncements = () => load(ANNOUNCEMENTS_FILE, 'announcements')

// Open issues, same shape (plus labels).
export const loadIssues = () => load(ISSUES_FILE, 'issues')
