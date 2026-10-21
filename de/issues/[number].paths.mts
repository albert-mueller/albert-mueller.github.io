import { loadIssues } from '../../.vitepress/announcements'

// German version (same data, German UI). One page per open issue: /de/issues/<issue number>.html
export default {
    paths() {
        return loadIssues().map((issue) => ({
            params: { ...issue, number: String(issue.number), kind: 'issues' },
        }))
    },
}
