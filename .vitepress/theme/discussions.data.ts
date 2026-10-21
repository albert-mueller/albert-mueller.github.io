// VitePress data loader for the mirrored discussions (see announcements.data.ts).
import { loadDiscussions } from '../announcements'
import type { AnnouncementSummary } from './announcements.data'

declare const data: AnnouncementSummary[]
export { data }

export default {
    load(): AnnouncementSummary[] {
        // The lists don't need the bodies or comments, only the discussion pages do.
        return loadDiscussions().map(({ bodyHTML, commentList, ...summary }) => summary)
    },
}
