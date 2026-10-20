// VitePress data loader for the mirrored issues (see announcements.data.ts).
import { loadIssues } from '../announcements'
import type { AnnouncementSummary } from './announcements.data'

declare const data: AnnouncementSummary[]
export { data }

export default {
    load(): AnnouncementSummary[] {
        // The lists don't need the bodies or comments, only the issue pages do.
        return loadIssues().map(({ bodyHTML, commentList, ...summary }) => summary)
    },
}
