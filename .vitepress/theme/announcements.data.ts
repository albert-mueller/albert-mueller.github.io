// VitePress data loader. defineLoader() is not imported on purpose: this repo's
// package.json has no "type": "module", and importing the ESM-only vitepress
// package from a .ts loader would break the build.
import { loadAnnouncements, type Announcement } from '../announcements'

// The lists only need the summary, not the full HTML body.
export type AnnouncementSummary = Omit<Announcement, 'bodyHTML' | 'commentList'>

declare const data: AnnouncementSummary[]
export { data }

export default {
    load(): AnnouncementSummary[] {
        // The lists don't need the bodies or comments, only the pages do.
        return loadAnnouncements().map(({ bodyHTML, commentList, ...summary }) => summary)
    },
}
