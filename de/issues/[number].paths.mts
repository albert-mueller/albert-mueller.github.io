import { loadIssues } from '../../.vitepress/announcements'

// German locale: one page per open issue at /de/issues/<issue number>.html
export default {
    paths() {
        return loadIssues().map((issue) => ({
            params: { ...issue, number: String(issue.number), kind: 'issues' },
        }))
    },
}
