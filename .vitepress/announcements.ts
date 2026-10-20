// Shared loader for the announcements written by scripts/fetch-announcements.mjs.
// Used by the config (sidebar), the dynamic route announcements/[number]
// and the data loader for the announcement lists.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

export interface Announcement {
    number: number
    pinned: boolean
    category: string | null
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

// Returns [] when the file has not been generated (e.g. local build without
// a token), so the rest of the site still builds.
export function loadAnnouncements(): Announcement[] {
    try {
        const data = JSON.parse(fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf8'))
        return Array.isArray(data.announcements) ? data.announcements : []
    } catch {
        return []
    }
}
