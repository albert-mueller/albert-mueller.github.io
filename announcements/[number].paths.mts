import { loadAnnouncements } from '../.vitepress/announcements'

// One page per announcement: /announcements/<discussion number>.html
export default {
    paths() {
        return loadAnnouncements().map((announcement) => ({
            params: { ...announcement, number: String(announcement.number) },
        }))
    },
}
