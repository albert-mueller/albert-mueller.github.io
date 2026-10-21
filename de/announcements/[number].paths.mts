import { loadAnnouncements } from '../../.vitepress/announcements'

// German version (same data, German UI). One page per announcement: /de/announcements/<discussion number>.html
export default {
    paths() {
        return loadAnnouncements().map((announcement) => ({
            params: { ...announcement, number: String(announcement.number) },
        }))
    },
}
