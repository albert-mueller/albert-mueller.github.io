import { loadAnnouncements } from '../../.vitepress/announcements'

// German locale: one page per announcement at /de/announcements/<discussion number>.html
// (same content as the English page, only the surrounding UI is translated).
export default {
    paths() {
        return loadAnnouncements().map((announcement) => ({
            params: { ...announcement, number: String(announcement.number) },
        }))
    },
}
