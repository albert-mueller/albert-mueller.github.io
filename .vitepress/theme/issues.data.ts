// VitePress data loader for the mirrored issues (see announcements.data.ts).
import { loadIssues } from '../announcements'
import type { AnnouncementSummary } from './announcements.data'

declare const data: AnnouncementSummary[]
export { data }

export default {
    load(): AnnouncementSummary[] {
        return loadIssues().map(({ bodyHTML, ...summary }) => summary)
    },
}
